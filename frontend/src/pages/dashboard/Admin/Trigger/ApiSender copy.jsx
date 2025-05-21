import React, { useState, useEffect, useRef } from 'react';
import ventiData from 'frontend/src/pages/dashboard/Admin/Trigger/generated_ventilator_data.json';
import mriData from 'frontend/src/pages/dashboard/Admin/Trigger/generated_mri_data.json';
import patientData from 'frontend/src/pages/dashboard/Admin/Trigger/generated_patient_monitor_data.json';

const API_ENDPOINTS = {
  venti: 'http://127.0.0.1:5000/venti/predict',
  mri: 'http://127.0.0.1:5000/mri/predict',
  patient: 'http://127.0.0.1:5000/patient/predict',
};

const DataProcessor = ({ onResponse }) => {
  const [responseMessages, setResponseMessages] = useState({
    venti: [],
    mri: [],
    patient: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndices, setCurrentIndices] = useState({
    venti: 0,
    mri: 0,
    patient: 0,
  });
  const sequenceRef = useRef(0); // Track sequence of responses
  const intervalRef = useRef(null);

  const sendDataToApi = async (data, endpoint, type) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(`${type} API response:`, result);
      return {
        status: response.ok ? 'success' : 'error',
        message: result.message || JSON.stringify(result),
        data,
        result,
      };
    } catch (error) {
      console.log(`${type} API error:`, error);
      return {
        status: 'error',
        message: `Error sending ${type} data: ${error.message}`,
        data,
        result: null,
      };
    }
  };

  const processBatch = async () => {
    setCurrentIndices((prev) => {
      const newIndices = { ...prev };
      const dataSources = {
        venti: ventiData,
        mri: mriData,
        patient: patientData,
      };

      ['venti', 'mri', 'patient'].forEach(async (type) => {
        const dataArray = dataSources[type];
        if (dataArray.length === 0) {
          const result = {
            status: 'error',
            message: `No data available for ${type}`,
            data: null,
            result: null,
          };
          setResponseMessages((prevMessages) => ({
            ...prevMessages,
            [type]: [...prevMessages[type], result].slice(-10),
          }));
          return;
        }

        const index = prev[type] >= dataArray.length ? 0 : prev[type];
        const item = dataArray[index];
        const result = await sendDataToApi(item, API_ENDPOINTS[type], type);

        // Send response to parent
        if (onResponse) {
          onResponse({
            type,
            sequence: sequenceRef.current++,
            timestamp: new Date().toISOString(),
            impact_level: result.result?.impact_level || 'Unknown',
            prediction: result.result?.prediction || 'Unknown',
          });
        }

        setResponseMessages((prevMessages) => ({
          ...prevMessages,
          [type]: [...prevMessages[type], result].slice(-10),
        }));

        newIndices[type] = index + 1 >= dataArray.length ? 0 : index + 1;
      });

      return newIndices;
    });
  };

  const startProcessing = () => {
    if (!isProcessing) {
      setIsProcessing(true);
      processBatch();
      intervalRef.current = setInterval(processBatch, 5000);
    }
  };

  const stopProcessing = () => {
    if (isProcessing) {
      clearInterval(intervalRef.current);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto" >
      <h1 className="text-2xl font-bold mb-4">Medical Data Processor</h1>
      <div className="mb-6">
        <button
          onClick={startProcessing}
          disabled={isProcessing}
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 mr-2`}
        >
          Start Processing
        </button>
        <button
          onClick={stopProcessing}
          disabled={!isProcessing}
          className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400`}
        >
          Stop Processing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
        {['venti', 'mri', 'patient'].map((type) => (
          <div key={type} className="border p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold capitalize mb-2">{type} Data</h2>
            <p className="text-sm mb-2">
              Current Index: {currentIndices[type]} /{' '}
              {(type === 'venti' ? ventiData : type === 'mri' ? mriData : patientData).length}
            </p>
            <div className="max-h-64 overflow-y-auto">
              {responseMessages[type].length > 0 ? (
                responseMessages[type].map((res, index) => (
                  <div
                    key={index}
                    className={`p-2 mb-2 rounded ${
                      res.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <p className="text-sm">
                      <strong>Data:</strong>{' '}
                      {res.data ? JSON.stringify(res.data).slice(0, 50) + '...' : 'N/A'}
                    </p>
                    <p className="text-sm">
                      <strong>Result:</strong> {res.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No data processed yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataProcessor;
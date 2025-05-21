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

  useEffect(() => {
    // Automatically start processing when component mounts
    processBatch();
    intervalRef.current = setInterval(processBatch, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="hidden">
      {/* Hide UI elements to keep the interface clean */}
    </div>
  );
};

export default DataProcessor;

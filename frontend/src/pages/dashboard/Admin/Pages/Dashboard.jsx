import React, { useState } from 'react';
import { Grid, Stack, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiCard from '@mui/material/Card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Layout from '../components/Layout/Layout';
import AppTheme from '../../../form/admin/shared-theme/AppTheme';
import DataProcessor from '../Trigger/ApiSender';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...(theme.palette.mode === 'dark' && {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)({
  flex: 1,
  minHeight: '100vh',
  padding: '60px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// Styled TableCell for compact table
const CompactTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: '0.85rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '0.75rem',
    padding: theme.spacing(0.5),
  },
}));

const Dashboard = () => {
  const [modelData, setModelData] = useState({
    venti: [],
    mri: [],
    patient: [],
  });
  const [loading, setLoading] = useState(false);

  const handleResponse = (response) => {
    setModelData((prev) => ({
      ...prev,
      [response.type]: [
        ...prev[response.type],
        {
          sequence: response.sequence,
          timestamp: response.timestamp,
          impact_level: response.impact_level,
          impact_value: mapImpactLevelToValue(response.impact_level),
          prediction: response.prediction,
        },
      ].slice(-20), // Keep last 20 points for graphing
    }));
  };

  const mapImpactLevelToValue = (impact_level) => {
    switch (impact_level) {
      case 'High Impact':
        return 3;
      case 'Moderate Impact':
        return 2;
      case 'Low Impact':
        return 1;
      default:
        return 1; // Default to Low Impact if unknown
    }
  };

  const yAxisFormatter = (value) => {
    return ['Low', 'Moderate', 'High'][value - 1]; // Map 1,2,3 to Low, Moderate, High
  };

  const tooltipFormatter = (value) => {
    return ['Low Impact', 'Moderate Impact', 'High Impact'][value - 1]; // Map 1,2,3 for tooltip
  };

  const combinedData = modelData.venti.map((item, index) => ({
    sequence: item.sequence,
    venti: item.impact_value,
    mri: modelData.mri[index]?.impact_value || 1, // Default to 1 (Low) if no data
    patient: modelData.patient[index]?.impact_value || 1, // Default to 1 (Low) if no data
  }));

  // Calculate impact level counts for each model
  const calculateImpactCounts = (data) => {
    return data.reduce(
      (counts, item) => {
        if (item.impact_value === 1) counts.low += 1;
        else if (item.impact_value === 2) counts.moderate += 1;
        else if (item.impact_value === 3) counts.high += 1;
        return counts;
      },
      { low: 0, moderate: 0, high: 0 }
    );
  };

  const impactCounts = {
    venti: calculateImpactCounts(modelData.venti),
    mri: calculateImpactCounts(modelData.mri),
    patient: calculateImpactCounts(modelData.patient),
  };

  // Calculate rolling average impact value (window of 10 points)
  const calculateRollingAverage = (data, windowSize = 10) => {
    return data.map((item, index) => {
      const start = Math.max(0, index - windowSize + 1);
      const windowData = data.slice(start, index + 1);
      const average = windowData.reduce((sum, d) => sum + d.impact_value, 0) / windowData.length;
      return {
        sequence: item.sequence,
        average: Number(average.toFixed(2)), // Round to 2 decimal places
      };
    });
  };

  // Rolling average data for the new graph
  const rollingAverageData = modelData.venti.map((item, index) => ({
    sequence: item.sequence,
    venti: calculateRollingAverage(modelData.venti)[index]?.average || 1,
    mri: calculateRollingAverage(modelData.mri)[index]?.average || 1,
    patient: calculateRollingAverage(modelData.patient)[index]?.average || 1,
  }));

  if (loading) {
    return (
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Layout>
          <SignInContainer>
            <CircularProgress />
          </SignInContainer>
        </Layout>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Layout>
        <SignInContainer>
          <DataProcessor onResponse={handleResponse} />
          <Grid container spacing={4}>
            {/* First Row */}
            {/* Venti Graph */}
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6" gutterBottom>Ventilator </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={modelData.venti}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sequence" />
                    <YAxis
                      domain={[1, 3]}
                      ticks={[1, 2, 3]}
                      tickFormatter={yAxisFormatter}
                      width={80}
                    />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Line type="monotone" dataKey="impact_value" stroke="#8884d8" name="Impact Level" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* MRI Graph */}
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6" gutterBottom>MRI </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={modelData.mri}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sequence" />
                    <YAxis
                      domain={[1, 3]}
                      ticks={[1, 2, 3]}
                      tickFormatter={yAxisFormatter}
                      width={80}
                    />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Line type="monotone" dataKey="impact_value" stroke="#82ca9d" name="Impact Level" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Second Row */}
            {/* Patient Graph */}
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6" gutterBottom>Patient Monitor </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={modelData.patient}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sequence" />
                    <YAxis
                      domain={[1, 3]}
                      ticks={[1, 2, 3]}
                      tickFormatter={yAxisFormatter}
                      width={80}
                    />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Line type="monotone" dataKey="impact_value" stroke="#ffc658" name="Impact Level" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Combined Graph */}
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6" gutterBottom>Combined Models </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sequence" />
                    <YAxis
                      domain={[1, 3]}
                      ticks={[1, 2, 3]}
                      tickFormatter={yAxisFormatter}
                      width={80}
                    />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Line type="monotone" dataKey="venti" stroke="#8884d8" name="Ventilator" />
                    <Line type="monotone" dataKey="mri" stroke="#82ca9d" name="MRI" />
                    <Line type="monotone" dataKey="patient" stroke="#ffc658" name="Patient" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Third Row */}
            {/* Rolling Average Graph */}
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6" gutterBottom>Rolling Average Impact</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={rollingAverageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sequence" />
                    <YAxis
                      domain={[1, 3]}
                      tickFormatter={(value) => value.toFixed(1)}
                      width={80}
                    />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Legend />
                    <Line type="monotone" dataKey="venti" stroke="#8884d8" name="Ventilator" />
                    <Line type="monotone" dataKey="mri" stroke="#82ca9d" name="MRI" />
                    <Line type="monotone" dataKey="patient" stroke="#ffc658" name="Patient" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Impact Level Counts Table */}
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6" gutterBottom>Impact Level Counts</Typography>
                <TableContainer component={Paper} style={{ minHeight: '250px'}}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <CompactTableCell>Model</CompactTableCell>
                        <CompactTableCell align="right">Low</CompactTableCell>
                        <CompactTableCell align="right">Moderate</CompactTableCell>
                        <CompactTableCell align="right">High</CompactTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {['venti', 'mri', 'patient'].map((model) => (
                        <TableRow key={model}>
                          <CompactTableCell component="th" scope="row">
                            {model.charAt(0).toUpperCase() + model.slice(1)}
                          </CompactTableCell>
                          <CompactTableCell align="right">{impactCounts[model].low}</CompactTableCell>
                          <CompactTableCell align="right">{impactCounts[model].moderate}</CompactTableCell>
                          <CompactTableCell align="right">{impactCounts[model].high}</CompactTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </SignInContainer>
      </Layout>
    </AppTheme>
  );
};

export default Dashboard;
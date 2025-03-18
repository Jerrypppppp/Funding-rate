import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, TableSortLabel, CircularProgress, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { formatNumber, formatPercentage } from '../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FearGreed() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('value');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fear-greed');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching fear and greed data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3600000); // 每小時更新
    return () => clearInterval(interval);
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = data?.indicators ? [...data.indicators].sort((a, b) => {
    const valueA = a[orderBy] || 0;
    const valueB = b[orderBy] || 0;
    return (order === 'asc' ? 1 : -1) * (valueA - valueB);
  }) : [];

  const chartData = {
    labels: data?.timestamps || [],
    datasets: [
      {
        label: '恐慌與貪婪指數',
        data: data?.values || [],
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '恐慌與貪婪指數趨勢'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}`
        }
      }
    }
  };

  const getFearGreedLabel = (value) => {
    if (value >= 80) return '極度貪婪';
    if (value >= 60) return '貪婪';
    if (value >= 40) return '中性';
    if (value >= 20) return '恐慌';
    return '極度恐慌';
  };

  const getFearGreedColor = (value) => {
    if (value >= 80) return '#4caf50'; // 綠色
    if (value >= 60) return '#8bc34a'; // 淺綠色
    if (value >= 40) return '#ffc107'; // 黃色
    if (value >= 20) return '#ff9800'; // 橙色
    return '#f44336'; // 紅色
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        恐慌與貪婪指數
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>指標</TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'value'}
                        direction={orderBy === 'value' ? order : 'asc'}
                        onClick={() => handleSort('value')}
                      >
                        數值
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'change24h'}
                        direction={orderBy === 'change24h' ? order : 'asc'}
                        onClick={() => handleSort('change24h')}
                      >
                        24小時變化
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>狀態</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">
                        {row.value}
                      </TableCell>
                      <TableCell align="right" className={row.change24h >= 0 ? 'positive' : 'negative'}>
                        {formatPercentage(row.change24h)}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: getFearGreedColor(row.value),
                            color: 'white'
                          }}
                        >
                          {getFearGreedLabel(row.value)}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Container>
  );
} 
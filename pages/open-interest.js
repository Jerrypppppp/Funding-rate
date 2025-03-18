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

export default function OpenInterest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('value');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/open-interest');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching open interest data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // 每分鐘更新
    return () => clearInterval(interval);
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = data?.exchanges ? [...data.exchanges].sort((a, b) => {
    const valueA = a[orderBy] || 0;
    const valueB = b[orderBy] || 0;
    return (order === 'asc' ? 1 : -1) * (valueA - valueB);
  }) : [];

  const chartData = {
    labels: data?.timestamps || [],
    datasets: [
      {
        label: '未平倉合約量',
        data: data?.values || [],
        borderColor: 'rgb(153, 102, 255)',
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
        text: '24小時未平倉合約量趨勢'
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => formatNumber(value)
        }
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        未平倉合約監控
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
                    <TableCell>交易所</TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'value'}
                        direction={orderBy === 'value' ? order : 'asc'}
                        onClick={() => handleSort('value')}
                      >
                        未平倉合約量
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'marketShare'}
                        direction={orderBy === 'marketShare' ? order : 'asc'}
                        onClick={() => handleSort('marketShare')}
                      >
                        市場份額
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">
                        {formatNumber(row.value)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(row.marketShare)}
                      </TableCell>
                      <TableCell align="right" className={row.change24h >= 0 ? 'positive' : 'negative'}>
                        {formatPercentage(row.change24h)}
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
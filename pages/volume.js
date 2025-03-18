import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, TableSortLabel, CircularProgress, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { formatNumber, formatPercentage } from '../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Volume() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('volume24h');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/volume');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching volume data:', error);
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

  const sortedData = data?.details ? [...data.details].sort((a, b) => {
    const valueA = a[orderBy] || 0;
    const valueB = b[orderBy] || 0;
    return (order === 'asc' ? 1 : -1) * (valueA - valueB);
  }) : [];

  const chartData = {
    labels: data?.exchanges || [],
    datasets: [
      {
        label: '24小時交易量',
        data: data?.volumes || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
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
        text: '各交易所24小時交易量'
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
    <>
      <Head>
        <title>交易量 - 加密貨幣數據中心</title>
        <meta name="description" content="查看24小時交易量統計" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          交易量分析
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box className="chart-container">
                <Bar data={chartData} options={chartOptions} />
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
                          active={orderBy === 'volume24h'}
                          direction={orderBy === 'volume24h' ? order : 'asc'}
                          onClick={() => handleSort('volume24h')}
                        >
                          24小時交易量
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
                          {formatNumber(row.volume24h)}
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
    </>
  );
} 
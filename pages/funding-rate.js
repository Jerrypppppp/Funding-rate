import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  CircularProgress,
  Grid
} from '@mui/material';
import { Line } from 'react-chartjs-2';
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

export default function FundingRate() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('fundingRate');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/funding-rates');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching funding rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // 每分鐘更新一次
    return () => clearInterval(interval);
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...data].sort((a, b) => {
    const valueA = a[orderBy];
    const valueB = b[orderBy];
    return (order === 'asc' ? 1 : -1) * (valueA - valueB);
  });

  // 為圖表準備數據
  const chartData = {
    labels: data.map(item => item.symbol),
    datasets: [
      {
        label: '資金費率 (%)',
        data: data.map(item => parseFloat(item.fundingRate) * 100),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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
        text: '資金費率趨勢'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => value + '%'
        }
      }
    }
  };

  return (
    <Container>
      <Head>
        <title>資金費率 - 加密貨幣數據中心</title>
        <meta name="description" content="查看各大交易所的資金費率數據" />
      </Head>

      <Typography variant="h4" component="h1" gutterBottom>
        資金費率
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
                    <TableCell>交易對</TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'fundingRate'}
                        direction={orderBy === 'fundingRate' ? order : 'asc'}
                        onClick={() => handleSort('fundingRate')}
                      >
                        資金費率
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">下次結算時間</TableCell>
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
                        active={orderBy === 'openInterest'}
                        direction={orderBy === 'openInterest' ? order : 'asc'}
                        onClick={() => handleSort('openInterest')}
                      >
                        未平倉合約
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.exchange}</TableCell>
                      <TableCell>{row.symbol}</TableCell>
                      <TableCell
                        align="right"
                        className={parseFloat(row.fundingRate) >= 0 ? 'positive' : 'negative'}
                      >
                        {(parseFloat(row.fundingRate) * 100).toFixed(4)}%
                      </TableCell>
                      <TableCell align="right">
                        {new Date(row.nextFundingTime).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ${(row.volume24h / 1000000).toFixed(2)}M
                      </TableCell>
                      <TableCell align="right">
                        ${(row.openInterest / 1000000).toFixed(2)}M
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
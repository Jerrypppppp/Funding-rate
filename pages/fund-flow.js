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

export default function FundFlow() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('netFlow');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fund-flow');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching fund flow data:', error);
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
    const valueA = parseFloat(a[orderBy]);
    const valueB = parseFloat(b[orderBy]);
    return (order === 'asc' ? 1 : -1) * (valueA - valueB);
  });

  // 為圖表準備數據
  const chartData = {
    labels: data.map(item => item.exchange),
    datasets: [
      {
        label: '淨流入 (USD)',
        data: data.map(item => parseFloat(item.netFlow)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: data.map(item => 
          parseFloat(item.netFlow) >= 0 ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'
        ),
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
        text: '交易所資金流向'
      }
    },
    scales: {
      y: {
        ticks: {
          callback: value => `$${(value / 1e6).toFixed(2)}M`
        }
      }
    }
  };

  return (
    <Container>
      <Head>
        <title>資金流向 - 加密貨幣數據中心</title>
        <meta name="description" content="查看各大交易所的資金流入流出情況" />
      </Head>

      <Typography variant="h4" component="h1" gutterBottom>
        資金流向
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
                        active={orderBy === 'inflow'}
                        direction={orderBy === 'inflow' ? order : 'asc'}
                        onClick={() => handleSort('inflow')}
                      >
                        流入
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'outflow'}
                        direction={orderBy === 'outflow' ? order : 'asc'}
                        onClick={() => handleSort('outflow')}
                      >
                        流出
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'netFlow'}
                        direction={orderBy === 'netFlow' ? order : 'asc'}
                        onClick={() => handleSort('netFlow')}
                      >
                        淨流入
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
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'marketShare'}
                        direction={orderBy === 'marketShare' ? order : 'asc'}
                        onClick={() => handleSort('marketShare')}
                      >
                        市場份額
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.exchange}</TableCell>
                      <TableCell align="right">
                        ${(parseFloat(row.inflow) / 1e6).toFixed(2)}M
                      </TableCell>
                      <TableCell align="right">
                        ${(parseFloat(row.outflow) / 1e6).toFixed(2)}M
                      </TableCell>
                      <TableCell
                        align="right"
                        className={parseFloat(row.netFlow) >= 0 ? 'positive' : 'negative'}
                      >
                        ${(parseFloat(row.netFlow) / 1e6).toFixed(2)}M
                      </TableCell>
                      <TableCell
                        align="right"
                        className={parseFloat(row.change24h) >= 0 ? 'positive' : 'negative'}
                      >
                        {row.change24h}%
                      </TableCell>
                      <TableCell align="right">
                        {row.marketShare}%
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
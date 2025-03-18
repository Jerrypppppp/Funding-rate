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
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
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

export default function CEXEarn() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('apy');
  const [order, setOrder] = useState('desc');
  const [selectedCoin, setSelectedCoin] = useState('USDT');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cexearn');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching CEX earn data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000); // 每2分鐘更新一次
    return () => clearInterval(interval);
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCoinChange = (event, newValue) => {
    setSelectedCoin(newValue);
  };

  const sortedData = [...data].sort((a, b) => {
    const valueA = parseFloat(a.products[selectedCoin]?.[orderBy]) || 0;
    const valueB = parseFloat(b.products[selectedCoin]?.[orderBy]) || 0;
    return (order === 'asc' ? 1 : -1) * (valueA - valueB);
  });

  // 為圖表準備數據
  const chartData = {
    labels: data.map(item => item.exchange),
    datasets: [
      {
        label: `${selectedCoin} APY (%)`,
        data: data.map(item => parseFloat(item.products[selectedCoin]?.apy || 0)),
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
        text: '各交易所理財收益率比較'
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
        <title>CEX 理財收益 - 加密貨幣數據中心</title>
        <meta name="description" content="比較各大交易所的穩定幣活期理財收益率" />
      </Head>

      <Typography variant="h4" component="h1" gutterBottom>
        CEX 理財收益
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedCoin}
          onChange={handleCoinChange}
          aria-label="stablecoin tabs"
        >
          <Tab label="USDT" value="USDT" />
          <Tab label="USDC" value="USDC" />
          <Tab label="DAI" value="DAI" />
        </Tabs>
      </Box>

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
                        active={orderBy === 'apy'}
                        direction={orderBy === 'apy' ? order : 'asc'}
                        onClick={() => handleSort('apy')}
                      >
                        年化收益率
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'minAmount'}
                        direction={orderBy === 'minAmount' ? order : 'asc'}
                        onClick={() => handleSort('minAmount')}
                      >
                        最低投資額
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'lockPeriod'}
                        direction={orderBy === 'lockPeriod' ? order : 'asc'}
                        onClick={() => handleSort('lockPeriod')}
                      >
                        鎖定期
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'totalLiquidity'}
                        direction={orderBy === 'totalLiquidity' ? order : 'asc'}
                        onClick={() => handleSort('totalLiquidity')}
                      >
                        總流動性
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'userCount'}
                        direction={orderBy === 'userCount' ? order : 'asc'}
                        onClick={() => handleSort('userCount')}
                      >
                        用戶數
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.map((row, index) => {
                    const product = row.products[selectedCoin] || {};
                    return (
                      <TableRow key={index}>
                        <TableCell>{row.exchange}</TableCell>
                        <TableCell align="right" className="positive">
                          {product.apy}%
                        </TableCell>
                        <TableCell align="right">
                          ${product.minAmount}
                        </TableCell>
                        <TableCell align="right">
                          {product.lockPeriod > 0 ? `${product.lockPeriod}天` : '活期'}
                        </TableCell>
                        <TableCell align="right">
                          ${(product.totalLiquidity / 1e6).toFixed(2)}M
                        </TableCell>
                        <TableCell align="right">
                          {(product.userCount / 1000).toFixed(1)}K
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Container>
  );
} 
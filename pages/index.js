import React from 'react';
import Head from 'next/head';
import { Box, Container, Typography, Card, CardContent, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 40,
    color: theme.palette.primary.main,
  },
}));

export default function Home() {
  return (
    <>
      <Head>
        <title>加密貨幣數據中心</title>
        <meta name="description" content="加密貨幣市場數據分析平台" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          加密貨幣數據中心
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Link href="/funding-rate" passHref style={{ textDecoration: 'none' }}>
              <StyledCard>
                <CardContent>
                  <IconWrapper>
                    <TrendingUpIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom>
                    資金費率 →
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    查看各大交易所的資金費率數據及歷史資料
                  </Typography>
                </CardContent>
              </StyledCard>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Link href="/fund-flow" passHref style={{ textDecoration: 'none' }}>
              <StyledCard>
                <CardContent>
                  <IconWrapper>
                    <MonetizationOnIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom>
                    資金流向 →
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    查看各大交易所的資金流入流出情況
                  </Typography>
                </CardContent>
              </StyledCard>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Link href="/volume" passHref style={{ textDecoration: 'none' }}>
              <StyledCard>
                <CardContent>
                  <IconWrapper>
                    <ShowChartIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom>
                    交易量 →
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    查看24小時交易量統計
                  </Typography>
                </CardContent>
              </StyledCard>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Link href="/open-interest" passHref style={{ textDecoration: 'none' }}>
              <StyledCard>
                <CardContent>
                  <IconWrapper>
                    <AccountBalanceIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom>
                    未平倉合約 →
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    查看合約未平倉量數據
                  </Typography>
                </CardContent>
              </StyledCard>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Link href="/fear-greed" passHref style={{ textDecoration: 'none' }}>
              <StyledCard>
                <CardContent>
                  <IconWrapper>
                    <AssessmentIcon />
                  </IconWrapper>
                  <Typography variant="h5" component="h2" gutterBottom>
                    貪婪恐懼指數 →
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    查看比特幣市場情緒指標及歷史走勢
                  </Typography>
                </CardContent>
              </StyledCard>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
} 
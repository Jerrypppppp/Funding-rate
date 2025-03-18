import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const navItems = [
    { label: '首頁', path: '/' },
    { label: '資金費率', path: '/funding-rate' },
    { label: '資金流向', path: '/fund-flow' },
    { label: '恐慌指數', path: '/fear-greed' },
    { label: '交易量', path: '/volume' },
    { label: '未平倉合約', path: '/open-interest' }
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          加密貨幣數據中心
        </Typography>
        <Box>
          {navItems.map((item) => (
            <Link href={item.path} key={item.path} passHref>
              <Button
                color="inherit"
                sx={{
                  mx: 1,
                  borderBottom: router.pathname === item.path ? '2px solid white' : 'none'
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 
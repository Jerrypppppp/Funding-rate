export default async function handler(req, res) {
  try {
    const data = {
      exchanges: ['Binance', 'OKX', 'Bybit', 'Bitget'],
      volumes: [15600000000, 8900000000, 7500000000, 5200000000],
      details: [
        {
          name: 'Binance',
          volume24h: 15600000000,
          marketShare: 0.45,
          change24h: 0.053
        },
        {
          name: 'OKX',
          volume24h: 8900000000,
          marketShare: 0.25,
          change24h: -0.012
        },
        {
          name: 'Bybit',
          volume24h: 7500000000,
          marketShare: 0.21,
          change24h: 0.028
        },
        {
          name: 'Bitget',
          volume24h: 5200000000,
          marketShare: 0.09,
          change24h: 0.015
        }
      ]
    };
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in volume API:', error);
    res.status(500).json({ error: '獲取交易量數據失敗' });
  }
} 
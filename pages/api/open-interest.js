export default async function handler(req, res) {
  try {
    const data = {
      timestamps: Array.from({ length: 24 }, (_, i) => 
        new Date(Date.now() - i * 3600000).toISOString()
      ),
      values: Array.from({ length: 24 }, () => 
        Math.random() * 5000000000 + 15000000000
      ),
      exchanges: [
        {
          name: 'Binance',
          value: 18500000000,
          marketShare: 0.42,
          change24h: 0.034
        },
        {
          name: 'OKX',
          value: 12500000000,
          marketShare: 0.28,
          change24h: -0.015
        },
        {
          name: 'Bybit',
          value: 9800000000,
          marketShare: 0.22,
          change24h: 0.021
        },
        {
          name: 'Bitget',
          value: 3200000000,
          marketShare: 0.08,
          change24h: 0.008
        }
      ]
    };
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in open interest API:', error);
    res.status(500).json({ error: '獲取未平倉合約數據失敗' });
  }
} 
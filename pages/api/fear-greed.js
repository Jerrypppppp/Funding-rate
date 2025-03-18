export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '只允許 GET 請求' });
  }

  // 生成模擬數據
  const now = new Date();
  const timestamps = [];
  const values = [];
  
  // 生成過去24小時的時間戳和對應的指數值
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000);
    timestamps.push(timestamp.toLocaleTimeString());
    values.push(Math.floor(Math.random() * 40) + 30); // 生成30-70之間的隨機數
  }

  const indicators = [
    {
      name: '市場情緒',
      value: values[values.length - 1],
      change24h: ((values[values.length - 1] - values[0]) / values[0]) * 100
    },
    {
      name: '波動率',
      value: Math.floor(Math.random() * 20) + 10,
      change24h: (Math.random() * 20) - 10
    },
    {
      name: '社交媒體情緒',
      value: Math.floor(Math.random() * 40) + 30,
      change24h: (Math.random() * 30) - 15
    },
    {
      name: '市場趨勢',
      value: Math.floor(Math.random() * 40) + 30,
      change24h: (Math.random() * 25) - 12.5
    }
  ];

  res.status(200).json({
    timestamps,
    values,
    indicators,
    lastUpdated: now.toISOString()
  });
} 
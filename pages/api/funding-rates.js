// 使用 Next.js 的內置 API 路由處理 WebSocket
import { Server } from 'socket.io';

// 緩存配置
const CACHE_DURATION = 60000; // 1分鐘
let cachedData = null;
let lastCacheTime = 0;

// 創建 socket.io 實例
let io;

if (!global.io) {
  global.io = new Server();
}
io = global.io;

// 模擬資金費率數據
const exchanges = ['Binance', 'Bybit', 'OKX', 'Bitget', 'HyperLiquid'];
const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT'];

function generateFundingRate() {
  return (Math.random() * 0.002 - 0.001).toFixed(6); // 生成 -0.1% 到 0.1% 之間的隨機數
}

function generateNextFundingTime() {
  const now = new Date();
  const hours = now.getUTCHours();
  let nextHour;
  
  // Binance 的資金費率時間是每 8 小時（UTC 00:00, 08:00, 16:00）
  if (hours < 8) nextHour = 8;
  else if (hours < 16) nextHour = 16;
  else nextHour = 24;
  
  const next = new Date(now);
  next.setUTCHours(nextHour, 0, 0, 0);
  return next.toISOString();
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '只允許 GET 請求' });
  }

  try {
    const data = exchanges.map(exchange => {
      return symbols.map(symbol => ({
        exchange,
        symbol,
        fundingRate: generateFundingRate(),
        nextFundingTime: generateNextFundingTime(),
        volume24h: Math.floor(Math.random() * 1000000000), // 隨機24小時交易量
        openInterest: Math.floor(Math.random() * 500000000) // 隨機未平倉合約量
      }));
    }).flat();

    res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating funding rates:', error);
    res.status(500).json({
      success: false,
      message: '生成資金費率數據時發生錯誤'
    });
  }
}

async function fetchAllExchangeData() {
  try {
    // 直接請求交易所 API
    const [binanceData, bybitData, bitgetData] = await Promise.all([
      fetch('https://fapi.binance.com/fapi/v1/premiumIndex').then(res => res.json()),
      fetch('https://api.bybit.com/v5/market/tickers?category=linear').then(res => res.json()),
      fetch('https://api.bitget.com/api/v2/mix/market/tickers?productType=USDT-FUTURES', {
        headers: {
          'Content-Type': 'application/json',
          'locale': 'zh-CN'
        }
      }).then(res => res.json())
    ]);

    // 處理幣安數據
    const binanceRates = binanceData
      ? binanceData
          .filter(item => item.symbol.endsWith('USDT'))
          .map(item => ({
            symbol: item.symbol.replace('USDT', ''),
            exchange: 'Binance',
            currentRate: (parseFloat(item.lastFundingRate) * 100).toFixed(4),
            isSpecialInterval: false,
            settlementInterval: 8
          }))
      : [];

    // 處理 Bybit 數據
    const bybitRates = bybitData?.result?.list
      ? bybitData.result.list
          .filter(item => item.symbol.endsWith('USDT') && item.fundingRate)
          .map(item => ({
            symbol: item.symbol.replace('USDT', ''),
            exchange: 'Bybit',
            currentRate: (parseFloat(item.fundingRate) * 100).toFixed(4),
            isSpecialInterval: false,
            settlementInterval: 8
          }))
      : [];

    // 處理 Bitget 數據
    const bitgetRates = bitgetData?.data
      ? bitgetData.data
          .filter(item => item.symbol && item.fundingRate)
          .map(item => ({
            symbol: item.symbol.replace('USDT', ''),
            exchange: 'Bitget',
            currentRate: (parseFloat(item.fundingRate) * 100).toFixed(4),
            isSpecialInterval: false,
            settlementInterval: 8
          }))
      : [];

    // 合併所有數據
    const allRates = [...binanceRates, ...bybitRates, ...bitgetRates];

    return {
      success: true,
      data: allRates,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error in fetchAllExchangeData:', error);
    throw error;
  }
}

// 配置 API 路由以支持 WebSocket
export const config = {
  api: {
    bodyParser: false,
  },
};
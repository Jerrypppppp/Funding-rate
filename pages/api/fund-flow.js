// 處理交易所資金流向數據的 API 端點
import axios from 'axios';

const BINANCE_API = 'https://api.binance.com/api/v3';
const BYBIT_API = 'https://api.bybit.com/v5';
const OKX_API = 'https://www.okx.com/api/v5';

// 設定大額交易閾值（USDT）
const LARGE_ORDER_THRESHOLD = 100000;

// 設定更新間隔（毫秒）
const UPDATE_INTERVAL = 10000; // 10秒

// 緩存數據
let cachedData = null;
let lastUpdateTime = 0;

// DefiLlama API URL
const DEFILLAMA_API = 'https://api.llama.fi';

// 緩存對象
let cache = {
  data: null,
  timestamp: 0
};

// 緩存有效期為10秒
const CACHE_TTL = 10 * 1000;

async function fetchBinanceData() {
  try {
    // 獲取最近的交易數據
    const trades = await axios.get(`${BINANCE_API}/trades`, {
      params: {
        limit: 1000,
        symbol: 'BTCUSDT'
      }
    });
    
    // 獲取24小時價格統計
    const ticker = await axios.get(`${BINANCE_API}/ticker/24hr`, {
      params: { symbol: 'BTCUSDT' }
    });

    return {
      trades: trades.data,
      ticker: ticker.data
    };
  } catch (error) {
    console.error('Binance API error:', error);
    return null;
  }
}

async function fetchBybitData() {
  try {
    // 只獲取現貨市場數據
    const trades = await axios.get(`${BYBIT_API}/market/recent-trade`, {
      params: {
        category: 'spot',
        symbol: 'BTCUSDT',
        limit: 1000
      }
    });
    
    // 獲取24小時價格統計
    const ticker = await axios.get(`${BYBIT_API}/market/tickers`, {
      params: {
        category: 'spot',
        symbol: 'BTCUSDT'
      }
    });

    // 驗證數據格式
    if (!trades.data?.result?.list || !ticker.data?.result?.list?.[0]) {
      console.error('Invalid Bybit data format');
      return null;
    }

    return {
      trades: trades.data,
      ticker: ticker.data
    };
  } catch (error) {
    console.error('Bybit API error:', error);
    return null;
  }
}

async function fetchOKXData() {
  try {
    // 獲取最近的交易數據
    const trades = await axios.get(`${OKX_API}/market/trades`, {
      params: {
        instId: 'BTC-USDT',
        limit: 1000
      },
      headers: {
        'OK-ACCESS-KEY': process.env.OKX_API_KEY,
        'OK-ACCESS-SIGN': '', // 如果需要認證
        'OK-ACCESS-TIMESTAMP': Date.now().toString()
      }
    });
    
    // 獲取24小時價格統計
    const ticker = await axios.get(`${OKX_API}/market/ticker`, {
      params: {
        instId: 'BTC-USDT'
      }
    });

    return {
      trades: trades.data,
      ticker: ticker.data
    };
  } catch (error) {
    console.error('OKX API error:', error);
    return null;
  }
}

function calculateNetFlow(data, exchange) {
  if (!data || !data.trades) return { netFlow: 0, largeOrdersCount: 0 };
  
  let netFlow = 0;
  let largeOrdersCount = 0;

  switch (exchange) {
    case 'binance':
      data.trades.forEach(trade => {
        const amount = parseFloat(trade.price) * parseFloat(trade.qty);
        if (amount >= LARGE_ORDER_THRESHOLD) {
          largeOrdersCount++;
        }
        // isBuyer 為 true 表示買入，false 表示賣出
        netFlow += trade.isBuyer ? amount : -amount;
      });
      break;
    
    case 'bybit':
      data.trades.result.list.forEach(trade => {
        const amount = parseFloat(trade.price) * parseFloat(trade.size);
        if (amount >= LARGE_ORDER_THRESHOLD) {
          largeOrdersCount++;
        }
        // Bybit 的 side 表示主動方向，需要反轉
        netFlow += trade.side.toLowerCase() === 'sell' ? amount : -amount;
      });
      break;
    
    case 'okx':
      data.trades.data.forEach(trade => {
        const amount = parseFloat(trade.px) * parseFloat(trade.sz);
        if (amount >= LARGE_ORDER_THRESHOLD) {
          largeOrdersCount++;
        }
        // OKX 的 side 表示成交方向
        netFlow += trade.side.toLowerCase() === 'buy' ? amount : -amount;
      });
      break;
  }

  return {
    netFlow,
    largeOrdersCount,
    volume24h: calculateVolume24h(data.ticker, exchange)
  };
}

function calculateVolume24h(ticker, exchange) {
  switch (exchange) {
    case 'binance':
      return parseFloat(ticker.volume) * parseFloat(ticker.lastPrice);
    case 'bybit':
      if (!ticker?.result?.list?.[0]) return null;
      const volume = parseFloat(ticker.result.list[0].volume24h);
      const price = parseFloat(ticker.result.list[0].lastPrice);
      return volume * price;
    case 'okx':
      return parseFloat(ticker.data[0].vol24h) * parseFloat(ticker.data[0].last);
    default:
      return null;
  }
}

// 獲取 DefiLlama 的交易所資金流數據
async function fetchDefiLlamaData() {
  try {
    console.log('開始獲取 DefiLlama 數據...');
    
    // 使用 fetch 而不是 axios
    const response = await fetch('https://api.llama.fi/v2/cexs/netflows');
    
    if (!response.ok) {
      throw new Error(`DefiLlama API 返回狀態碼: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('DefiLlama API 響應頭:', JSON.stringify([...response.headers.entries()]));
    console.log('DefiLlama 數據結構:', Object.keys(data));
    console.log('DefiLlama 數據樣本:', JSON.stringify(data).slice(0, 500) + '...');
    
    return data;
  } catch (error) {
    console.error('獲取 DefiLlama 數據失敗:', error.message);
    return null;
  }
}

// 從 DefiLlama 數據中提取特定交易所的數據
function extractExchangeData(data, exchangeName) {
  if (!data || !Array.isArray(data)) return null;
  
  // 查找特定交易所數據
  const exchangeData = data.find(exchange => 
    exchange.name && exchange.name.toLowerCase() === exchangeName.toLowerCase()
  );
  
  if (!exchangeData) {
    console.log(`未找到交易所數據: ${exchangeName}`);
    return null;
  }
  
  return exchangeData;
}

// 計算淨流入/流出量
function calculateDefiLlamaNetFlow(exchangeData) {
  if (!exchangeData) return null;
  
  // 根據 DefiLlama API 文檔調整數據結構
  const netFlow = {
    usdNetFlow: exchangeData.totalNetflow || 0,
    netFlow24h: exchangeData.netflow1d || 0,
    netFlow7D: exchangeData.netflow7d || 0,
    netFlow30D: exchangeData.netflow30d || 0,
    btcNetFlow: exchangeData.btcNetflow || 0,
    ethNetFlow: exchangeData.ethNetflow || 0,
    lastUpdate: Date.now()
  };
  
  return netFlow;
}

// 格式化金額顯示
function formatFlow(value) {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "+";
  
  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e9).toFixed(4)}B`;
  } else if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e9).toFixed(6)}B`;
  } else {
    return `${sign}${(absValue / 1e9).toFixed(9)}B`;
  }
}

// 模擬資金流向數據
const exchanges = ['Binance', 'Bybit', 'OKX', 'Bitget', 'HyperLiquid'];

function generateFlowData() {
  const inflow = Math.random() * 1000000000;
  const outflow = Math.random() * 1000000000;
  const netFlow = inflow - outflow;
  
  return {
    inflow: inflow.toFixed(2),
    outflow: outflow.toFixed(2),
    netFlow: netFlow.toFixed(2),
    change24h: ((Math.random() * 40) - 20).toFixed(2) // -20% 到 20% 的變化
  };
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '只允許 GET 請求' });
  }

  try {
    const data = exchanges.map(exchange => ({
      exchange,
      ...generateFlowData(),
      marketShare: (Math.random() * 30).toFixed(2) // 0-30% 的市場份額
    }));

    // 計算總流量
    const totalInflow = data.reduce((sum, item) => sum + parseFloat(item.inflow), 0);
    const totalOutflow = data.reduce((sum, item) => sum + parseFloat(item.outflow), 0);
    const totalNetFlow = totalInflow - totalOutflow;

    res.status(200).json({
      success: true,
      data,
      summary: {
        totalInflow: totalInflow.toFixed(2),
        totalOutflow: totalOutflow.toFixed(2),
        totalNetFlow: totalNetFlow.toFixed(2)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating fund flow data:', error);
    res.status(500).json({
      success: false,
      message: '生成資金流向數據時發生錯誤'
    });
  }
} 
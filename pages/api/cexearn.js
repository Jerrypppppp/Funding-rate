// 模擬 CEX 理財收益數據
const exchanges = ['Binance', 'Bybit', 'OKX', 'Bitget'];
const stablecoins = ['USDT', 'USDC', 'DAI'];

function generateEarnData() {
  return {
    apy: (Math.random() * 8).toFixed(2), // 0-8% APY
    minAmount: Math.floor(Math.random() * 100) * 10, // 最低投資金額
    lockPeriod: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 90), // 鎖定期（天）
    totalLiquidity: Math.floor(Math.random() * 100000000), // 總流動性
    userCount: Math.floor(Math.random() * 50000) // 用戶數量
  };
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: '僅支持 GET 請求' });
  }

  try {
    // 模擬數據
    const data = [
      {
        exchange: 'Binance',
        products: {
          USDT: {
            apy: '4.50',
            minAmount: '100',
            lockPeriod: 0,
            totalLiquidity: 2500000000,
            userCount: 125000
          },
          USDC: {
            apy: '4.25',
            minAmount: '100',
            lockPeriod: 0,
            totalLiquidity: 1800000000,
            userCount: 95000
          },
          DAI: {
            apy: '4.00',
            minAmount: '100',
            lockPeriod: 0,
            totalLiquidity: 800000000,
            userCount: 45000
          }
        }
      },
      {
        exchange: 'OKX',
        products: {
          USDT: {
            apy: '4.75',
            minAmount: '50',
            lockPeriod: 0,
            totalLiquidity: 1800000000,
            userCount: 85000
          },
          USDC: {
            apy: '4.50',
            minAmount: '50',
            lockPeriod: 0,
            totalLiquidity: 1200000000,
            userCount: 65000
          },
          DAI: {
            apy: '4.25',
            minAmount: '50',
            lockPeriod: 0,
            totalLiquidity: 500000000,
            userCount: 35000
          }
        }
      },
      {
        exchange: 'Bybit',
        products: {
          USDT: {
            apy: '4.80',
            minAmount: '200',
            lockPeriod: 7,
            totalLiquidity: 1500000000,
            userCount: 75000
          },
          USDC: {
            apy: '4.60',
            minAmount: '200',
            lockPeriod: 7,
            totalLiquidity: 900000000,
            userCount: 55000
          },
          DAI: {
            apy: '4.40',
            minAmount: '200',
            lockPeriod: 7,
            totalLiquidity: 400000000,
            userCount: 25000
          }
        }
      },
      {
        exchange: 'KuCoin',
        products: {
          USDT: {
            apy: '4.65',
            minAmount: '150',
            lockPeriod: 0,
            totalLiquidity: 1200000000,
            userCount: 65000
          },
          USDC: {
            apy: '4.45',
            minAmount: '150',
            lockPeriod: 0,
            totalLiquidity: 750000000,
            userCount: 45000
          },
          DAI: {
            apy: '4.20',
            minAmount: '150',
            lockPeriod: 0,
            totalLiquidity: 300000000,
            userCount: 20000
          }
        }
      },
      {
        exchange: 'Gate.io',
        products: {
          USDT: {
            apy: '4.70',
            minAmount: '100',
            lockPeriod: 3,
            totalLiquidity: 900000000,
            userCount: 55000
          },
          USDC: {
            apy: '4.55',
            minAmount: '100',
            lockPeriod: 3,
            totalLiquidity: 600000000,
            userCount: 35000
          },
          DAI: {
            apy: '4.30',
            minAmount: '100',
            lockPeriod: 3,
            totalLiquidity: 250000000,
            userCount: 15000
          }
        }
      }
    ];

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('CEX 理財收益 API 錯誤:', error);
    res.status(500).json({
      success: false,
      message: '獲取 CEX 理財收益數據時發生錯誤'
    });
  }
} 
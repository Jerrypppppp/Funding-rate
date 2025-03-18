# 加密貨幣市場監控平台

這是一個全面的加密貨幣市場監控平台，專注於提供資金費率、資金流向和市場情緒等重要指標的實時監控和歷史數據分析。

## 主要功能

### 1. 資金費率監控
- 實時追蹤多個交易所的資金費率
- 支援 Binance、Bybit、OKX、Bitget 和 HyperLiquid 等主要交易所
- 提供累計資金費率計算和歷史趨勢分析
- 自動檢測並標準化不同結算週期

### 2. 資金流向分析
- 監控主要交易所的資金淨流入/流出
- 追蹤大額交易和市場趨勢
- 提供 24小時、7天和 30天的資金流動數據
- 直觀的資金流向視覺化展示

### 3. 市場情緒指標
- 恐慌與貪婪指數展示
- 交易量分析
- 未平倉合約數據監控

## 技術架構

- **前端框架**: React.js + Next.js
- **UI 組件**: Material-UI (MUI)
- **數據可視化**: Chart.js
- **實時通訊**: Socket.IO
- **API 整合**: 
  - 交易所原生 API (Binance, Bybit, OKX)
  - 第三方數據 API (可選配置 DefiLlama)
- **部署**: Vercel

## 安裝與運行

### 前提條件
- Node.js 16.x 或更高版本
- npm 或 yarn

### 安裝步驟
1. 克隆倉庫
   ```bash
   git clone https://github.com/your-username/crypto-market-monitor.git
   cd crypto-market-monitor
   ```

2. 安裝依賴
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 開發環境運行
   ```bash
   npm run dev
   # 或
   yarn dev
   ```
   應用將在 http://localhost:3000 運行

4. 生產環境構建
   ```bash
   npm run build
   npm start
   # 或
   yarn build
   yarn start
   ```

## API 文檔

### 資金費率 API

#### 獲取當前資金費率
```
GET /api/funding-rates
```

**響應格式**:
```json
{
  "timestamp": 1678234567890,
  "data": [
    {
      "symbol": "BTC",
      "exchangeRates": {
        "binance": 0.0001,
        "bybit": 0.0002,
        "okx": 0.0001,
        "bitget": 0.0002,
        "hyperliquid": 0.0001
      }
    },
    // 更多幣種...
  ]
}
```

#### 獲取資金費率歷史
```
GET /api/history/[symbol]?exchange=all&timeRange=7d
```

**參數**:
- `symbol`: 交易對名稱（例如：BTC）
- `exchange`: 交易所（可選，預設為 all）
- `timeRange`: 時間範圍（可選，24h/7d/30d，預設為 24h）

### 資金流向 API

#### 獲取資金流向數據
```
GET /api/fund-flow
```

**響應格式**:
```json
{
  "binance": {
    "netFlow24h": "+1.23B",
    "netFlow7d": "+4.56B",
    "netFlow30d": "+9.87B",
    "lastUpdate": 1678234567890
  },
  "bybit": {
    "netFlow24h": "-0.45B",
    "netFlow7d": "+1.23B",
    "netFlow30d": "+3.45B",
    "lastUpdate": 1678234567890
  },
  "okx": {
    "netFlow24h": "+0.78B",
    "netFlow7d": "+2.34B",
    "netFlow30d": "+5.67B",
    "lastUpdate": 1678234567890
  }
}
```

## 頁面導覽

- **首頁**: 資金費率概覽
- **/funding-rate**: 詳細資金費率監控
- **/fund-flow**: 交易所資金流向分析
- **/fear-greed**: 市場恐慌與貪婪指數
- **/volume**: 交易量分析
- **/open-interest**: 未平倉合約數據

## 開發計劃

- [ ] 添加更多交易所支援
- [ ] 實現費率提醒功能
- [ ] 添加用戶自定義設置
- [ ] 支援更多時間週期顯示
- [ ] 添加數據分析工具
- [ ] 優化移動端體驗
- [ ] 添加暗色主題支持
- [ ] 實現數據導出功能
- [ ] 優化累計費率計算效能
- [ ] 添加費率趨勢分析

## 貢獻

歡迎提交 Issue 和 Pull Request。

## 許可證

MIT License

# 資金費率查詢系統

這是一個多交易所資金費率查詢系統，支持實時和歷史資金費率數據的獲取和顯示。

## 支持的交易所

- Binance (幣安)
- Bybit
- Bitget
- OKX
- HyperLiquid

## API 端點

### 獲取資金費率歷史

```
GET /api/history/[symbol]
```

#### 參數

- `symbol`: 交易對名稱（不需要包含 USDT，例如：BTC）
- `timeRange`: 時間範圍（可選，預設為 24h）
  - `24h`: 24小時數據
  - `7d`: 7天數據
  - `30d`: 30天數據
- `exchange`: 交易所（可選，預設為 all）
  - `all`: 所有交易所
  - `Binance`: 僅幣安
  - `Bybit`: 僅 Bybit
  - `Bitget`: 僅 Bitget
  - `OKX`: 僅 OKX
  - `HyperLiquid`: 僅 HyperLiquid

#### 響應格式

```json
{
  "success": true,
  "symbol": "BTC",
  "data": [
    {
      "exchange": "交易所名稱",
      "time": "時間戳 ISO 格式",
      "rate": "資金費率（百分比）",
      "interval": "結算間隔（小時）",
      "isCurrent": true/false,
      "hourlyRates": [  // 僅 HyperLiquid 數據包含此字段
        {
          "time": "具體時間",
          "rate": "費率",
          "isHourly": true
        }
      ]
    }
  ]
}
```

#### 特殊功能

1. **智能數據分組**
   - 自動檢測各交易所的結算間隔
   - 根據最小間隔進行數據分組
   - 保留詳細的每小時數據（HyperLiquid）

2. **錯誤處理**
   - 交易對不存在時返回空數組
   - API 錯誤時提供詳細錯誤信息
   - 支持請求重試機制

3. **數據優化**
   - 自動過濾無效數據
   - 按時間排序
   - 當前數據優先顯示

## 數據更新頻率

- 當前資金費率：實時
- 歷史數據：
  - 24h 視圖：每 5 天更新一次
  - 7d 視圖：每 10 天更新一次
  - 30d 視圖：每 35 天更新一次

## 使用示例

```javascript
// 獲取 BTC 24小時資金費率
fetch('/api/history/BTC?timeRange=24h')

// 獲取 ETH 在 Binance 的 7 天資金費率
fetch('/api/history/ETH?timeRange=7d&exchange=Binance')

// 獲取 SOL 在所有交易所的 30 天資金費率
fetch('/api/history/SOL?timeRange=30d')
```

## 錯誤處理

系統會返回以下格式的錯誤信息：

```json
{
  "success": false,
  "error": "錯誤描述",
  "details": "詳細錯誤信息",
  "data": []
}
```

## 注意事項

1. HyperLiquid 的數據處理
   - 先檢查交易對是否存在
   - 獲取當前資金費率
   - 分批獲取歷史數據
   - 智能分組和計算平均值

2. 數據限制
   - 每個請求最多返回：
     - 24h：200 條數據
     - 7d：300 條數據
     - 30d：1000 條數據

3. 性能優化
   - 使用批次請求
   - 添加請求延遲避免頻率限制
   - 智能數據緩存

## 開發計劃

- [ ] 添加數據緩存機制
- [ ] 支持更多交易所
- [ ] 添加 WebSocket 實時更新
- [ ] 優化數據聚合算法
- [ ] 添加更多時間範圍選項

FundingRate/
├── public/                  # 靜態資源
│   ├── images/              # 圖片資源
│   └── favicon.ico          # 網站圖標
│
├── src/                     # 源代碼
│   ├── components/          # 共用元件
│   │   ├── Layout/          # 佈局相關元件
│   │   ├── UI/              # UI元件
│   │   └── Charts/          # 圖表元件
│   │
│   ├── modules/             # 功能模塊（每個頁面作為獨立專案）
│   │   ├── FundingRate/     # 資金費率模塊
│   │   │   ├── api/         # 資金費率專用API
│   │   │   ├── components/  # 資金費率特有元件
│   │   │   ├── hooks/       # 資金費率相關hooks
│   │   │   ├── utils/       # 資金費率工具函數
│   │   │   └── index.js     # 模塊入口
│   │   │
│   │   ├── FundFlow/        # 資金流向模塊
│   │   │   ├── api/         # 資金流向專用API
│   │   │   ├── components/  # 資金流向特有元件
│   │   │   ├── hooks/       # 資金流向相關hooks
│   │   │   ├── utils/       # 資金流向工具函數
│   │   │   └── index.js     # 模塊入口
│   │   │
│   │   ├── FearGreed/       # 恐慌與貪婪指數模塊
│   │   │   └── ...
│   │   │
│   │   ├── OpenInterest/    # 未平倉合約模塊
│   │   │   └── ...
│   │   │
│   │   └── Volume/          # 交易量分析模塊
│   │       └── ...
│   │
│   ├── pages/               # Next.js 頁面
│   │   ├── api/             # API 路由
│   │   │   ├── funding-rates.js
│   │   │   ├── fund-flow.js
│   │   │   └── history/[symbol].js
│   │   │
│   │   ├── _app.js          # 應用入口
│   │   ├── index.js         # 首頁
│   │   ├── funding-rate.js  # 資金費率頁面
│   │   ├── fund-flow.js     # 資金流向頁面
│   │   ├── fear-greed.js    # 恐慌與貪婪指數頁面
│   │   ├── volume.js        # 交易量頁面
│   │   └── open-interest.js # 未平倉合約頁面
│   │
│   ├── services/            # 全局服務
│   │   ├── api/             # API 客戶端
│   │   └── socket/          # Socket.io 服務
│   │
│   ├── stores/              # 狀態管理
│   │   └── ...
│   │
│   ├── styles/              # 樣式文件
│   │   ├── globals.css      # 全局樣式
│   │   └── theme.js         # 主題配置
│   │
│   └── utils/               # 通用工具函數
│       ├── formatters.js    # 數據格式化工具
│       ├── validators.js    # 數據驗證工具
│       └── constants.js     # 常量定義
│
├── .gitignore
├── next.config.js
├── package.json
└── README.md



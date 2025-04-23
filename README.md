# 智能水族箱監控系統

![版本](https://img.shields.io/badge/版本-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-blueviolet)

一個基於 Next.js 開發的現代化智能水族箱監控系統，提供即時視訊監控、溫度監測、魚群計數以及設備遠程控制等功能。

## 📋 功能概述

- **即時視訊監控**：透過 HLS 串流技術，提供低延遲的水族箱即時視訊。
- **溫度資料即時監控**：透過 WebSocket 連接，實時記錄和顯示水溫變化趨勢。
- **魚群數量監測**：使用人工智慧影像辨識技術，實時監測魚缸中的魚隻數量。
- **設備遠程控制**：
  - LED 燈光控制
  - 自動餵食系統控制
  - 加熱器控制

## 🔧 技術架構

- **前端框架**：Next.js 14
- **UI 設計**：Tailwind CSS
- **即時通訊**：WebSocket
- **視訊串流**：HTTP Live Streaming (HLS)
- **圖表呈現**：Recharts

## 🚀 快速開始

### 安裝依賴

```bash
npm install
# 或
yarn install
```

### 啟動開發伺服器

```bash
npm run dev
# 或
yarn dev
```

開啟 [http://localhost:3000](http://localhost:3000) 瀏覽系統界面。

## 📊 系統組件說明

### VideoPlayer 組件

提供 HLS 視訊串流播放功能，支援低延遲模式。

```tsx
<VideoPlayer src="https://your-hls-stream-url.m3u8" />
```

### TemperatureChart 組件

顯示即時水溫數據圖表，通過 WebSocket 連接 `wss://a1wss.iside.space/ws/temp/` 獲取數據。

### FishCounter 組件

顯示魚群數量監測結果，通過 WebSocket 連接 `wss://a1wss.iside.space/ws/fish/` 獲取數據。

### ModeSelector 組件

提供設備控制界面，通過 WebSocket 連接 `wss://a1wss.iside.space/ws/mode/` 發送控制指令。

## 📡 WebSocket API 說明

系統使用三個 WebSocket 端點進行數據傳輸：

1. **溫度監測**：`wss://a1wss.iside.space/ws/temp/`
   - 接收格式：`{"message": "25.5 => server echo"}`

2. **魚群計數**：`wss://a1wss.iside.space/ws/fish/`
   - 接收格式：`{"message3": "29"}`

3. **設備控制**：`wss://a1wss.iside.space/ws/mode/`
   - 發送格式：`{"message": "LED_ON"}` / `{"message": "LED_OFF"}`
   - 發送格式：`{"message": "FOOD_ON"}` / `{"message": "FOOD_OFF"}`
   - 發送格式：`{"message": "HOT_ON"}` / `{"message": "HOT_OFF"}`

## 📱 響應式設計

系統界面支援不同尺寸的設備顯示：

- 桌面電腦
- 平板電腦
- 移動設備

## 🔒 系統要求

- Node.js 16.0 或以上
- 支援現代瀏覽器 (Chrome, Firefox, Safari, Edge)
- 網絡連接，用於 WebSocket 和 HLS 串流

## 📝 許可證

© 2025 智能水族箱監控系統

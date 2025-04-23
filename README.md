# 智能水族箱監控系統

![版本](https://img.shields.io/badge/版本-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-blueviolet)
![Docker](https://img.shields.io/badge/Docker-支援-brightgreen)

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

## 🐋 Docker 部署指南

本專案提供 Docker 支援，便於在各種環境中快速部署和運行系統。

### 從 Docker Hub 拉取映像

我們已將映像上傳至 Docker Hub，您可以直接拉取使用：

```bash
docker pull oomaybeoo/aquarium
```

### 運行 Docker 容器

拉取映像後，使用以下命令啟動容器：

```bash
docker run -d -p 3000:3000 --name aquarium oomaybeoo/aquarium
```

啟動後，在瀏覽器中訪問 [http://localhost:3000](http://localhost:3000) 即可使用系統。

### 使用 Docker Compose

專案提供了 docker-compose.yml 配置文件，您可以使用 Docker Compose 一鍵部署：

```bash
docker-compose up -d
```

### 自行構建映像

如果您想自行修改並構建映像，可以使用：

```bash
docker build -t 您的用戶名/aquarium .
```

構建完成後，推送至 Docker Hub：

```bash
docker push 您的用戶名/aquarium
```

### Docker 相關文件說明

本專案包含以下 Docker 相關文件：

- `Dockerfile` - 定義了多階段構建過程，優化容器大小和性能
- `docker-compose.yml` - 提供了容器編排配置
- `docker-push.bat` - Windows 環境下用於構建和推送映像的批處理腳本
- `docker-push.sh` - Unix/Linux 環境下用於構建和推送映像的腳本

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
- 可選：Docker 20.10 或更高版本（如使用 Docker 部署）

## 📝 許可證

© 2025 智能水族箱監控系統
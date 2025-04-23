'use client';

import { useState, useEffect, useRef } from 'react';

export default function FishCounter() {
  const [fishCount, setFishCount] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 建立 WebSocket 連接
    const ws = new WebSocket('wss://a1wss.iside.space/ws/fish/');
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      console.log('魚群監測 WebSocket 已連接');
    };

    ws.onmessage = (event) => {
      try {
        const jsonData = JSON.parse(event.data);
        console.log('魚群監測收到數據:', jsonData); // 添加日誌以便調試
        
        // 檢查 message3 屬性 (伺服器實際發送的格式)
        if (jsonData && jsonData.message3) {
          const count = parseInt(jsonData.message3, 10);
          if (!isNaN(count)) {
            console.log('解析到魚群數量:', count);
            setFishCount(count);
          }
        }
        // 備用：也檢查 message 屬性
        else if (jsonData && typeof jsonData.message === 'string') {
          // 嘗試從消息中提取數字
          const countMatch = jsonData.message.match(/^(\d+)/);
          if (countMatch && countMatch[1]) {
            const count = parseInt(countMatch[1], 10);
            if (!isNaN(count)) {
              console.log('解析到魚群數量:', count);
              setFishCount(count);
            }
          }
        }
      } catch (err) {
        console.error('解析數據錯誤:', err);
      }
    };

    ws.onerror = (err) => {
      setError('WebSocket 連接錯誤');
      setIsConnected(false);
      console.error('WebSocket 錯誤:', err);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('魚群監測 WebSocket 連接已關閉');
    };

    // 清理函數
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="h-full rounded-xl bg-red-50 p-4 text-red-500 border border-red-200 shadow-sm flex flex-col justify-center items-center">
        <svg className="w-10 h-10 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium mb-1">連接錯誤</p>
        <p className="text-sm">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          onClick={() => window.location.reload()}
        >
          重新嘗試
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="h-full rounded-xl bg-gray-50 p-4 animate-pulse shadow-sm border border-gray-200 flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 mb-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-base font-medium text-gray-600">連接到魚群監測中...</p>
        <p className="text-sm text-gray-500 mt-2">正在建立數據連接</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
          </svg>
          魚群監測
        </h3>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
          即時監測中
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 h-[calc(100%-3rem)]">
        <div className="text-6xl font-bold text-blue-600 mb-4 animate-pulse">
          {fishCount !== null ? fishCount : '-'}
        </div>
        <div className="text-gray-700 text-xl font-medium mb-2">
          目前偵測到的魚隻數量
        </div>
        <div className="mt-3 text-sm text-gray-600 text-center">
          使用人工智慧影像辨識技術<br />實時監測魚缸內魚隻數量
        </div>
      </div>
    </div>
  );
}
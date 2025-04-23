'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TemperatureData {
  time: string;
  value: number;
}

export default function TemperatureChart() {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    // 建立 WebSocket 連接
    const ws = new WebSocket('wss://a1wss.iside.space/ws/temp/');
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const jsonData = JSON.parse(event.data);
        if (jsonData && typeof jsonData.message === 'string') {
          // 解析字符串格式的溫度數據，例如 "26.4 => server echo"
          const temperatureMatch = jsonData.message.match(/^(\d+(\.\d+)?)/);
          if (temperatureMatch && temperatureMatch[1]) {
            const temperatureValue = parseFloat(temperatureMatch[1]);
            
            if (!isNaN(temperatureValue)) {
              const now = new Date();
              const timeStr = now.toLocaleTimeString();
              
              setData(prevData => {
                // 保持最新的 60 筆資料
                const newData = [...prevData, { time: timeStr, value: temperatureValue }];
                if (newData.length > 60) {
                  return newData.slice(newData.length - 60);
                }
                return newData;
              });
            }
          }
        }
      } catch (err) {
        console.error('解析資料錯誤:', err);
      }
    };

    ws.onerror = (err) => {
      setError('WebSocket 連接錯誤');
      setIsConnected(false);
      console.error('WebSocket 錯誤:', err);
    };

    ws.onclose = () => {
      setIsConnected(false);
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
      <div className="h-full flex flex-col items-center justify-center rounded-lg bg-red-50 p-4 text-red-500 border border-red-200">
        <svg className="w-10 h-10 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium mb-1">連接錯誤</p>
        <p className="text-sm">{error}</p>
        <button 
          className="mt-3 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          onClick={() => window.location.reload()}
        >
          重新嘗試
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="h-full flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 animate-pulse border border-gray-200">
        <svg className="animate-spin h-10 w-10 mb-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-base font-medium text-gray-700">正在連接到溫度伺服器...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          溫度資料即時監控
        </h2>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium text-sm">
          {data.length > 0 ? `${data[data.length - 1].value}°C` : '等待資料...'}
        </div>
      </div>
      
      <div className="flex-grow" style={{ minHeight: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: '#666' }} 
              stroke="#ddd"
              tickLine={false}
              height={30}
            />
            <YAxis 
              domain={['dataMin - 1', 'dataMax + 1']} 
              tick={{ fontSize: 10, fill: '#666' }}
              stroke="#ddd"
              tickLine={false}
              axisLine={false}
              unit="°C"
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #eee'
              }} 
              labelStyle={{ color: '#333', fontWeight: 'bold' }}
            />
            <Legend verticalAlign="top" height={20} />
            <Line
              name="水溫"
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-1 flex justify-between text-xs">
        <div className="text-gray-500">
          {data.length > 0 ? `資料點數: ${data.length}/60` : '等待資料...'}
        </div>
        <div className="text-blue-600 font-medium">
          {isConnected ? '即時連接中' : '連接已中斷'}
        </div>
      </div>
    </div>
  );
}
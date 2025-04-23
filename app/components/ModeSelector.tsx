'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';

type ControlCommand = 'LED_ON' | 'LED_OFF' | 'FOOD_ON' | 'FOOD_OFF' | 'HOT_ON' | 'HOT_OFF';
type ControlType = 'LED' | 'FOOD' | 'HOT';

export default function ModeSelector() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeControls, setActiveControls] = useState<Record<ControlType, boolean>>({
    LED: false,
    FOOD: false,
    HOT: false
  });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 建立 WebSocket 連接
    const ws = new WebSocket('wss://a1wss.iside.space/ws/mode/');
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
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

  const handleControlChange = (command: ControlCommand) => {
    if (!isConnected || !wsRef.current) return;
    
    try {
      // 使用正確的 JSON 格式傳送指令
      const messageObj = JSON.stringify({ message: command });
      wsRef.current.send(messageObj);
      
      // 更新控制狀態
      const controlType = command.split('_')[0] as ControlType;
      const isOn = command.endsWith('_ON');
      
      setActiveControls(prev => ({
        ...prev,
        [controlType]: isOn
      }));
    } catch (err) {
      console.error('傳送控制指令錯誤:', err);
      setError('傳送控制指令失敗');
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-500 border border-red-200 shadow-sm">
        <p className="text-lg font-semibold mb-2">連接錯誤</p>
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          onClick={() => window.location.reload()}
        >
          重新嘗試
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          魚缸控制面板
        </h2>
        <div className={`px-3 py-1 rounded-full ${isConnected ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-600'} text-sm font-medium flex items-center`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`}></span>
          {isConnected ? '已連接' : '連接中...'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LED 控制 */}
        <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="font-semibold text-gray-800">LED 燈光</h3>
          </div>
          <div className="flex gap-3 justify-center">
            <Button 
              variant={activeControls.LED ? 'default' : 'outline'}
              disabled={!isConnected}
              onClick={() => handleControlChange('LED_ON')}
              className={`w-24 ${activeControls.LED ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-700'}`}
            >
              開啟
            </Button>
            <Button 
              variant={!activeControls.LED ? 'default' : 'outline'}
              disabled={!isConnected}
              onClick={() => handleControlChange('LED_OFF')}
              className="w-24"
            >
              關閉
            </Button>
          </div>
          <div className="mt-3 text-center">
            <span className={`text-sm font-medium ${activeControls.LED ? 'text-blue-700' : 'text-gray-500'}`}>
              {activeControls.LED ? '燈光已開啟' : '燈光已關閉'}
            </span>
          </div>
        </div>
        
        {/* 飼料機控制 */}
        <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="font-semibold text-gray-800">飼料機</h3>
          </div>
          <div className="flex gap-3 justify-center">
            <Button 
              variant={activeControls.FOOD ? 'default' : 'outline'}
              disabled={!isConnected}
              onClick={() => handleControlChange('FOOD_ON')}
              className={`w-24 ${activeControls.FOOD ? 'bg-orange-600 hover:bg-orange-700' : 'text-orange-700'}`}
            >
              投餵
            </Button>
            <Button 
              variant={!activeControls.FOOD ? 'default' : 'outline'}
              disabled={!isConnected}
              onClick={() => handleControlChange('FOOD_OFF')}
              className="w-24"
            >
              停止
            </Button>
          </div>
          <div className="mt-3 text-center">
            <span className={`text-sm font-medium ${activeControls.FOOD ? 'text-orange-700' : 'text-gray-500'}`}>
              {activeControls.FOOD ? '正在投餵中' : '投餵已停止'}
            </span>
          </div>
        </div>
        
        {/* 加熱器控制 */}
        <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-red-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            <h3 className="font-semibold text-gray-800">加熱器</h3>
          </div>
          <div className="flex gap-3 justify-center">
            <Button 
              variant={activeControls.HOT ? 'default' : 'outline'}
              disabled={!isConnected}
              onClick={() => handleControlChange('HOT_ON')}
              className={`w-24 ${activeControls.HOT ? 'bg-red-600 hover:bg-red-700' : 'text-red-700'}`}
            >
              開啟
            </Button>
            <Button 
              variant={!activeControls.HOT ? 'default' : 'outline'}
              disabled={!isConnected}
              onClick={() => handleControlChange('HOT_OFF')}
              className="w-24"
            >
              關閉
            </Button>
          </div>
          <div className="mt-3 text-center">
            <span className={`text-sm font-medium ${activeControls.HOT ? 'text-red-700' : 'text-gray-500'}`}>
              {activeControls.HOT ? '加熱中' : '加熱已停止'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-5 text-center">
        <p className="text-sm text-gray-500">控制設備前請確保水族箱中的環境安全</p>
      </div>
    </div>
  );
}
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
      <div className="rounded-xl bg-red-50 p-6 text-red-500 border border-red-200 shadow-sm">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-lg font-semibold">連接錯誤</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
        <button 
          className="mt-4 w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
          onClick={() => window.location.reload()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重新嘗試連接
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* 標題區域 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2.5 rounded-xl">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">魚缸控制面板</h2>
        </div>
        
        <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${isConnected ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-600 border border-amber-200'}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="font-medium text-sm">
            {isConnected ? '已連接控制系統' : '正在連接中...'}
          </span>
        </div>
      </div>

      {/* 控制卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* LED 燈光控制卡片 */}
        <div className="relative overflow-hidden rounded-xl border border-blue-100 shadow-sm">
          {/* 卡片標題 */}
          <div className="p-5 pb-3 bg-gradient-to-r from-blue-50 to-blue-100/30 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-700">LED 燈光</h3>
              </div>
              <span className={`text-xs font-medium py-1 px-2 rounded-full ${activeControls.LED ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                {activeControls.LED ? '已開啟' : '已關閉'}
              </span>
            </div>
          </div>

          {/* 卡片內容 */}
          <div className="p-5 pt-3 bg-white">
            {/* 燈光視覺指示 */}
            <div className="flex justify-center items-center my-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${activeControls.LED ? 'bg-yellow-100 shadow-lg shadow-yellow-200' : 'bg-gray-100'}`}>
                <svg className={`w-10 h-10 ${activeControls.LED ? 'text-yellow-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeControls.LED ? 2.5 : 1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>

            {/* 控制按鈕 */}
            <div className="flex justify-between gap-2 mt-4">
              <Button 
                disabled={!isConnected || activeControls.LED}
                onClick={() => handleControlChange('LED_ON')}
                className={`flex-1 transition-all ${activeControls.LED 
                  ? 'bg-blue-100 text-blue-500 cursor-default hover:bg-blue-100' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'}`}
              >
                開啟
              </Button>
              <Button 
                disabled={!isConnected || !activeControls.LED}
                onClick={() => handleControlChange('LED_OFF')}
                variant="outline"
                className={`flex-1 transition-all ${!activeControls.LED 
                  ? 'bg-gray-100 cursor-default hover:bg-gray-100' 
                  : 'border-blue-200 text-blue-700 hover:bg-blue-50'}`}
              >
                關閉
              </Button>
            </div>
          </div>

          {/* 光效裝飾 (僅當燈開啟時顯示) */}
          {activeControls.LED && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-100/0 via-yellow-200/10 to-yellow-400/20 animate-pulse"></div>
            </div>
          )}
        </div>

        {/* 飼料機控制卡片 */}
        <div className="relative overflow-hidden rounded-xl border border-orange-100 shadow-sm">
          {/* 卡片標題 */}
          <div className="p-5 pb-3 bg-gradient-to-r from-orange-50 to-orange-100/30 border-b border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-700">飼料機</h3>
              </div>
              <span className={`text-xs font-medium py-1 px-2 rounded-full ${activeControls.FOOD ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                {activeControls.FOOD ? '投餵中' : '已停止'}
              </span>
            </div>
          </div>

          {/* 卡片內容 */}
          <div className="p-5 pt-3 bg-white">
            {/* 飼料機視覺指示 */}
            <div className="flex justify-center items-center my-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${activeControls.FOOD ? 'bg-orange-100 shadow-lg shadow-orange-200' : 'bg-gray-100'}`}>
                <svg className={`w-10 h-10 ${activeControls.FOOD ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeControls.FOOD ? 2.5 : 1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>

            {/* 控制按鈕 */}
            <div className="flex justify-between gap-2 mt-4">
              <Button 
                disabled={!isConnected || activeControls.FOOD}
                onClick={() => handleControlChange('FOOD_ON')}
                className={`flex-1 transition-all ${activeControls.FOOD 
                  ? 'bg-orange-100 text-orange-500 cursor-default hover:bg-orange-100' 
                  : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg'}`}
              >
                投餵
              </Button>
              <Button 
                disabled={!isConnected || !activeControls.FOOD}
                onClick={() => handleControlChange('FOOD_OFF')}
                variant="outline"
                className={`flex-1 transition-all ${!activeControls.FOOD 
                  ? 'bg-gray-100 cursor-default hover:bg-gray-100' 
                  : 'border-orange-200 text-orange-700 hover:bg-orange-50'}`}
              >
                停止
              </Button>
            </div>
          </div>

          {/* 動畫效果 (僅當投餵時顯示) */}
          {activeControls.FOOD && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-tr from-orange-100/0 via-orange-200/10 to-orange-400/20 animate-pulse"></div>
            </div>
          )}
        </div>

        {/* 加熱器控制卡片 */}
        <div className="relative overflow-hidden rounded-xl border border-red-100 shadow-sm">
          {/* 卡片標題 */}
          <div className="p-5 pb-3 bg-gradient-to-r from-red-50 to-red-100/30 border-b border-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-700">加熱器</h3>
              </div>
              <span className={`text-xs font-medium py-1 px-2 rounded-full ${activeControls.HOT ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                {activeControls.HOT ? '加熱中' : '已關閉'}
              </span>
            </div>
          </div>

          {/* 卡片內容 */}
          <div className="p-5 pt-3 bg-white">
            {/* 加熱器視覺指示 */}
            <div className="flex justify-center items-center my-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${activeControls.HOT ? 'bg-red-100 shadow-lg shadow-red-200' : 'bg-gray-100'}`}>
                <svg className={`w-10 h-10 ${activeControls.HOT ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeControls.HOT ? 2.5 : 1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
              </div>
            </div>

            {/* 控制按鈕 */}
            <div className="flex justify-between gap-2 mt-4">
              <Button 
                disabled={!isConnected || activeControls.HOT}
                onClick={() => handleControlChange('HOT_ON')}
                className={`flex-1 transition-all ${activeControls.HOT 
                  ? 'bg-red-100 text-red-500 cursor-default hover:bg-red-100' 
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'}`}
              >
                開啟
              </Button>
              <Button 
                disabled={!isConnected || !activeControls.HOT}
                onClick={() => handleControlChange('HOT_OFF')}
                variant="outline"
                className={`flex-1 transition-all ${!activeControls.HOT 
                  ? 'bg-gray-100 cursor-default hover:bg-gray-100' 
                  : 'border-red-200 text-red-700 hover:bg-red-50'}`}
              >
                關閉
              </Button>
            </div>
          </div>

          {/* 加熱效果 (僅當加熱器開啟時顯示) */}
          {activeControls.HOT && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-tr from-red-100/0 via-red-200/10 to-red-400/20 animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* 提示信息 */}
      <div className="mt-6 text-center rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">控制設備前請確保水族箱中的環境安全</p>
        </div>
      </div>
    </div>
  );
}
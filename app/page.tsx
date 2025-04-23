import VideoPlayer from './components/VideoPlayer';
import TemperatureChart from './components/TemperatureChart';
import ModeSelector from './components/ModeSelector';
import FishCounter from './components/FishCounter';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <div className="flex justify-center items-center mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800 ml-2">智能水族箱監控系統</h1>
          </div>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            全方位即時監控與控制您的水族生態系統，確保最佳的水質與環境條件
          </p>
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
            即時監測中
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 視頻監控模組 - 占用12欄 */}
          <div className="lg:col-span-12 w-full">
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                即時視訊監控
              </h2>
              <VideoPlayer src="https://a1hls.iside.space/test.m3u8" className="rounded-lg overflow-hidden" />
              <p className="mt-3 text-sm text-gray-500 text-center">高清即時視訊，持續監控水族箱狀態</p>
            </div>
          </div>
          
          {/* 將三個監測模組放在同一列，使用固定高度確保一致性 */}
          <div className="flex flex-col lg:flex-row gap-5 lg:col-span-12">
            {/* 溫度折線圖模組 */}
            <div className="flex-1 bg-white p-5 rounded-xl shadow-md border border-gray-200 h-[400px]">
              <div className="h-full flex flex-col">
                <div className="flex-grow">
                  <TemperatureChart />
                </div>
              </div>
            </div>
            
            {/* 水溫提示模組 */}
            <div className="flex-1 bg-white p-5 rounded-xl shadow-md border border-gray-200 h-[400px]">
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    水溫提示
                  </h3>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    參考指南
                  </div>
                </div>
                
                <div className="flex-grow flex flex-col justify-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-blue-800 font-medium mb-2 text-center">熱帶魚適宜溫度</h4>
                      <div className="bg-blue-100 rounded-lg p-3 text-center">
                        <span className="text-xl font-bold text-blue-700">24-28°C</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-blue-800 font-medium mb-2 text-center">冷水魚適宜溫度</h4>
                      <div className="bg-blue-100 rounded-lg p-3 text-center">
                        <span className="text-xl font-bold text-blue-700">18-22°C</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-blue-800 text-center mt-2">
                      請根據魚種選擇適宜的水溫範圍
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 魚群數量監測模組 */}
            <div className="flex-1 bg-white p-5 rounded-xl shadow-md border border-gray-200 h-[400px]">
              <div className="h-full flex flex-col">
                <FishCounter />
              </div>
            </div>
          </div>
          
          {/* 控制面板模組 - 占用全部12欄 */}
          <div className="lg:col-span-12 w-full">
            <ModeSelector />
          </div>
        </div>
        
        <footer className="mt-8 py-5 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-3 md:mb-0 text-sm">&copy; 2025 智能水族箱監控系統</p>
            <div className="flex space-x-5">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">使用說明</a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">技術支援</a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">系統狀態</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

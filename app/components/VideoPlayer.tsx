'use client';

import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
// 引入 HTTP Streaming 支援
import '@videojs/http-streaming';
import type Player from 'video.js/dist/types/player';

interface VideoPlayerProps {
  src: string;
  className?: string; // 添加自定義類名支持
}

export default function VideoPlayer({ src, className = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // 確保元素已加載
    if (!videoRef.current) return;

    // 初始化播放器
    const videoElement = document.createElement('video-js');
    videoElement.classList.add('vjs-big-play-centered', 'vjs-matrix', 'aspect-video');
    videoRef.current.appendChild(videoElement);

    // 播放器配置，優化延遲設定
    const player = playerRef.current = videojs(videoElement, {
      controls: true,
      autoplay: true,
      preload: 'auto',
      fluid: true,
      liveui: true, // 啟用直播 UI
      html5: {
        hls: {
          overrideNative: true,
          limitRenditionByPlayerDimensions: false,
          useBandwidthFromLocalStorage: true,
          // 降低延遲的關鍵設定
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          // 減少緩衝區大小以降低延遲
          bufferSize: 1, // 秒
          liveSyncDurationCount: 1, // 直播同步區間
          // 指定較低的初始緩衝區
          liveBackBufferLength: 0
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false
      },
      sources: [{
        src: src,
        type: 'application/x-mpegURL'
      }]
    });

    // 降低緩衝延遲
    if (player.tech_ && player.tech_.hls) {
      // 設置低延遲模式 (若可用)
      player.tech_.hls.bandwidth = 5000000; // 初始頻寬估計較高，避免切換
      player.tech_.hls.masterPlaylistController_.fastQualityChange_(); // 快速品質切換
    }

    // 添加自定義CSS來優化播放器外觀
    const playerContainer = videoRef.current;
    if (playerContainer) {
      playerContainer.style.maxWidth = '100%';
      playerContainer.style.margin = '0 auto';
    }

    // 當組件卸載時銷毀播放器
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      <div className="video-container relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-blue-900/10 to-slate-900/20 p-1" ref={videoRef} data-vjs-player />
    </div>
  );
}
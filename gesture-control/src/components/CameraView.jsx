import React from 'react';
import { Camera, CameraOff, AlertTriangle, Loader2, Hand, Video, Square } from 'lucide-react';
import FpsCounter from './FpsCounter';

const CameraView = ({ videoRef, canvasRef, startDetection, stopDetection, isDetecting, isReady, error, fps }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Camera Container */}
      <div className="relative w-full aspect-video bg-slate-800/60 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex items-center justify-center">

        {/* HUD — top right */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <FpsCounter fps={fps} isDetecting={isDetecting} />
          {isDetecting && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-600/80 backdrop-blur rounded-lg text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          )}
        </div>

        {/* Loading */}
        {!isReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-30 gap-4">
            <Loader2 size={40} className="text-teal-500 animate-spin" />
            <div className="text-center">
              <p className="text-slate-300 font-medium">Loading AI Model…</p>
              <p className="text-slate-500 text-sm mt-1">Downloading MediaPipe Gesture Recognizer</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/60 z-30 p-6 gap-3">
            <AlertTriangle size={36} className="text-red-400" />
            <p className="text-red-400 font-medium text-center text-sm leading-relaxed max-w-xs">{error}</p>
          </div>
        )}

        {/* Idle placeholder */}
        {!isDetecting && isReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-900/80 gap-3">
            <Hand size={52} className="text-teal-500 animate-bounce" strokeWidth={1.5} />
            <p className="text-slate-300 font-semibold">Ready to Detect</p>
            <p className="text-slate-500 text-sm">Click Start Camera to begin</p>
          </div>
        )}

        {/* VIDEO */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0 scale-x-[-1]"
          playsInline
          muted
        />
        {/* CANVAS */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-10 scale-x-[-1]"
        />
      </div>

      {/* Controls */}
      <div className="mt-5 flex justify-center">
        {!isDetecting ? (
          <button
            onClick={startDetection}
            disabled={!isReady || !!error}
            className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-teal-500/40 disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:scale-95"
          >
            <Video size={18} />
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopDetection}
            className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/40 transform hover:-translate-y-0.5 active:scale-95"
          >
            <Square size={16} fill="currentColor" />
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraView;

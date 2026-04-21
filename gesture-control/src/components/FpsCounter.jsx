import React from 'react';
import { Wifi, WifiOff, Gauge } from 'lucide-react';

const FpsCounter = ({ fps, isDetecting }) => {
  const color =
    fps >= 25 ? 'text-emerald-400' :
    fps >= 15 ? 'text-yellow-400' :
    'text-red-400';

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-700 text-xs font-mono">
      <Gauge size={12} className={isDetecting ? 'text-emerald-400' : 'text-slate-600'} />
      <span className="text-slate-500">FPS</span>
      <span className={`font-bold ${isDetecting ? color : 'text-slate-600'}`}>
        {isDetecting ? fps : '--'}
      </span>
    </div>
  );
};

export default FpsCounter;

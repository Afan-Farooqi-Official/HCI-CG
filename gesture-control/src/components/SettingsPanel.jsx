import React from 'react';
import { Users, SlidersHorizontal, Target, MousePointer } from 'lucide-react';

const SettingsPanel = ({ settings, onChange, isDetecting }) => {
  const disabled = isDetecting;

  return (
    <div className="flex flex-col gap-5">
      {/* Number of Hands */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users size={14} className="text-slate-400" />
          <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Number of Hands
          </label>
        </div>
        <div className="flex gap-2">
          {[1, 2].map((n) => (
            <button
              key={n}
              onClick={() => !disabled && onChange({ ...settings, numHands: n })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all duration-200 ${
                settings.numHands === n
                  ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                  : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {n} Hand{n > 1 ? 's' : ''}
            </button>
          ))}
        </div>
        {disabled && (
          <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1">
            Stop camera to change settings.
          </p>
        )}
      </div>

      {/* Detection Confidence */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-slate-400" />
            <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Detection Confidence
            </label>
          </div>
          <span className="text-xs font-mono text-teal-400 font-bold">
            {Math.round(settings.minHandDetectionConfidence * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1" max="0.9" step="0.05"
          value={settings.minHandDetectionConfidence}
          disabled={disabled}
          onChange={(e) => onChange({ ...settings, minHandDetectionConfidence: parseFloat(e.target.value) })}
          className="w-full accent-teal-500 disabled:opacity-40"
        />
        <div className="flex justify-between text-xs text-slate-600 mt-1">
          <span>10% — Sensitive</span>
          <span>90% — Strict</span>
        </div>
      </div>

      {/* Tracking Confidence */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Tracking Confidence
            </label>
          </div>
          <span className="text-xs font-mono text-teal-400 font-bold">
            {Math.round(settings.minTrackingConfidence * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1" max="0.9" step="0.05"
          value={settings.minTrackingConfidence}
          disabled={disabled}
          onChange={(e) => onChange({ ...settings, minTrackingConfidence: parseFloat(e.target.value) })}
          className="w-full accent-teal-500 disabled:opacity-40"
        />
        <div className="flex justify-between text-xs text-slate-600 mt-1">
          <span>10% — Loose</span>
          <span>90% — Strict</span>
        </div>
      </div>

      {/* Color Legend */}
      <div className="pt-3 border-t border-slate-700">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Skeleton Color Legend</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-400" />
            <span className="text-sm text-slate-400">Left Hand</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400" />
            <span className="text-sm text-slate-400">Right Hand</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

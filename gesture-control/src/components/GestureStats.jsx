import React from 'react';
import { BarChart3 } from 'lucide-react';
import { GESTURE_ICON_MAP, OpenPalmIcon } from './GestureIcons';

const GESTURE_COLORS = {
  Thumb_Up:    'text-emerald-400',
  Thumb_Down:  'text-red-400',
  Open_Palm:   'text-teal-400',
  Closed_Fist: 'text-orange-400',
  Pointing_Up: 'text-blue-400',
  Victory:     'text-yellow-400',
  ILoveYou:    'text-pink-400',
  None:        'text-slate-500',
};

const BAR_COLORS = [
  'bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-emerald-500', 'bg-sky-500', 'bg-rose-500',
];

const GestureStats = ({ gestureCounts }) => {
  const entries = Object.entries(gestureCounts).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, c]) => sum + c, 0);
  const max = entries[0]?.[1] ?? 1;

  if (entries.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600 gap-3">
        <BarChart3 size={36} strokeWidth={1.5} />
        <p className="text-sm">No statistics yet.<br />Detected gestures will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Gesture Frequency</p>
        <span className="text-xs text-slate-500">{total} total</span>
      </div>

      <div className="space-y-3 flex-1">
        {entries.map(([name, count], i) => {
          const pct = Math.round((count / total) * 100);
          const barPct = Math.round((count / max) * 100);
          const color = BAR_COLORS[i % BAR_COLORS.length];
          const GestureIcon = GESTURE_ICON_MAP[name] ?? OpenPalmIcon;
          const iconColor = GESTURE_COLORS[name] ?? 'text-teal-400';
          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <GestureIcon size={15} className={iconColor} strokeWidth={1.5} />
                  <span className="text-sm text-slate-300 font-medium">{name.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{pct}%</span>
                  <span className="text-sm font-bold text-white font-mono w-8 text-right">{count}</span>
                </div>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${barPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GestureStats;

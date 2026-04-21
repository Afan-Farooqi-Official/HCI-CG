import React from 'react';
import { Trash2, ClipboardList } from 'lucide-react';
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

const HAND_DOT = {
  Right: 'bg-orange-400',
  Left:  'bg-sky-400',
};

const GestureHistory = ({ history, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600 gap-3">
        <ClipboardList size={36} strokeWidth={1.5} />
        <p className="text-sm">No gestures detected yet.<br />Start the camera and make a gesture!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
          Last {history.length} Gestures
        </p>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={13} />
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ maxHeight: '400px' }}>
        {history.map((entry, i) => {
          const GestureIcon = GESTURE_ICON_MAP[entry.name] ?? OpenPalmIcon;
          const color = GESTURE_COLORS[entry.name] ?? 'text-teal-400';
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 bg-slate-800/70 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors"
            >
              <div className="w-8 h-8 bg-slate-700/60 rounded-lg flex items-center justify-center shrink-0">
                <GestureIcon size={16} className={color} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  {entry.name.replace(/_/g, ' ')}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${HAND_DOT[entry.hand] ?? 'bg-slate-500'}`} />
                  <span className="text-xs text-slate-500">{entry.hand} · {entry.time}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-blue-400 shrink-0">{entry.confidence}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GestureHistory;

import React from 'react';
import { GESTURE_ICON_MAP, OpenPalmIcon } from './GestureIcons';

const GESTURE_LABELS = {
  None:         'None',
  Closed_Fist:  'Closed Fist',
  Open_Palm:    'Open Palm',
  Pointing_Up:  'Pointing Up',
  Thumb_Down:   'Thumb Down',
  Thumb_Up:     'Thumb Up',
  Victory:      'Victory',
  ILoveYou:     'I Love You',
};

const GESTURE_ACTIONS = {
  Thumb_Up:    'Play / Approve',
  Thumb_Down:  'Pause / Reject',
  Open_Palm:   'Stop',
  Closed_Fist: 'Next',
  Victory:     'Screenshot',
  Pointing_Up: 'Scroll Up',
  ILoveYou:    'Like / Favorite',
};

const HAND_BADGE = {
  Right: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Left:  'bg-sky-500/20 text-sky-400 border-sky-500/30',
};

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

const GestureDisplay = ({ results }) => {
  if (!results?.gestures?.length) {
    return (
      <div className="p-5 bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Gesture</p>
          <p className="text-xl font-bold text-slate-600">Waiting for hand…</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Confidence</p>
          <p className="text-xl font-mono text-slate-600">--%</p>
        </div>
      </div>
    );
  }

  const hands = results.gestures.map((gestureList, i) => {
    const g = gestureList[0];
    const side = results.handednesses?.[i]?.[0]?.displayName ?? 'Right';
    const GestureIcon = GESTURE_ICON_MAP[g.categoryName] ?? OpenPalmIcon;
    const color = GESTURE_COLORS[g.categoryName] ?? 'text-teal-400';
    return {
      name: g.categoryName,
      label: GESTURE_LABELS[g.categoryName] ?? g.categoryName,
      GestureIcon,
      color,
      side,
      confidence: Math.round(g.score * 100),
      action: GESTURE_ACTIONS[g.categoryName] ?? null,
    };
  });

  return (
    <div className="flex flex-col gap-3">
      {hands.map((hand, i) => (
        <div
          key={i}
          className="p-5 bg-slate-800/80 backdrop-blur rounded-2xl border border-teal-500/30 flex items-center justify-between shadow-[0_0_20px_rgba(45,212,191,0.07)] transition-all duration-300 animate-fade-in-up"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-700/60 rounded-xl flex items-center justify-center border border-slate-600/80 shrink-0">
              <hand.GestureIcon size={30} className={hand.color} strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-bold text-teal-400">{hand.label}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${HAND_BADGE[hand.side]}`}>
                  {hand.side}
                </span>
              </div>
              {hand.action && (
                <p className="text-sm text-slate-400">{hand.action}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[90px]">
            <p className="text-3xl font-mono font-bold text-blue-400">{hand.confidence}%</p>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-200"
                style={{ width: `${hand.confidence}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GestureDisplay;

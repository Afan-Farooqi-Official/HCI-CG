import React, { useState } from 'react';
import {
  Hand, Activity, Pause, Play, Camera, SkipForward, ScrollText,
  BarChart3, Settings, History, Wifi, Radio
} from 'lucide-react';
import {
  ThumbUpIcon, ThumbDownIcon, OpenPalmIcon, ClosedFistIcon,
  PointingUpIcon, VictoryIcon, ILoveYouIcon
} from './components/GestureIcons';

import CameraView from './components/CameraView';
import GestureDisplay from './components/GestureDisplay';
import GestureHistory from './components/GestureHistory';
import GestureStats from './components/GestureStats';
import SettingsPanel from './components/SettingsPanel';
import { useGesture } from './hooks/useGesture';
import { gestureService } from './services/GestureService';

const DEFAULT_SETTINGS = {
  numHands: 2,
  minHandDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
};

const TABS = [
  { key: 'live',     label: 'Live',     Icon: Activity },
  { key: 'history',  label: 'History',  Icon: History },
  { key: 'stats',    label: 'Stats',    Icon: BarChart3 },
  { key: 'settings', label: 'Settings', Icon: Settings },
];

// Gesture guide with accurate hand-pose icons
const GESTURE_GUIDE = [
  { Icon: ThumbUpIcon,    label: 'Thumb Up' },
  { Icon: ThumbDownIcon,  label: 'Thumb Down' },
  { Icon: ClosedFistIcon, label: 'Closed Fist' },
  { Icon: OpenPalmIcon,   label: 'Open Palm' },
  { Icon: PointingUpIcon, label: 'Pointing Up' },
  { Icon: VictoryIcon,    label: 'Victory' },
  { Icon: ILoveYouIcon,   label: 'I Love You' },
];

// Action map with accurate hand-pose icons
const ACTION_MAP = [
  { Icon: ThumbUpIcon,    name: 'Thumb Up',    action: 'Play / Approve',  ActionIcon: Play },
  { Icon: ThumbDownIcon,  name: 'Thumb Down',  action: 'Pause / Reject',  ActionIcon: Pause },
  { Icon: OpenPalmIcon,   name: 'Open Palm',   action: 'Stop',            ActionIcon: Radio },
  { Icon: ClosedFistIcon, name: 'Closed Fist', action: 'Next',            ActionIcon: SkipForward },
  { Icon: VictoryIcon,    name: 'Victory',     action: 'Screenshot',      ActionIcon: Camera },
  { Icon: PointingUpIcon, name: 'Point Up',    action: 'Scroll Up',       ActionIcon: ScrollText },
  { Icon: ILoveYouIcon,   name: 'I Love You',  action: 'Like / Favorite', ActionIcon: Play },
];

function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState('live');

  const {
    videoRef, canvasRef,
    isReady, isDetecting,
    results, error,
    fps, gestureHistory, gestureCounts,
    startDetection, stopDetection, clearHistory,
  } = useGesture(settings);

  const handleSettingsChange = async (next) => {
    setSettings(next);
    if (!isDetecting) {
      gestureService.close();
      gestureService.isInitialized = false;
      gestureService.initPromise = null;
      await gestureService.initialize(next);
    }
  };

  const totalDetections = Object.values(gestureCounts).reduce((s, c) => s + c, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* ── Header ── */}
      <header className="border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
            <Hand size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 leading-tight">
              Visionary Gestures
            </h1>
            <p className="text-xs text-slate-500">MediaPipe · Real-time Detection</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs font-mono">
            <Activity size={11} className="text-slate-500" />
            <span className="text-slate-500">detected</span>
            <span className="text-teal-400 font-bold">{totalDetections}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs font-mono">
            <Hand size={11} className="text-slate-500" />
            <span className="text-slate-500">hands</span>
            <span className="text-blue-400 font-bold">{settings.numHands}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${isDetecting ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
            <Wifi size={11} />
            {isDetecting ? 'LIVE' : 'IDLE'}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Left: Camera + Live gesture display */}
        <div className="flex-1 flex flex-col gap-5 p-5 min-w-0">
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            isReady={isReady}
            error={error}
            fps={fps}
            startDetection={startDetection}
            stopDetection={stopDetection}
            isDetecting={isDetecting}
          />

          {isDetecting && (
            <div className="animate-fade-in-up">
              <GestureDisplay results={results} />
            </div>
          )}

          {/* Gesture guide when idle */}
          {!isDetecting && isReady && (
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-3 text-center">Supported Gestures</p>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {GESTURE_GUIDE.map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 hover:border-teal-500/40 transition-colors gap-2">
                    <Icon size={22} className="text-teal-400" strokeWidth={1.5} />
                    <span className="text-xs text-slate-500 text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Side Panel */}
        <div className="lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            {TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors duration-200 border-b-2 ${
                  activeTab === key
                    ? 'border-teal-500 text-teal-400 bg-teal-500/5'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-5 overflow-y-auto">
            {activeTab === 'live' && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">Real-time Info</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'FPS', value: isDetecting ? fps : '--', color: 'text-emerald-400' },
                    { label: 'Detections', value: totalDetections, color: 'text-teal-400' },
                    { label: 'Hands', value: settings.numHands, color: 'text-blue-400' },
                    { label: 'Unique', value: Object.keys(gestureCounts).length, color: 'text-purple-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-3 bg-slate-800/70 rounded-xl border border-slate-700 text-center">
                      <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Action Map</p>
                <div className="space-y-1.5">
                  {ACTION_MAP.map(({ Icon, name, action, ActionIcon }) => (
                    <div key={name} className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <Icon size={14} className="text-teal-400 shrink-0" strokeWidth={1.5} />
                        <span className="text-xs text-slate-400">{name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ActionIcon size={11} className="text-slate-600" />
                        <span className="text-xs text-slate-500">{action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <GestureHistory history={gestureHistory} onClear={clearHistory} />
            )}
            {activeTab === 'stats' && (
              <GestureStats gestureCounts={gestureCounts} />
            )}
            {activeTab === 'settings' && (
              <SettingsPanel settings={settings} onChange={handleSettingsChange} isDetecting={isDetecting} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-5 py-2.5 flex items-center justify-between">
        <p className="text-xs text-slate-700">React · Vite · Tailwind CSS v4 · MediaPipe Tasks Vision</p>
        <p className="text-xs text-slate-700">Gesture Detection v2.0</p>
      </footer>
    </div>
  );
}

export default App;

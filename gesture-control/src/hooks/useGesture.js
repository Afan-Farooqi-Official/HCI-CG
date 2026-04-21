import { useState, useEffect, useRef, useCallback } from 'react';
import { gestureService } from '../services/GestureService';

const MAX_HISTORY = 50;

const defaultSettings = {
  numHands: 2,
  minHandDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
};

export function useGesture(settings = defaultSettings) {
  const [isReady, setIsReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [fps, setFps] = useState(0);
  const [gestureHistory, setGestureHistory] = useState([]); // [{name, hand, confidence, time}]
  const [gestureCounts, setGestureCounts] = useState({});   // {gestureName: count}

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const isPlayingRef = useRef(false);
  const initStarted = useRef(false);

  // FPS tracking
  const fpsFrameCount = useRef(0);
  const fpsLastTime = useRef(Date.now());

  // Gesture debounce — only log a new entry when gesture changes
  const lastGestureRef = useRef(null);

  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    gestureService.initialize(settings)
      .then(() => setIsReady(true))
      .catch((err) => {
        console.error(err);
        setError('Failed to load gesture model. Check your internet connection.');
      });

    return () => {
      isPlayingRef.current = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const detectFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isPlayingRef.current) return;

    const video = videoRef.current;

    if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
      const nowInMs = Date.now();
      const detectionResults = gestureService.detectVideo(video, nowInMs);

      if (detectionResults) {
        setResults(detectionResults);

        // Draw landmarks
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        gestureService.drawResults(ctx, detectionResults, canvas.width, canvas.height);
        ctx.restore();

        // Track gesture history (debounce by name change)
        if (detectionResults.gestures?.length > 0) {
          const g = detectionResults.gestures[0][0];
          const hand = detectionResults.handednesses?.[0]?.[0]?.displayName ?? 'Right';
          const name = g.categoryName;
          const confidence = Math.round(g.score * 100);

          if (name !== 'None' && name !== lastGestureRef.current) {
            lastGestureRef.current = name;
            const entry = { name, hand, confidence, time: new Date().toLocaleTimeString() };

            setGestureHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
            setGestureCounts((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
          }
        } else {
          lastGestureRef.current = null;
        }
      }

      // FPS calculation
      fpsFrameCount.current += 1;
      const now = Date.now();
      const elapsed = now - fpsLastTime.current;
      if (elapsed >= 1000) {
        setFps(Math.round((fpsFrameCount.current * 1000) / elapsed));
        fpsFrameCount.current = 0;
        fpsLastTime.current = now;
      }
    }

    if (isPlayingRef.current) {
      requestRef.current = requestAnimationFrame(detectFrame);
    }
  }, []);

  const startDetection = useCallback(async () => {
    if (!videoRef.current || !isReady) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      videoRef.current.srcObject = stream;
      await new Promise((resolve) => { videoRef.current.onloadedmetadata = resolve; });
      await videoRef.current.play();

      if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }

      isPlayingRef.current = true;
      fpsLastTime.current = Date.now();
      fpsFrameCount.current = 0;
      setIsDetecting(true);
      setError(null);
      detectFrame();
    } catch (err) {
      const msg =
        err.name === 'NotReadableError' ? 'Camera is in use by another application.' :
        err.name === 'NotAllowedError' ? 'Camera permission denied. Allow access in browser settings.' :
        'Could not access the camera. Check your device.';
      setError(msg);
      console.error(err);
    }
  }, [isReady, detectFrame]);

  const stopDetection = useCallback(() => {
    isPlayingRef.current = false;
    setIsDetecting(false);
    setFps(0);

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setResults(null);
    lastGestureRef.current = null;

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setGestureHistory([]);
    setGestureCounts({});
    lastGestureRef.current = null;
  }, []);

  return {
    videoRef, canvasRef,
    isReady, isDetecting,
    results, error,
    fps, gestureHistory, gestureCounts,
    startDetection, stopDetection, clearHistory,
  };
}

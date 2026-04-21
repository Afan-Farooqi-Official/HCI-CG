import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

// Hand colors for multi-hand distinction
export const HAND_COLORS = {
  Left: { connector: "#00D4FF", landmark: "#0066FF" },
  Right: { connector: "#FF6B35", landmark: "#FF0066" },
};

export class GestureService {
  constructor() {
    this.gestureRecognizer = null;
    this.runningMode = "VIDEO";
    this.isInitialized = false;
    this.initPromise = null;
  }

  async initialize(options = {}) {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._doInit(options);
    return this.initPromise;
  }

  async _doInit({ numHands = 2, minHandDetectionConfidence = 0.5, minTrackingConfidence = 0.5 } = {}) {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
      );

      this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU",
        },
        runningMode: this.runningMode,
        numHands,
        minHandDetectionConfidence,
        minHandPresenceConfidence: minHandDetectionConfidence,
        minTrackingConfidence,
      });

      this.isInitialized = true;
      console.log("Gesture Recognizer initialized successfully.");
    } catch (error) {
      this.initPromise = null;
      console.error("Error initializing Gesture Recognizer:", error);
      throw error;
    }
  }

  detectVideo(videoElement, timestamp) {
    if (!this.gestureRecognizer || !this.isInitialized) return null;
    try {
      return this.gestureRecognizer.recognizeForVideo(videoElement, timestamp);
    } catch (error) {
      console.error("Detection error:", error);
      return null;
    }
  }

  drawResults(canvasCtx, results, canvasWidth, canvasHeight) {
    if (!results?.landmarks) return;

    const drawingUtils = new DrawingUtils(canvasCtx);

    results.landmarks.forEach((landmarks, i) => {
      const side = results.handednesses?.[i]?.[0]?.displayName ?? "Right";
      const colors = HAND_COLORS[side] ?? HAND_COLORS.Right;

      drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
        color: colors.connector,
        lineWidth: 3,
      });
      drawingUtils.drawLandmarks(landmarks, {
        color: colors.landmark,
        fillColor: "rgba(255,255,255,0.3)",
        lineWidth: 1,
        radius: 5,
      });
    });
  }

  async reconfigure(options = {}) {
    this.close();
    this.isInitialized = false;
    this.initPromise = null;
    await this.initialize(options);
  }

  close() {
    if (this.gestureRecognizer) {
      try { this.gestureRecognizer.close(); } catch (_) {}
      this.gestureRecognizer = null;
    }
    this.isInitialized = false;
    this.initPromise = null;
  }
}

export const gestureService = new GestureService();

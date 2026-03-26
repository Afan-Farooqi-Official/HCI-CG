import { useState, useEffect, useRef, useCallback } from "react";

const MAX_POLYS = 100;
const HIT_RADIUS = 22;
const PALETTE = [
  "#00e5ff", "#ff4d6d", "#b5ff3b", "#ffaa00",
  "#a78bfa", "#ff6ec7", "#39ff14", "#ffffff",
];

function dist(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }

function ptToSegDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  if (dx === 0 && dy === 0) return dist(px, py, ax, ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return dist(px, py, ax + t * dx, ay + t * dy);
}

function nearestVertex(polys, mx, my) {
  let best = { dist: Infinity, pi: -1, vi: -1 };
  polys.forEach((poly, pi) =>
    poly.pts.forEach((pt, vi) => {
      const d = dist(mx, my, pt.x, pt.y);
      if (d < best.dist) best = { dist: d, pi, vi };
    })
  );
  return best;
}

function nearestSegment(polys, mx, my) {
  let best = { dist: Infinity, pi: -1, si: -1 };
  polys.forEach((poly, pi) => {
    for (let i = 0; i < poly.pts.length - 1; i++) {
      const d = ptToSegDist(mx, my, poly.pts[i].x, poly.pts[i].y, poly.pts[i + 1].x, poly.pts[i + 1].y);
      if (d < best.dist) best = { dist: d, pi, si: i };
    }
  });
  return best;
}

function drawCanvas(canvas, { polys, mode, currentPi, selectedPi, mouse, moveState }) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  polys.forEach((poly, pi) => {
    if (!poly.pts.length) return;
    const sel = pi === selectedPi;
    ctx.save();
    if (sel) { ctx.shadowColor = poly.color; ctx.shadowBlur = 22; }
    ctx.beginPath();
    ctx.strokeStyle = poly.color;
    ctx.lineWidth = poly.width;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.moveTo(poly.pts[0].x, poly.pts[0].y);
    poly.pts.slice(1).forEach(pt => ctx.lineTo(pt.x, pt.y));
    if (pi === currentPi && mode === "begin") ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    ctx.restore();

    poly.pts.forEach((pt, vi) => {
      const isMoveTarget = sel && moveState.waiting && vi === moveState.vi;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isMoveTarget ? 12 : sel ? 9 : 5, 0, Math.PI * 2);
      ctx.fillStyle = isMoveTarget ? "#ffaa00" : sel ? poly.color : "rgba(255,255,255,0.22)";
      ctx.fill();
      if (sel || isMoveTarget) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    });
  });

  if (mode === "move" && moveState.waiting && moveState.pi >= 0 && moveState.vi >= 0) {
    const pt = polys[moveState.pi]?.pts[moveState.vi];
    if (pt) {
      ctx.save();
      ctx.setLineDash([7, 5]);
      ctx.strokeStyle = "#ffaa0088";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
      ctx.restore();
    }
  }
}

export default function PolyLineEditor() {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const fileRef   = useRef(null);

  const [polys,       setPolys]       = useState([]);
  const [mode,        setModeRaw]     = useState("idle");
  const [currentPi,   setCurrentPi]   = useState(-1);
  const [selectedPi,  setSelectedPi]  = useState(-1);
  const [strokeColor, setStrokeColor] = useState(PALETTE[0]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [mouse,       setMouse]       = useState({ x: 0, y: 0 });
  const [toast,       setToast]       = useState({ msg: "", show: false });
  const [moveState,   setMoveState]   = useState({ waiting: false, pi: -1, vi: -1 });

  const live = useRef({});
  live.current = { polys, mode, currentPi, selectedPi, mouse, moveState, strokeColor, strokeWidth };

  useEffect(() => {
    drawCanvas(canvasRef.current, { polys, mode, currentPi, selectedPi, mouse, moveState });
  }, [polys, mode, currentPi, selectedPi, mouse, moveState]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const wrap   = wrapRef.current;
      if (!canvas || !wrap) return;
      canvas.width  = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      drawCanvas(canvas, live.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  }, []);

  const setMode = useCallback((m) => {
    const { mode: cur, currentPi: cp, polys: ps } = live.current;
    if (cur === "begin" && m !== "begin" && cp >= 0 && ps[cp]?.pts.length < 2) {
      setPolys(prev => prev.filter((_, i) => i !== cp));
      setCurrentPi(-1);
    }
    setMoveState({ waiting: false, pi: -1, vi: -1 });
    setModeRaw(m);
  }, []);

  const beginPoly = useCallback(() => {
    const { polys: ps, strokeColor: sc, strokeWidth: sw, mode: cur, currentPi: cp } = live.current;
    if (ps.length >= MAX_POLYS) { showToast("Max 100 polylines!"); return; }
    let base = ps;
    if (cur === "begin" && cp >= 0 && ps[cp]?.pts.length < 2)
      base = ps.filter((_, i) => i !== cp);
    const newIdx = base.length;
    setPolys([...base, { pts: [], color: sc, width: sw }]);
    setCurrentPi(newIdx);
    setSelectedPi(newIdx);
    setMoveState({ waiting: false, pi: -1, vi: -1 });
    setModeRaw("begin");
    showToast("Click to add points · Double-click or Esc to finish");
  }, [showToast]);

  const handleMouseMove = useCallback((e) => {
    const r = canvasRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const handleClick = useCallback((e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const { mode: m, polys: ps, currentPi: cp, moveState: mv } = live.current;

    if (m === "begin") {
      if (cp < 0) return;
      setPolys(prev => prev.map((p, i) => i === cp ? { ...p, pts: [...p.pts, { x, y }] } : p));
    } else if (m === "move") {
      if (!mv.waiting) {
        const { pi, vi, dist: d } = nearestVertex(ps, x, y);
        if (pi >= 0 && d < HIT_RADIUS) {
          setSelectedPi(pi);
          setMoveState({ waiting: true, pi, vi });
          showToast("Click destination to place the vertex.");
        } else showToast("No vertex nearby — click closer.");
      } else {
        const { pi, vi } = mv;
        setPolys(prev => prev.map((p, idx) =>
          idx === pi ? { ...p, pts: p.pts.map((pt, j) => j === vi ? { x, y } : pt) } : p
        ));
        setMoveState({ waiting: false, pi: -1, vi: -1 });
        showToast("Vertex moved!");
      }
    } else if (m === "delete") {
      const { pi, vi, dist: d } = nearestVertex(ps, x, y);
      if (pi < 0 || d > HIT_RADIUS) { showToast("No vertex nearby."); return; }
      setPolys(prev => {
        const next = prev.map((p, i) => i === pi ? { ...p, pts: p.pts.filter((_, j) => j !== vi) } : p)
          .filter(p => p.pts.length > 0);
        setSelectedPi(s => Math.min(s, next.length - 1));
        return next;
      });
      showToast("Vertex deleted.");
    } else if (m === "insert") {
      const { pi, si, dist: d } = nearestSegment(ps, x, y);
      if (pi < 0 || d > HIT_RADIUS) { showToast("Click closer to a line segment."); return; }
      setPolys(prev => prev.map((p, i) => {
        if (i !== pi) return p;
        const pts = [...p.pts];
        pts.splice(si + 1, 0, { x, y });
        return { ...p, pts };
      }));
      setSelectedPi(pi);
      showToast("Point inserted!");
    }
  }, [showToast]);

  const handleDblClick = useCallback(() => {
    const { mode: m, currentPi: cp } = live.current;
    if (m !== "begin") return;
    setPolys(prev => {
      const updated = prev.map((p, i) =>
        i === cp && p.pts.length > 1 ? { ...p, pts: p.pts.slice(0, -1) } : p
      ).filter(p => p.pts.length >= 2);
      setSelectedPi(s => Math.min(s, updated.length - 1));
      return updated;
    });
    setCurrentPi(-1);
    setModeRaw("idle");
    setMoveState({ waiting: false, pi: -1, vi: -1 });
    showToast("Polyline completed.");
  }, [showToast]);

  const doQuit = useCallback(() => {
    if (!live.current.polys.length || window.confirm("Clear all polylines?")) {
      setPolys([]); setCurrentPi(-1); setSelectedPi(-1);
      setModeRaw("idle"); setMoveState({ waiting: false, pi: -1, vi: -1 });
      showToast("All cleared.");
    }
  }, [showToast]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      switch (e.key.toLowerCase()) {
        case "b": beginPoly(); break;
        case "m": setMode("move");   showToast("Move: click a vertex, then its destination."); break;
        case "d": setMode("delete"); showToast("Delete: click a vertex to remove it."); break;
        case "i": setMode("insert"); showToast("Insert: click near a segment to add a point."); break;
        case "r": drawCanvas(canvasRef.current, live.current); showToast("Refreshed."); break;
        case "q": doQuit(); break;
        case "escape": {
          const { mode: m, currentPi: cp, polys: ps } = live.current;
          if (m === "begin" && cp >= 0 && ps[cp]?.pts.length < 2)
            setPolys(prev => prev.filter((_, i) => i !== cp));
          setCurrentPi(-1);
          setModeRaw("idle");
          setMoveState({ waiting: false, pi: -1, vi: -1 });
          showToast("Stopped.");
          break;
        }
        default: break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beginPoly, setMode, showToast, doQuit]);

  const doSave = () => {
    const blob = new Blob([JSON.stringify({ polys, version: "1.0" }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "polylines.json";
    a.click();
    showToast("Saved as polylines.json");
  };

  const doLoad = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        setPolys(data.polys || []);
        setCurrentPi(-1);
        setSelectedPi(data.polys?.length ? 0 : -1);
        setModeRaw("idle");
        showToast(`Loaded ${data.polys?.length || 0} polyline(s).`);
      } catch { showToast("Invalid file."); }
    };
    reader.readAsText(f);
    e.target.value = "";
  };

  const deletePoly = (i) => {
    setPolys(prev => {
      const next = prev.filter((_, idx) => idx !== i);
      setSelectedPi(s => Math.min(s, next.length - 1));
      if (live.current.currentPi === i) setCurrentPi(-1);
      return next;
    });
    showToast("Polyline deleted.");
  };

  const totalVerts = polys.reduce((a, p) => a + p.pts.length, 0);
  const totalSegs  = polys.reduce((a, p) => a + Math.max(0, p.pts.length - 1), 0);

  const MODE_LABEL = { idle: "IDLE", begin: "DRAWING", move: "MOVE", delete: "DELETE", insert: "INSERT" };
  const MODE_COLOR = { idle: "#4a5580", begin: "#00e5ff", move: "#ffaa00", delete: "#ff4d6d", insert: "#b5ff3b" };
  const mc = MODE_COLOR[mode];

  const tools = [
    { label: "✏  Begin",  key: "B", m: "begin",  color: "#00e5ff", action: beginPoly },
    { label: "↔  Move",   key: "M", m: "move",   color: "#ffaa00", action: () => { setMode("move");   showToast("Click a vertex, then click its destination."); } },
    { label: "✕  Delete", key: "D", m: "delete", color: "#ff4d6d", action: () => { setMode("delete"); showToast("Click a vertex to delete it."); } },
    { label: "+  Insert", key: "I", m: "insert", color: "#b5ff3b", action: () => { setMode("insert"); showToast("Click near a segment to insert a point."); } },
  ];

  // Kill browser-level scrollbars globally
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = prev;
    };
  }, []);

  // ── shared style helpers ──────────────────────────────────
  const divider = <div style={{ height: 1, background: "#1a1f38", margin: "6px 0" }} />;

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 10, letterSpacing: "2.5px", textTransform: "uppercase",
      color: "#2e3660", fontWeight: 800, marginBottom: 10 }}>
      {children}
    </div>
  );

  return (
    <div style={{
      width: "100vw", height: "100vh",
      display: "flex", flexDirection: "column",
      background: "#060910", color: "#dde3f0",
      fontFamily: "'DM Mono','Fira Code','Courier New',monospace",
      overflow: "hidden",
      userSelect: "none",
    }}>

      {/* ══ HEADER ══ */}
      <header style={{
        flexShrink: 0,
        height: 50,
        display: "flex", alignItems: "center", gap: 14,
        padding: "0 22px",
        background: "#0a0d1a",
        borderBottom: "2px solid #1a1f38",
      }}>
        <div style={{
          fontWeight: 900, fontSize: 22, letterSpacing: "-0.5px",
          background: "linear-gradient(90deg,#00e5ff,#a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          PolyLine Editor
        </div>

        {/* mode badge */}
        <div style={{
          padding: "5px 18px", borderRadius: 8,
          fontSize: 12, letterSpacing: "2px", fontWeight: 800,
          background: mc + "18", color: mc, border: `1.5px solid ${mc}44`,
          minWidth: 90, textAlign: "center",
        }}>
          {MODE_LABEL[mode]}
        </div>

        <div style={{ flex: 1 }} />

        {/* mouse coords */}
        <div style={{ fontSize: 12, color: "#2e3660", fontWeight: 700 }}>
          <span style={{ color: "#00e5ff44" }}>XY </span>
          <span style={{ color: "#3a4a70" }}>{Math.round(mouse.x)}, {Math.round(mouse.y)}</span>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          background: "#0c0f1a", borderRight: "2px solid #1a1f38",
          width: 260,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",   /* never let sidebar itself scroll */
          minHeight: 0,
        }}>

          {/* ── TOOLS ── */}
          <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid #1a1f38", flexShrink: 0 }}>
            <SectionLabel>Tools</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tools.map(({ label, key, m, color, action }) => (
                <button key={m} onClick={action} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "9px 14px",
                  borderRadius: 9, fontSize: 14, fontWeight: 700, fontFamily: "inherit",
                  cursor: "pointer",
                  border: `1.5px solid ${mode === m ? color : "#1a1f38"}`,
                  background: mode === m ? color + "20" : "#070a14",
                  color: mode === m ? color : "#4a5580",
                  transition: "all 0.15s",
                }}>
                  <span>{label}</span>
                  <span style={{
                    background: "#ffffff08", border: "1px solid #1e2540",
                    borderRadius: 4, padding: "1px 7px",
                    fontSize: 10, color: mode === m ? color + "99" : "#2e3660", fontWeight: 900,
                  }}>{key}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── COLOR ── */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #1a1f38", flexShrink: 0 }}>
            <SectionLabel>Stroke Color</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {PALETTE.map(c => (
                <div key={c} onClick={() => setStrokeColor(c)} style={{
                  width: 26, height: 26, borderRadius: "50%", background: c,
                  cursor: "pointer",
                  border: `3px solid ${c === strokeColor ? "#fff" : "transparent"}`,
                  transform: c === strokeColor ? "scale(1.2)" : "scale(1)",
                  boxShadow: c === strokeColor ? `0 0 10px ${c}` : "none",
                  transition: "all 0.12s",
                }} />
              ))}
            </div>
            <div style={{
              padding: "6px 12px", borderRadius: 7,
              background: strokeColor + "18", border: `1.5px solid ${strokeColor}44`,
              fontSize: 12, color: strokeColor, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: strokeColor, flexShrink: 0 }} />
              {strokeColor.toUpperCase()}
            </div>
          </div>

          {/* ── WIDTH ── */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #1a1f38", flexShrink: 0 }}>
            <SectionLabel>Stroke Width</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <input type="range" min={1} max={12} value={strokeWidth}
                onChange={e => setStrokeWidth(Number(e.target.value))}
                style={{ flex: 1, accentColor: strokeColor, cursor: "pointer" }}
              />
              <div style={{
                minWidth: 36, textAlign: "center", padding: "3px 8px",
                borderRadius: 7, background: "#070a14", border: "1.5px solid #1a1f38",
                fontSize: 15, color: "#00e5ff", fontWeight: 900,
              }}>{strokeWidth}</div>
            </div>
            <div style={{ height: 18, display: "flex", alignItems: "center" }}>
              <div style={{
                width: "100%", height: Math.min(strokeWidth * 1.5 + 1, 16),
                borderRadius: 99, background: strokeColor,
                boxShadow: `0 0 6px ${strokeColor}88`,
              }} />
            </div>
          </div>

          {/* ── POLYLINE LIST header ── */}
          <div style={{ padding: "8px 14px 4px", borderBottom: "1px solid #1a1f38", flexShrink: 0 }}>
            <SectionLabel>Polylines — {polys.length} / {MAX_POLYS}</SectionLabel>
          </div>

          {/* ── POLYLINE LIST body — ONLY this scrolls ── */}
          <div style={{
            flex: 1, overflowY: "auto", minHeight: 0,
            padding: "6px 10px",
            scrollbarWidth: "thin", scrollbarColor: "#1e2540 transparent",
          }}>
            {!polys.length
              ? <div style={{ textAlign: "center", padding: "20px 10px", color: "#1e2540", fontSize: 12, lineHeight: 2 }}>
                  No polylines yet.<br />
                  <span style={{ color: "#2e3660" }}>Press <strong style={{ color: "#00e5ff88" }}>B</strong> to begin.</span>
                </div>
              : polys.map((poly, i) => (
                <div key={i} onClick={() => setSelectedPi(i)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 10px", borderRadius: 9, cursor: "pointer", marginBottom: 4,
                  border: `1.5px solid ${i === selectedPi ? poly.color + "55" : "#12152a"}`,
                  background: i === selectedPi ? poly.color + "0e" : "#070a14",
                  transition: "all 0.12s",
                }}>
                  <div style={{
                    width: 11, height: 11, borderRadius: "50%", background: poly.color, flexShrink: 0,
                    boxShadow: i === selectedPi ? `0 0 7px ${poly.color}` : "none",
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: i === selectedPi ? "#c5cce0" : "#4a5580" }}>
                      Poly #{i + 1}
                    </div>
                    <div style={{ fontSize: 10, color: "#2e3660", marginTop: 1 }}>
                      {poly.pts.length} pts · {Math.max(0, poly.pts.length - 1)} seg
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deletePoly(i); }}
                    onMouseEnter={e => e.currentTarget.style.color = "#ff4d6d"}
                    onMouseLeave={e => e.currentTarget.style.color = "#2e3660"}
                    style={{ background: "none", border: "none", color: "#2e3660", cursor: "pointer", fontSize: 14, padding: "1px 3px" }}
                  >✕</button>
                </div>
              ))
            }
          </div>

          {/* ── STATS ── */}
          <div style={{ padding: "8px 14px", borderTop: "1px solid #1a1f38", flexShrink: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 0" }}>
              {[["Polylines", polys.length], ["Vertices", totalVerts], ["Segments", totalSegs], ["Selected", selectedPi >= 0 ? `#${selectedPi + 1}` : "—"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, paddingRight: 10 }}>
                  <span style={{ color: "#2e3660" }}>{k}</span>
                  <span style={{ color: "#00e5ff", fontWeight: 800 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── FILE ACTIONS ── */}
          <div style={{ padding: "8px 14px", borderTop: "1px solid #1a1f38", display: "flex", gap: 6, flexShrink: 0 }}>
            {[
              { label: "↓ Save", color: "#a78bfa", action: doSave },
              { label: "↑ Load", color: "#a78bfa", action: doLoad },
              { label: "⏻ Clear", color: "#ff4d6d", action: doQuit },
            ].map(({ label, color, action }) => (
              <button key={label} onClick={action} style={{
                flex: 1, padding: "7px 2px",
                borderRadius: 8, fontSize: 11, fontWeight: 800,
                fontFamily: "inherit", cursor: "pointer",
                border: `1.5px solid ${color}33`,
                background: color + "12", color,
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── SHORTCUTS ── */}
          <div style={{ padding: "8px 14px 10px", borderTop: "1px solid #1a1f38", flexShrink: 0 }}>
            <SectionLabel>Shortcuts</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
              {[["B","Begin"],["M","Move"],["D","Del"],["I","Insert"],["Esc","Stop"],["R","Refresh"]].map(([k, v]) => (
                <span key={k} style={{ fontSize: 11, color: "#2e3660" }}>
                  <span style={{
                    background: "#0a0d1a", border: "1px solid #1e2540",
                    borderRadius: 4, padding: "1px 6px",
                    fontSize: 10, color: "#00e5ff88", fontWeight: 800, marginRight: 3,
                  }}>{k}</span>{v}
                </span>
              ))}
            </div>
          </div>

        </aside>

        {/* ── CANVAS ── */}
        <div ref={wrapRef} style={{
          flex: 1, position: "relative", overflow: "hidden", minWidth: 0,
          background: "#060910",
          backgroundImage: "radial-gradient(circle, #ffffff0c 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}>
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "crosshair", display: "block" }}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onDoubleClick={handleDblClick}
          />
          {moveState.waiting && (
            <div style={{
              position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)",
              background: "#ffaa0015", border: "1.5px solid #ffaa0055",
              borderRadius: 10, padding: "10px 28px",
              fontSize: 14, color: "#ffaa00", fontWeight: 700, pointerEvents: "none",
            }}>
              ▲ Click destination to drop vertex
            </div>
          )}
        </div>
      </div>

      {/* ══ TOAST ══ */}
      <div style={{
        position: "fixed", bottom: 28, left: "50%",
        transform: `translateX(-50%) translateY(${toast.show ? 0 : 14}px)`,
        background: "#0e1220", border: "1.5px solid #1e2540",
        borderRadius: 12, padding: "12px 28px",
        fontSize: 14, opacity: toast.show ? 1 : 0,
        pointerEvents: "none", transition: "all 0.22s",
        zIndex: 999, whiteSpace: "nowrap", color: "#c5cce0",
        boxShadow: "0 6px 32px #00000099",
      }}>
        {toast.msg}
      </div>

      <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }} onChange={onFileChange} />
    </div>
  );
}
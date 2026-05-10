# PolyLine Editor — HCI Lab Group Exercise 4

> Interaction Design Process applied to a polyline drawing application  
> Chapter 5 — Interaction Design Basics

---

## Group Members & Phases

| Member | Phase | File |
|--------|-------|------|
| Member A | Phase 1 — Requirements | `MEMBER_A_Requirements.md` |
| Member B | Phase 2 — Analysis | `MEMBER_B_Analysis.md` |
| Member C | Phase 3 — Design | `MEMBER_C_Design.md` |
| Member D | Phase 4 — Implementation | `MEMBER_D_Implementation.md` + `PolyLineEditor.jsx` |

---

## Design Process Applied (Figure 5.1)

```
  What is                Scenarios
  wanted    ──────────▶  Task analysis
                              │
  Interviews                  ▼
  Ethnography          ┌────────────┐   Guidelines
                       │  Analysis  │   Principles
  what is there        └────────────┘       │
  vs. what is wanted         ▲              ▼
                             │       ┌────────────┐   Precise
                      Dialog │       │   Design   │   specification
                    notations│       └────────────┘       │
                             │                            ▼
                      ┌───────────┐               ┌──────────────┐
  Evaluation          │ Prototype │◀──────────────│ Implement    │
  Heuristics          └───────────┘               │ and deploy   │
                                                   └──────────────┘
                                                   Architectures
                                                   Documentation
                                                   Help
```

---

## Application Features

### Core (Assignment Required)
- ✅ `b` — Begin a new polyline (click to add vertices, double-click or Esc to finish)
- ✅ `d` — Delete a vertex (click near vertex; neighbours reconnect automatically)
- ✅ `m` — Move a vertex (click source vertex, then click destination)
- ✅ `r` — Refresh / redraw the canvas
- ✅ `q` — Clear all polylines (with confirmation)
- ✅ Up to **100 polylines** stored in array data structure

### Extended Features
- ✅ `i` — Insert a new vertex onto an existing segment
- ✅ **Save** — Export all polylines to `polylines.json`
- ✅ **Load** — Import polylines from `polylines.json`
- ✅ **Stroke colour** — 8 colour palette per polyline
- ✅ **Stroke width** — 1–12px slider with live preview
- ✅ **Sidebar** — Polyline list, stats, shortcuts panel
- ✅ **No scrollbars** — Full single-screen layout
- ✅ **Mode badge** — Always-visible current mode indicator
- ✅ **Toast notifications** — Action feedback messages
- ✅ **Rubber-band line** — Preview segment while drawing

---

## Tech Stack

- **React 18** with Hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- **HTML5 Canvas 2D API** for rendering
- **Inline styles** (no CSS files / no external UI library)
- **Vite** for build tooling
- **JSON** for file save/load

---

## Running Locally

```bash
git clone https://github.com/<your-username>/polyline-editor
cd polyline-editor
npm install
npm run dev
# open http://localhost:5173
```

## Deployment

```bash
npm run build
npm run deploy   # deploys to GitHub Pages
```

**Live demo:** https://\<your-username\>.github.io/polyline-editor

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `B` | Begin new polyline |
| `M` | Move vertex mode |
| `D` | Delete vertex mode |
| `I` | Insert vertex mode |
| `R` | Refresh canvas |
| `Q` | Clear all |
| `Esc` | Cancel / return to IDLE |
| `DblClick` | Finish drawing a polyline |

---

## Challenges & Confusions

### Member A (Requirements)
- Clarifying the exact hit radius — the assignment says "near" a vertex but doesn't define "near". We chose 22px based on Fitts' Law (minimum comfortable click target ≈ 44px diameter).
- Understanding the difference between *deleting a vertex* (neighbours reconnect) vs. *deleting a polyline* (whole line disappears).

### Member B (Analysis)
- The double-click event fires AFTER a click event — one extra vertex gets added by the time `dblclick` is detected. Required explicit removal of the last vertex on double-click.
- React stale closures — event listeners registered in `useEffect` capture old state. Required the `live.current` ref pattern.

### Member C (Design)
- Fitting all sidebar sections (Tools, Colour, Width, List, Stats, Save/Load, Shortcuts) in one screen without scroll. Resolved by making only the polyline list `flex: 1` (scrollable) and all others `flexShrink: 0`.
- Choosing the right colour for each mode — needed colours that are clearly distinct, not just aesthetically pleasing.

### Member D (Implementation)
- `canvas.style.width = 100%` does NOT resize the drawing buffer — must explicitly set `canvas.width = wrap.clientWidth`.
- `minHeight: 0` on flex children is required to prevent overflow — this is a subtle CSS flexbox rule that is easy to miss.
- File input: must reset `e.target.value = ""` after load so the same file can be loaded again.

---

## Possible Extensions

- [ ] Undo / Redo stack
- [ ] Close a polyline (connect last point to first)
- [ ] Fill colour for closed polylines
- [ ] Export as SVG or PNG image
- [ ] 3D polyline editor (add Z coordinate)
- [ ] STN (State Transition Network) visualiser overlay
- [ ] Touch / stylus support for tablet use
- [ ] Snap to grid feature

---

## File Index

```
polyline-editor/
├── README.md                        ← this file (group overview)
├── MEMBER_A_Requirements.md         ← Phase 1: Requirements
├── MEMBER_B_Analysis.md             ← Phase 2: Analysis
├── MEMBER_C_Design.md               ← Phase 3: Design
├── MEMBER_D_Implementation.md       ← Phase 4: Implementation notes
└── src/
    └── PolyLineEditor.jsx           ← The actual application code
```
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* 🐶 Bork Catcher: drag to move the puppy, catch treats, dodge the bad stuff */

const W = 360;
const H = 560;
const SCALE = 2; // canvas resolution multiplier for sharp emoji
const PUPPY_Y = H - 92;

type Item = { x: number; y: number; vy: number; glyph: string; kind: "good" | "bad"; pts: number; spin: number };
type Pop = { x: number; y: number; text: string; life: number; color: string };

const GOOD = [
  { glyph: "🦴", pts: 1, weight: 6 },
  { glyph: "🥓", pts: 2, weight: 3 },
  { glyph: "🍗", pts: 3, weight: 2 },
];
const BAD = ["🧅", "🍫", "🧦"];

const BARKS = ["bork!", "yum!", "nom!", "woof!", "arf!", "good boy!"];

const OVER_LINES = [
  "The puppy is full and judging you.",
  "Not bad! The puppy is doing a happy zoomie.",
  "Impressive. The puppy would like to hire you.",
  "Legendary. The puppy has named you Chief Treat Officer.",
];

const css = `
@import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap");

.pg-root {
  --ink: #3b2a52;
  --sky1: #bfe9ff;
  --sky2: #fff3d6;
  --grass: #7ed67e;
  --pink: #ff6fa3;
  --butter: #ffd666;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 12px;
  background: var(--sky2);
  color: var(--ink);
  font-family: "Fredoka", "Comic Sans MS", system-ui, sans-serif;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.pg-wrap { width: min(420px, 100%); }

.pg-hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 10px;
  font-weight: 700;
  font-size: 20px;
}
.pg-hud small { display: block; font-size: 13px; font-weight: 500; opacity: 0.7; }
.pg-lives { font-size: 24px; letter-spacing: 2px; }

.pg-stage {
  position: relative;
  border: 4px solid var(--ink);
  border-radius: 28px;
  box-shadow: 8px 8px 0 var(--ink);
  overflow: hidden;
  background: var(--sky1);
}
.pg-canvas {
  display: block;
  width: 100%;
  height: auto;
  max-height: calc(100dvh - 120px);
  aspect-ratio: ${W} / ${H};
  touch-action: none;
}

.pg-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  background: rgba(255, 243, 214, 0.93);
}
.pg-big { font-size: 92px; line-height: 1; animation: pg-bob 2s ease-in-out infinite; }
.pg-title { margin: 0; font-size: 40px; line-height: 1.05; font-weight: 700; }
.pg-text { margin: 0; font-size: 17px; line-height: 1.4; max-width: 30ch; }
.pg-score { font-size: 56px; font-weight: 700; line-height: 1; color: var(--pink); }

.pg-btn {
  margin-top: 10px;
  font-family: inherit;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  background: var(--pink);
  border: 3px solid var(--ink);
  border-radius: 999px;
  padding: 12px 30px;
  box-shadow: 4px 4px 0 var(--ink);
  cursor: pointer;
  touch-action: manipulation;
}
.pg-btn:active { transform: translate(3px, 3px); box-shadow: 1px 1px 0 var(--ink); }
.pg-btn:focus-visible { outline: 4px solid var(--butter); outline-offset: 3px; }

.pg-tip { text-align: center; font-size: 14px; opacity: 0.7; margin: 14px 0 0; }

@keyframes pg-bob {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-8px) rotate(4deg); }
}
@media (prefers-reduced-motion: reduce) { .pg-big { animation: none; } }
`;

function pickGood() {
  const total = GOOD.reduce((s, g) => s + g.weight, 0);
  let r = Math.random() * total;
  for (const g of GOOD) {
    r -= g.weight;
    if (r <= 0) return g;
  }
  return GOOD[0];
}

export default function PuppyGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "playing" | "over">("menu");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);

  const game = useRef({
    x: W / 2,
    target: W / 2,
    items: [] as Item[],
    pops: [] as Pop[],
    spawn: 0,
    elapsed: 0,
    score: 0,
    lives: 3,
    combo: 0,
    bark: "",
    barkLife: 0,
    shake: 0,
    keys: { left: false, right: false },
  });

  const start = useCallback(() => {
    try {
      setBest(Number(localStorage.getItem("bork-best") || 0));
    } catch {}

    const g = game.current;
    g.x = g.target = W / 2;
    g.items = [];
    g.pops = [];
    g.spawn = 0;
    g.elapsed = 0;
    g.score = 0;
    g.lives = 3;
    g.combo = 0;
    g.bark = "";
    g.barkLife = 0;
    setScore(0);
    setLives(3);
    setPhase("playing");
  }, []);

  const endGame = useCallback(() => {
    const final = game.current.score;
    setPhase("over");
    setBest((b) => {
      const nb = Math.max(b, final);
      try {
        localStorage.setItem("bork-best", String(nb));
      } catch {}
      return nb;
    });
  }, []);

  /* input: drag / touch anywhere on the canvas, or arrow keys */
  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") game.current.keys.left = down;
      if (k === "arrowright" || k === "d") game.current.keys.right = down;
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, []);

  function movePointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    game.current.target = Math.min(W - 30, Math.max(30, ((e.clientX - rect.left) / rect.width) * W));
  }

  /* main loop */
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let last = performance.now();
    const g = game.current;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      g.elapsed += dt;

      // keyboard movement
      if (g.keys.left) g.target = Math.max(30, g.target - 360 * dt);
      if (g.keys.right) g.target = Math.min(W - 30, g.target + 360 * dt);
      g.x += (g.target - g.x) * Math.min(1, dt * 16);

      // spawn: faster and meaner as time passes
      const level = Math.min(g.elapsed / 45, 1);
      g.spawn -= dt;
      if (g.spawn <= 0) {
        g.spawn = 0.85 - level * 0.45 + Math.random() * 0.25;
        const bad = Math.random() < 0.22 + level * 0.18;
        const base = 130 + level * 130;
        if (bad) {
          g.items.push({
            x: 24 + Math.random() * (W - 48),
            y: -30,
            vy: base * (0.9 + Math.random() * 0.4),
            glyph: BAD[Math.floor(Math.random() * BAD.length)],
            kind: "bad",
            pts: 0,
            spin: (Math.random() - 0.5) * 3,
          });
        } else {
          const p = pickGood();
          g.items.push({
            x: 24 + Math.random() * (W - 48),
            y: -30,
            vy: base * (0.85 + Math.random() * 0.5),
            glyph: p.glyph,
            kind: "good",
            pts: p.pts,
            spin: (Math.random() - 0.5) * 2,
          });
        }
      }

      // update items
      for (const it of g.items) it.y += it.vy * dt;
      const keep: Item[] = [];
      let ended = false;
      for (const it of g.items) {
        const hit = it.y > PUPPY_Y - 28 && it.y < PUPPY_Y + 26 && Math.abs(it.x - g.x) < 38;
        if (hit) {
          if (it.kind === "good") {
            g.combo += 1;
            const mult = g.combo >= 10 ? 3 : g.combo >= 5 ? 2 : 1;
            const gain = it.pts * mult;
            g.score += gain;
            g.bark = BARKS[Math.floor(Math.random() * BARKS.length)];
            g.barkLife = 0.7;
            g.pops.push({ x: it.x, y: it.y - 20, text: mult > 1 ? `+${gain} x${mult}` : `+${gain}`, life: 0.8, color: "#d6336c" });
            setScore(g.score);
          } else {
            g.combo = 0;
            g.lives -= 1;
            g.shake = 0.3;
            g.bark = "ew!!";
            g.barkLife = 0.9;
            g.pops.push({ x: it.x, y: it.y - 20, text: "Bad for puppies!", life: 1.1, color: "#c92a2a" });
            setLives(g.lives);
            try {
              navigator.vibrate?.(80);
            } catch {}
            if (g.lives <= 0) ended = true;
          }
        } else if (it.y < H + 40) {
          keep.push(it);
        }
      }
      g.items = keep;
      g.pops = g.pops.filter((p) => (p.life -= dt) > 0);
      g.barkLife -= dt;
      g.shake = Math.max(0, g.shake - dt);

      draw(ctx, g);

      if (ended) {
        endGame();
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, endGame]);

  /* draw the idle scene behind the menu */
  useEffect(() => {
    if (phase === "playing") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx, game.current);
  }, [phase]);

  const over = OVER_LINES[score >= 80 ? 3 : score >= 40 ? 2 : score >= 15 ? 1 : 0];

  return (
    <main className="pg-root">
      <style>{css}</style>
      <div className="pg-wrap">
        <div className="pg-hud">
          <div>
            {score}
            <small>best {best}</small>
          </div>
          <div className="pg-lives" aria-label={`${lives} lives left`}>
            {"💖".repeat(Math.max(lives, 0))}
            {"🤍".repeat(Math.max(3 - lives, 0))}
          </div>
        </div>

        <div className="pg-stage">
          <canvas
            ref={canvasRef}
            className="pg-canvas"
            width={W * SCALE}
            height={H * SCALE}
            onPointerDown={movePointer}
            onPointerMove={movePointer}
          />

          {phase === "menu" && (
            <div className="pg-overlay">
              <div className="pg-big" aria-hidden>🐶</div>
              <h1 className="pg-title">Bork Catcher</h1>
              <p className="pg-text">
                Drag to move the puppy. Catch bones, bacon and chicken. Dodge onions, chocolate and that one sock.
              </p>
              <button className="pg-btn" onClick={start}>Play</button>
            </div>
          )}

          {phase === "over" && (
            <div className="pg-overlay">
              <div className="pg-big" aria-hidden>{score >= 40 ? "🤩" : "😴"}</div>
              <p className="pg-text">You caught</p>
              <div className="pg-score">{score}</div>
              <p className="pg-text">{over}</p>
              <p className="pg-text">{score > 0 && score >= best ? "New best! 🏆" : `Best: ${best}`}</p>
              <button className="pg-btn" onClick={start}>One more round</button>
            </div>
          )}
        </div>

        <p className="pg-tip">Keep a streak of 5 treats for double points. Ten for triple.</p>
      </div>
    </main>
  );
}

/* ---------- drawing ---------- */

type G = {
  x: number;
  items: Item[];
  pops: Pop[];
  elapsed: number;
  combo: number;
  bark: string;
  barkLife: number;
  shake: number;
};

function draw(ctx: CanvasRenderingContext2D, g: G) {
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.clearRect(0, 0, W, H);

  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#bfe9ff");
  sky.addColorStop(1, "#fff3d6");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // clouds drift slowly
  ctx.font = "56px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = 0.9;
  ctx.fillText("☁️", ((g.elapsed * 10) % (W + 120)) - 60, 70);
  ctx.fillText("☁️", W - (((g.elapsed * 6) % (W + 120)) - 60), 150);
  ctx.globalAlpha = 1;

  // grass
  ctx.fillStyle = "#7ed67e";
  ctx.fillRect(0, H - 48, W, 48);
  ctx.fillStyle = "#6bc46b";
  for (let x = 0; x < W; x += 30) ctx.fillRect(x + 6, H - 48, 14, 6);

  const shakeX = g.shake > 0 ? (Math.random() - 0.5) * 8 : 0;

  // falling stuff
  ctx.font = "34px serif";
  for (const it of g.items) {
    ctx.save();
    ctx.translate(it.x, it.y);
    ctx.rotate(it.spin * g.elapsed);
    ctx.fillText(it.glyph, 0, 0);
    ctx.restore();
  }

  // puppy shadow + puppy (bobs when running)
  const bob = Math.sin(g.elapsed * 14) * 2;
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(g.x + shakeX, PUPPY_Y + 36, 30, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "64px serif";
  ctx.fillText(g.shake > 0 ? "🐕" : "🐶", g.x + shakeX, PUPPY_Y + bob);

  // speech bubble
  if (g.barkLife > 0 && g.bark) {
    ctx.font = "700 16px Fredoka, sans-serif";
    const tw = ctx.measureText(g.bark).width + 20;
    const bx = Math.min(W - tw / 2 - 6, Math.max(tw / 2 + 6, g.x));
    const by = PUPPY_Y - 52;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#3b2a52";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(bx - tw / 2, by - 15, tw, 30, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#3b2a52";
    ctx.fillText(g.bark, bx, by + 1);
  }

  // floating score pops
  ctx.font = "700 18px Fredoka, sans-serif";
  for (const p of g.pops) {
    ctx.globalAlpha = Math.min(1, p.life * 2);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y - (1 - p.life) * 30);
  }
  ctx.globalAlpha = 1;

  // streak indicator
  if (g.combo >= 5) {
    ctx.font = "700 15px Fredoka, sans-serif";
    ctx.fillStyle = "#d6336c";
    ctx.textAlign = "left";
    ctx.fillText(`🔥 streak ${g.combo}`, 12, 24);
    ctx.textAlign = "center";
  }
}
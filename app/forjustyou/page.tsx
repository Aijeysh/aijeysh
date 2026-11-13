"use client";

import { useRef, useState } from "react";

/* ✏️ Edit these three lines and you're done */
const HER_NAME = "Beautiful";
const YOUR_NAME = "Prashuuuuuu";
const QUESTION = "Can You Agree to the Agreement I sent you?";

const MOODS = ["🥹", "🥺", "😢", "😭", "🫠", "💀", "🤡", "🧎"];

const CAPTIONS = [
  "Take your time. I'll wait. I've got nothing else going on.",
  "That button is clearly broken. Try the other one?",
  "I've already told my mom about you. No pressure though.",
  "My heart is a small, fragile bun. Please be gentle.",
  "The coffee is on me. The charm is also free.",
  "I practiced this in the mirror for 3 days.",
  "The No button is getting tired. So am I.",
  "Okay, I'm going to sit here quietly and cry in Nepali.",
];

const NO_LABELS = [
  "No",
  "Are you sure?",
  "Really sure??",
  "Think again 🥺",
  "Last chance!",
  "You're slow 😏",
  "Fine, I give up",
  "…",
];

type Heart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  glyph: string;
};

function createHearts(): Heart[] {
  const glyphs = ["💖", "💘", "💕", "✨", "☕", "🧋"];

  return Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 18 + Math.random() * 28,
    duration: 3 + Math.random() * 3,
    delay: Math.random() * 2.5,
    glyph: glyphs[i % glyphs.length],
  }));
}

const css = `
@import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap");

.cc-root {
  --cream: #fff1e6;
  --pink: #ff5d8f;
  --pink-deep: #d6336c;
  --butter: #ffd666;
  --cocoa: #4a2c2a;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 15% 20%, #ffd9e4 0 90px, transparent 91px),
    radial-gradient(circle at 85% 80%, #ffe9a8 0 120px, transparent 121px),
    var(--cream);
  color: var(--cocoa);
  font-family: "Fredoka", "Comic Sans MS", system-ui, sans-serif;
  overflow: hidden;
  position: relative;
}

.cc-card {
  width: min(460px, 100%);
  background: #fff;
  border: 4px solid var(--cocoa);
  border-radius: 36px;
  box-shadow: 10px 10px 0 var(--cocoa);
  padding: 32px 26px 36px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.cc-face {
  font-size: 104px;
  line-height: 1;
  display: inline-block;
  animation: cc-bob 2.4s ease-in-out infinite;
  user-select: none;
}

.cc-hi {
  margin: 8px 0 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--pink-deep);
}

.cc-q {
  margin: 6px 0 10px;
  font-size: clamp(30px, 8vw, 40px);
  line-height: 1.1;
  font-weight: 700;
}

.cc-cap {
  min-height: 3.2em;
  margin: 0 0 22px;
  font-size: 16px;
  line-height: 1.4;
  opacity: 0.85;
}

.cc-row {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: center;
  min-height: 90px;
}

.cc-btn {
  font-family: inherit;
  font-weight: 700;
  font-size: 20px;
  border: 3px solid var(--cocoa);
  border-radius: 999px;
  padding: 12px 26px;
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--cocoa);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.cc-btn { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.cc-btn:focus-visible { outline: 4px solid var(--butter); outline-offset: 3px; }
.cc-btn:active { transform: translate(3px, 3px); box-shadow: 1px 1px 0 var(--cocoa); }

.cc-yes { background: var(--pink); color: #fff; transform-origin: center; }
.cc-no { background: var(--butter); color: var(--cocoa); }
.cc-no.cc-fly { position: fixed; z-index: 5; transition: left 0.25s ease, top 0.25s ease; }

.cc-foot {
  margin-top: 22px;
  font-size: 13px;
  opacity: 0.6;
}

.cc-win-title { font-size: clamp(32px, 9vw, 44px); font-weight: 700; margin: 6px 0 8px; line-height: 1.1; }
.cc-win-text { font-size: 18px; margin: 0 0 8px; line-height: 1.4; }
.cc-stamp {
  display: inline-block;
  margin-top: 14px;
  padding: 8px 16px;
  border: 3px dashed var(--pink-deep);
  border-radius: 14px;
  color: var(--pink-deep);
  font-weight: 600;
  transform: rotate(-3deg);
}

.cc-heart {
  position: fixed;
  top: -40px;
  z-index: 1;
  pointer-events: none;
  animation-name: cc-fall;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes cc-bob {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}
@keyframes cc-fall {
  to { transform: translateY(110dvh) rotate(360deg); }
}

@media (max-width: 480px) {
  .cc-root { padding: 16px; }
  .cc-card { padding: 24px 18px 28px; box-shadow: 7px 7px 0 var(--cocoa); border-radius: 28px; }
  .cc-face { font-size: 84px; }
  .cc-btn { font-size: 18px; padding: 12px 20px; }
  .cc-row { gap: 14px; min-height: 100px; flex-wrap: wrap; }
}

@media (prefers-reduced-motion: reduce) {
  .cc-face { animation: none; }
  .cc-heart { display: none; }
  .cc-no.cc-fly { transition: none; }
}
`;

export default function CuteAskPage() {
  const [tries, setTries] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [said, setSaid] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const noRef = useRef<HTMLButtonElement>(null);

  const step = Math.min(tries, MOODS.length - 1);
  const yesScale = Math.min(1 + tries * 0.1, 1.6);

  function dodge() {
    const w = noRef.current?.offsetWidth ?? 150;
    const h = noRef.current?.offsetHeight ?? 56;
    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const x = Math.random() * Math.max(vw - w - 24, 0) + 12;
    const y = Math.random() * Math.max(vh - h - 24, 0) + 12;
    setPos({ x, y });
    setTries((t) => t + 1);
  }

  return (
    <main className="cc-root">
      <style>{css}</style>

      {hearts.map((h) => (
        <span
          key={h.id}
          className="cc-heart"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
          aria-hidden
        >
          {h.glyph}
        </span>
      ))}

      <section className="cc-card">
        {said ? (
          <>
            <div className="cc-face" aria-hidden>🥰</div>
            <h1 className="cc-win-title">She said yes!!</h1>
            <p className="cc-win-text">
              Okay {HER_NAME}, I am now officially the happiest person in
              Kathmandu.
            </p>
            <p className="cc-win-text">
              Screenshot this and send it to me before you change your mind 😤
            </p>
            <span className="cc-stamp">Signed, {YOUR_NAME} ☕</span>
          </>
        ) : (
          <>
            <div className="cc-face" aria-hidden>{MOODS[step]}</div>
            <p className="cc-hi">Hi {HER_NAME}, quick question…</p>
            <h1 className="cc-q">{QUESTION}</h1>
            <p className="cc-cap" aria-live="polite">{CAPTIONS[step]}</p>

            <div className="cc-row">
              <button
                className="cc-btn cc-yes"
                style={{ transform: `scale(${yesScale})` }}
                onClick={() => {
                  setHearts(createHearts());
                  setSaid(true);
                }}
              >
                Yes 💖
              </button>

              <button
                className={`cc-btn cc-no${pos ? " cc-fly" : ""}`}
                style={pos ? { left: pos.x, top: pos.y } : undefined}
                ref={noRef}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse" && tries >= 1) dodge();
                }}
                onPointerDown={(e) => {
                  if (e.pointerType !== "mouse") dodge();
                }}
                onClick={(e) => {
                  // mouse click or keyboard press (touch is handled above)
                  if (e.detail === 0 || (e.nativeEvent as PointerEvent).pointerType === "mouse") dodge();
                }}
              >
                {NO_LABELS[step]}
              </button>
            </div>

            <p className="cc-foot">
              Nobody has ever successfully pressed No. It&apos;s a known bug.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
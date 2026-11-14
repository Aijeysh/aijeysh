"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ✏️ Edit these before sending */
const HER_NAME = "Beautiful";
const YOUR_NAME = "Your Name";
const YOUR_WHATSAPP = "9779765244601"; // country code + number, no + or spaces (for the backup reply button)
const YOUR_EMAIL = "sharmaaijeysh@gmail.com"; // her answers are emailed here automatically

const TEAS = [
  { label: "Masala chai ☕", reply: "Strong taste. I respect that." },
  { label: "Milk tea 🥛", reply: "Classic. Safe. Delicious. Like me." },
  { label: "Green tea 🍵", reply: "Healthy! I'll pretend I like it too." },
  { label: "No tea, just snacks 🍪", reply: "Honestly the real reason I'm inviting you." },
];

const WHENS = [
  { label: "Today ☀️", reply: "Wow, eager! I like that." },
  { label: "Tomorrow 🌤️", reply: "Perfect. I'll sleep early and look cute." },
  { label: "Whenever you're free 🫶", reply: "I will cancel everything. Everything." },
  { label: "After I stop pretending to be busy 💼", reply: "Fair. We all do it." },
];

const BREW_LINES = [
  "Boiling the water…",
  "Asking the tea leaves for permission…",
  "Checking if she is secretly smiling…",
  "Almost done. Don't leave!",
];

const createRain = () =>
  Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 20 + Math.random() * 22,
    dur: 3 + Math.random() * 3,
    delay: Math.random() * 2.5,
    g: ["☕", "🍵", "🫖", "🍪", "💖", "✨"][i % 6],
  }));

const css = `
@import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap");

.tp-root {
  --ink: #3d2415;
  --milk: #fff6e8;
  --chai: #c98a4b;
  --matcha: #8fd694;
  --rose: #ff7aa2;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 16px;
  background:
    radial-gradient(circle at 12% 12%, #ffe0b8 0 80px, transparent 81px),
    radial-gradient(circle at 92% 90%, #cdf3cf 0 110px, transparent 111px),
    var(--milk);
  color: var(--ink);
  font-family: "Fredoka", "Comic Sans MS", system-ui, sans-serif;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.tp-card {
  position: relative;
  z-index: 2;
  width: min(440px, 100%);
  background: #fff;
  border: 4px solid var(--ink);
  border-radius: 30px;
  box-shadow: 9px 9px 0 var(--ink);
  padding: 26px 22px 30px;
  text-align: center;
}

.tp-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--matcha);
  border: 2px solid var(--ink);
  border-radius: 999px;
  padding: 4px 12px;
  transform: rotate(-2deg);
}

.tp-cup { position: relative; display: inline-block; font-size: 88px; line-height: 1; margin-top: 10px; animation: tp-wobble 3s ease-in-out infinite; }
.tp-steam { position: absolute; left: 50%; top: -8px; font-size: 22px; opacity: 0; animation: tp-steam 2.4s ease-in infinite; }
.tp-steam:nth-child(2) { margin-left: -22px; animation-delay: 0.8s; }
.tp-steam:nth-child(3) { margin-left: 14px; animation-delay: 1.6s; }

.tp-h { margin: 8px 0 6px; font-size: clamp(27px, 7.5vw, 34px); line-height: 1.12; font-weight: 700; }
.tp-p { margin: 0 0 16px; font-size: 17px; line-height: 1.4; opacity: 0.88; }

.tp-opts { display: grid; gap: 10px; margin: 8px 0 6px; }
.tp-opt, .tp-btn {
  font-family: inherit;
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  background: var(--milk);
  border: 3px solid var(--ink);
  border-radius: 18px;
  padding: 13px 14px;
  box-shadow: 3px 3px 0 var(--ink);
  cursor: pointer;
  touch-action: manipulation;
  transition: transform 0.12s ease, background 0.12s ease;
}
.tp-opt:active, .tp-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink); }
.tp-opt.on { background: var(--matcha); }
.tp-opt:focus-visible, .tp-btn:focus-visible { outline: 4px solid #ffd666; outline-offset: 3px; }

.tp-btn { background: var(--rose); color: #fff; border-radius: 999px; padding: 13px 30px; font-size: 20px; font-weight: 700; margin-top: 12px; display: inline-block; text-decoration: none; }
.tp-btn.alt { background: #fff; color: var(--ink); }

.tp-react { min-height: 1.5em; margin: 10px 0 0; font-weight: 600; color: #b3365f; }

.tp-meter { margin: 14px 0 4px; }
.tp-meter input { width: 100%; height: 36px; accent-color: var(--rose); touch-action: pan-y; }
.tp-pct { font-size: 52px; font-weight: 700; color: var(--rose); line-height: 1; }

.tp-bar { height: 18px; border: 3px solid var(--ink); border-radius: 999px; overflow: hidden; background: var(--milk); margin: 16px 0 10px; }
.tp-bar > i { display: block; height: 100%; background: repeating-linear-gradient(45deg, var(--chai) 0 12px, #e0a463 12px 24px); transition: width 0.4s linear; }

.tp-stamp {
  display: inline-block;
  margin: 8px 0 4px;
  padding: 6px 18px;
  font-size: 30px;
  font-weight: 700;
  color: #1f9d55;
  border: 4px solid #1f9d55;
  border-radius: 12px;
  transform: rotate(-6deg);
  animation: tp-stamp 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) both;
}

.tp-rain {
  position: fixed;
  top: -40px;
  z-index: 1;
  pointer-events: none;
  animation: tp-fall linear forwards;
}

.tp-dots { display: flex; gap: 6px; justify-content: center; margin-bottom: 8px; }
.tp-dots i { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--ink); background: #fff; }
.tp-dots i.on { background: var(--rose); }

@keyframes tp-wobble { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg) translateY(-4px); } }
@keyframes tp-steam { 0% { opacity: 0; transform: translateY(0) scale(0.8); } 30% { opacity: 0.9; } 100% { opacity: 0; transform: translateY(-34px) scale(1.3); } }
@keyframes tp-fall { to { transform: translateY(112dvh) rotate(300deg); } }
@keyframes tp-stamp { from { transform: rotate(-6deg) scale(3); opacity: 0; } to { transform: rotate(-6deg) scale(1); opacity: 1; } }

@media (max-width: 480px) {
  .tp-card { padding: 22px 16px 26px; box-shadow: 6px 6px 0 var(--ink); border-radius: 26px; }
  .tp-cup { font-size: 76px; }
  .tp-opt { font-size: 17px; }
}
@media (prefers-reduced-motion: reduce) {
  .tp-cup, .tp-steam, .tp-stamp { animation: none; }
  .tp-steam { opacity: 0.6; }
  .tp-rain { display: none; }
}
`;

function Cup({ glyph = "🫖" }: { glyph?: string }) {
  return (
    <div className="tp-cup" aria-hidden>
      <span className="tp-steam">💨</span>
      <span className="tp-steam">💨</span>
      <span className="tp-steam">💨</span>
      {glyph}
    </div>
  );
}

export default function TeaMeetPage() {
  // 0 intro, 1 tea, 2 when, 3 meter, 4 brewing, 5 result
  const [step, setStep] = useState(0);
  const [tea, setTea] = useState<number | null>(null);
  const [when, setWhen] = useState<number | null>(null);
  const [pct, setPct] = useState(0);
  const [meterNote, setMeterNote] = useState("Drag the slider. Be honest. Or don't.");
  const [brew, setBrew] = useState(0);
  const rain = useMemo(() => (step === 5 ? createRain() : []), [step]);
  const climb = useRef<ReturnType<typeof setInterval> | null>(null);
  const sent = useRef(false);

  useEffect(() => () => { if (climb.current) clearInterval(climb.current); }, []);

  // rigged meter: whatever she picks, it climbs back to 100
  function releaseMeter() {
    if (climb.current) clearInterval(climb.current);
    setMeterNote("Hmm, that number looks wrong. Fixing it for you…");
    climb.current = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          if (climb.current) clearInterval(climb.current);
          setMeterNote("Corrected to 100%. You're welcome. 😌");
          return 100;
        }
        return Math.min(100, p + 4);
      });
    }, 40);
  }

  // fake brewing screen (and quietly send her answers to you)
  useEffect(() => {
    if (step !== 4) return;
    if (!sent.current) {
      sent.current = true;
      fetch(`https://formsubmit.co/ajax/${YOUR_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `☕ ${HER_NAME} answered your tea meet form!`,
          _captcha: "false",
          Tea: tea !== null ? TEAS[tea].label : "no answer",
          When: when !== null ? WHENS[when].label : "no answer",
          Excitement: `${pct}%`,
        }),
      }).catch(() => {});
    }

    const id = setInterval(() => {
      setBrew((b) => {
        if (b >= 100) {
          clearInterval(id);
          setStep(5);
          return 100;
        }
        return b + 5;
      });
    }, 150);
    return () => clearInterval(id);
  }, [pct, step, tea, when]);

  const wa =
    `https://wa.me/${YOUR_WHATSAPP}?text=` +
    encodeURIComponent(
      `Official reply: I accept the tea meet ☕ Tea: ${tea !== null ? TEAS[tea].label : "surprise me"}. When: ${
        when !== null ? WHENS[when].label : "you decide"
      }. Excitement level: 100% (verified).`
    );

  const brewLine = BREW_LINES[Math.min(Math.floor(brew / 26), BREW_LINES.length - 1)];

  return (
    <main className="tp-root">
      <style>{css}</style>

      {rain.map((r) => (
        <span
          key={r.id}
          className="tp-rain"
          style={{ left: `${r.left}%`, fontSize: r.size, animationDuration: `${r.dur}s`, animationDelay: `${r.delay}s` }}
          aria-hidden
        >
          {r.g}
        </span>
      ))}

      <section className="tp-card">
        {step > 0 && step < 5 && (
          <div className="tp-dots" aria-hidden>
            {[1, 2, 3, 4].map((n) => (
              <i key={n} className={n <= step ? "on" : ""} />
            ))}
          </div>
        )}

        {step === 0 && (
          <>
            <span className="tp-tag">Official document</span>
            <Cup />
            <h1 className="tp-h">Dear {HER_NAME}, you have been invited to a tea meet</h1>
            <p className="tp-p">
              This form is very serious and legally meaningless. It takes 20 seconds. The tea is not included, but
              I&apos;ll pay.
            </p>
            <button className="tp-btn" onClick={() => setStep(1)}>
              Open the form 🫖
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="tp-h">Question 1: choose your fighter</h1>
            <p className="tp-p">Which tea are we having?</p>
            <div className="tp-opts">
              {TEAS.map((t, i) => (
                <button key={t.label} className={`tp-opt${tea === i ? " on" : ""}`} onClick={() => setTea(i)}>
                  {t.label}
                </button>
              ))}
            </div>
            <p className="tp-react" aria-live="polite">{tea !== null ? TEAS[tea].reply : ""}</p>
            {tea !== null && (
              <button className="tp-btn" onClick={() => setStep(2)}>
                Next →
              </button>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="tp-h">Question 2: the schedule</h1>
            <p className="tp-p">When should this historic event happen?</p>
            <div className="tp-opts">
              {WHENS.map((w, i) => (
                <button key={w.label} className={`tp-opt${when === i ? " on" : ""}`} onClick={() => setWhen(i)}>
                  {w.label}
                </button>
              ))}
            </div>
            <p className="tp-react" aria-live="polite">{when !== null ? WHENS[when].reply : ""}</p>
            {when !== null && (
              <button className="tp-btn" onClick={() => setStep(3)}>
                Next →
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="tp-h">Question 3: honesty test</h1>
            <p className="tp-p">How excited are you to meet me?</p>
            <div className="tp-meter">
              <div className="tp-pct">{pct}%</div>
              <input
                type="range"
                min={0}
                max={100}
                value={pct}
                aria-label="Excitement level"
                onChange={(e) => {
                  if (climb.current) clearInterval(climb.current);
                  setPct(Number(e.target.value));
                }}
                onPointerUp={releaseMeter}
                onKeyUp={releaseMeter}
              />
            </div>
            <p className="tp-react" aria-live="polite">{meterNote}</p>
            {pct >= 100 && (
              <button
                className="tp-btn"
                onClick={() => {
                  setBrew(0);
                  setStep(4);
                }}
              >
                Submit ✅
              </button>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <Cup glyph="🍵" />
            <h1 className="tp-h">Brewing your answer…</h1>
            <div className="tp-bar" role="progressbar" aria-valuenow={brew} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: `${brew}%` }} />
            </div>
            <p className="tp-p">{brewLine}</p>
          </>
        )}

        {step === 5 && (
          <>
            <div className="tp-stamp">APPROVED</div>
            <Cup glyph="☕" />
            <h1 className="tp-h">It&apos;s a date. I mean a tea meet. Totally casual.</h1>
            <p className="tp-p">
              Tea: <b>{tea !== null ? TEAS[tea].label : "surprise"}</b>
              <br />
              When: <b>{when !== null ? WHENS[when].label : "you decide"}</b>
              <br />
              Excitement: <b>100% (verified by science)</b>
            </p>
            <a className="tp-btn" href={wa} target="_blank" rel="noopener noreferrer">
              Send me the good news 💬
            </a>
            <p className="tp-p" style={{ marginTop: 14, fontSize: 14 }}>
              (Your answers were sent to me automatically. Yes, I&apos;m that organised. 😏)
            </p>
            <p className="tp-p" style={{ marginTop: 4, fontSize: 14 }}>
              Signed, {YOUR_NAME}, official tea sponsor 🫖
            </p>
          </>
        )}
      </section>
    </main>
  );
}
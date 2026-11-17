import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import { ScrollReveal } from "./components/scroll-reveal";
import { HeroCursorGlow, MagneticWrap } from "./components/motion";

const strengths = [
  {
    number: "01",
    title: "Training & Mentoring",
    description:
      "Help people build real confidence, develop skills that actually stick, and understand what a good next step looks like for them.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Quality Assurance",
    description:
      "Make standards clear and feedback practical, so quality feels like part of the work, not a surprise audit at the end.",
    icon: "◈",
  },
  {
    number: "03",
    title: "Team Supervision",
    description:
      "Bring structure to the day-to-day, support people through the hard bits, and keep the shared goal in view.",
    icon: "◉",
  },
];

const notes = [
  {
    category: "COACHING",
    title: "Feedback should leave you with a next step",
    date: "A NOTE ON MENTORING",
  },
  {
    category: "TEAM HABITS",
    title: "A checklist is a kindness (and other small truths)",
    date: "A NOTE ON THE WORK",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO*/}
        <section className="hero-band" aria-labelledby="hero-title">
          <span className="hero-mesh" aria-hidden="true" />
          <span className="hero-mesh-2" aria-hidden="true" />
          <HeroCursorGlow />

          <div className="hero page-wrap">
            <div className="hero-copy">
              <p className="hero-label eyebrow">
                <span className="status-dot" />
                {`SUPERVISOR · (TRAINING & QA) · LANGUAGE LAB`}
              </p>

              <div className="hero-eyebrow-rule" aria-hidden="true" />

              <h1 id="hero-title">
                Good work
                <br />
                starts with
                <br />
                <span className="accent-word">people.</span>
              </h1>

              <p className="hero-intro">
                I&apos;m <strong>Aijeysh Sharma</strong>, Supervisor (Training &amp; QA) at{" "}
                <strong>Language Lab by Ambition Guru</strong>, and an
                English Mentor. I care about clear expectations, useful
                feedback, and helping people feel genuinely ready.
              </p>

              <div className="hero-actions">
                <MagneticWrap>
                  <a className="button button--primary" href="#experience">
                    MY WORK <span aria-hidden="true">↓</span>
                  </a>
                </MagneticWrap>
                <Link className="quiet-link" href="/blog">
                  NOTES &amp; IDEAS <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            <div className="portrait-stage">
              {/* <Image
                className="portrait-cutout"
                src="/AijeyshSharma.png"
                alt="Aijeysh Sharma"
                width={600}
                height={397}
                priority
                sizes="(max-width: 760px) 84vw, 38vw"
              /> */}
              <span className="portrait-halo" aria-hidden="true" />
              <span
                className="portrait-spark portrait-spark--one"
                aria-hidden="true"
              />
              <span
                className="portrait-spark portrait-spark--two"
                aria-hidden="true"
              />
              <span
                className="portrait-spark portrait-spark--three"
                aria-hidden="true"
              />
            </div>

            <div className="hero-footnote">
              <span>TEAM DEVELOPMENT</span>
              <span>TRAINING</span>
              <span>QUALITY</span>
              <span className="hero-footnote-highlight">
                SERIOUS ABOUT THE WORK. REASONABLE ABOUT THE TEA.
              </span>
            </div>
          </div>
        </section>

        {/*APPROACH*/}
        <section
          className="approach-section page-wrap"
          id="approach"
          aria-labelledby="approach-title"
        >
          <ScrollReveal className="section-heading">
            <div>
              <p className="eyebrow">HOW I LIKE TO WORK</p>
              <h2 id="approach-title">
                People and process,
                <br />
                <span className="accent-word">on the same side.</span>
              </h2>
            </div>
            <p className="section-aside">
              Clear standards. Useful coaching. Enough structure to help, and
              enough trust to let people do their jobs well.
            </p>
          </ScrollReveal>

          <div className="strength-grid">
            {strengths.map((s, i) => (
              <ScrollReveal
                key={s.number}
                delay={(i + 1) as 1 | 2 | 3}
                variant="scale"
              >
                <article className="strength-card">
                  <span className="strength-number">{s.number}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <span className="strength-rule" aria-hidden="true" />
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section
          className="experience-section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="page-wrap experience-inner">
            <ScrollReveal className="experience-heading">
              <p className="eyebrow" style={{ color: "rgba(255,255,255,0.4)" }}>
                A SHORT VERSION OF THE STORY
              </p>
              <h2 id="experience-title">
                Experience,
                <br />
                <span className="accent-word">with people at the centre.</span>
              </h2>
              <p>
                Different titles, a familiar thread: helping people understand
                the work, build confidence, and keep improving.
              </p>
              <a
                className="company-badge"
                href="https://ambition.guru"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="company-badge-dot" />
                LANGUAGE LAB BY AMBITION GURU
              </a>
            </ScrollReveal>

            <div className="role-list">
              <ScrollReveal delay={1}>
                <article className="role-row">
                  <span className="role-marker" aria-hidden="true" />
                  <div className="role-date">CURRENT ROLE</div>
                  <div className="role-detail">
                    <h3>
                      English Mentor &amp; Supervisor
                      <br />
                      <small style={{ fontWeight: 400, fontSize: "0.78em", opacity: 0.65 }}>
                        Training &amp; QA
                      </small>
                    </h3>
                    <p>
                      Oversee session quality and mentor performance across the
                      Language Lab. Run training programmes, provide structured
                      feedback, and develop QA frameworks that help the whole
                      team do better work, consistently.
                    </p>
                    <span className="role-tag role-tag--current">ACTIVE</span>
                  </div>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={2}>
                <article className="role-row">
                  <span
                    className="role-marker role-marker--past"
                    aria-hidden="true"
                  />
                  <div className="role-date">PREVIOUS ROLE</div>
                  <div className="role-detail">
                    <h3>Language Assistant</h3>
                    <p>
                      Supported learners as they found their voice, strengthened
                      their English, and got more comfortable using the language
                      in real conversations.
                    </p>
                    <span className="role-tag role-tag--past">PAST</span>
                  </div>
                </article>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* JOURNAL PREVIEW */}
        <section
          className="journal-preview page-wrap"
          aria-labelledby="journal-title"
        >
          <ScrollReveal className="journal-heading">
            <div>
              <p className="eyebrow">A FEW THOUGHTS FROM THE WORK</p>
              <h2 id="journal-title">
                Notes on people
                <br />
                <span className="accent-word">&amp; process.</span>
              </h2>
            </div>
            <div className="journal-aside">
              <p>
                Mentoring, training, quality, and the small habits that make
                working together easier.
              </p>
              <p className="aside-humour">
                No ten-step morning routine. Probably a checklist, though.
              </p>
              <Link className="quiet-link" href="/blog">
                VISIT THE JOURNAL <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </ScrollReveal>

          <div className="note-list">
            {notes.map((note, i) => (
              <ScrollReveal key={note.title} delay={(i + 1) as 1 | 2}>
                <Link className="note-row" href="/blog">
                  <span className="note-category">{note.category}</span>
                  <span className="note-title">{note.title}</span>
                  <span className="note-date">{note.date}</span>
                  <span className="note-arrow" aria-hidden="true">↗</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CONTACT TEASER */}
        <section
          className="contact-teaser"
          id="contact"
          aria-labelledby="contact-title"
        >
          <ScrollReveal className="contact-teaser-inner page-wrap">
            <div>
              <p className="eyebrow">GOOD WORK STARTS WITH A GOOD CONVERSATION</p>
              <h2 id="contact-title">
                Have a team to support?
                <br />
                <span className="accent-word">Let&apos;s talk.</span>
              </h2>
            </div>
            <MagneticWrap>
              <Link className="button button--primary" href="/contact">
                GET IN TOUCH <span aria-hidden="true">↗</span>
              </Link>
            </MagneticWrap>
          </ScrollReveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

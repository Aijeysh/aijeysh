import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { ScrollReveal } from "../components/scroll-reveal";

const posts = [
  {
    number: "01",
    category: "COACHING",
    title: "Feedback should leave you with a next step",
    excerpt:
      "Good feedback is clear, specific, and useful on Monday morning—not just accurate in a spreadsheet.",
    label: "PEOPLE & DEVELOPMENT",
    readTime: "4 MIN",
  },
  {
    number: "02",
    category: "TEAM HABITS",
    title: "A checklist is a kindness (and other small truths)",
    excerpt:
      "A few thoughts on making good work easier to repeat, especially on the busy days when shortcuts are tempting.",
    label: "WORKING WELL",
    readTime: "5 MIN",
  },
  {
    number: "03",
    category: "QUALITY",
    title: "Quality is a habit, not a gotcha",
    excerpt:
      "The best standards are understood before the review, and supported after it. Everything else is just auditing.",
    label: "TRAINING & QA",
    readTime: "6 MIN",
  },
  {
    number: "04",
    category: "MENTORING",
    title: "Ask a better question; make more room for an answer",
    excerpt:
      "A note from my time as an English mentor on patience, practice, and letting people find their own words.",
    label: "LANGUAGE & LEARNING",
    readTime: "5 MIN",
  },
];

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="blog-page">

        {/* ── BLOG HERO ──────────────────────────────────────────── */}
        <section className="blog-hero page-wrap">
          <p className="eyebrow">
            <span className="status-dot" style={{ marginRight: "9px", display: "inline-block" }} />
            NOTES ON PEOPLE, TRAINING &amp; QUALITY
          </p>
          <div className="blog-title-row">
            <h1>
              Notes on
              <br />
              <span className="accent-word">the work.</span>
            </h1>
            <div className="blog-intro">
              <p>
                Thoughts on mentoring, training, quality, and working well
                together. Practical when possible; pleasantly human either way.
              </p>
              <p className="aside-humour">
                No leadership clichés were harmed in the writing of this page.
              </p>
            </div>
          </div>
          <div className="blog-meta">
            <span>BY AIJEYSH SHARMA</span>
            <span>SUPERVISOR · TRAINING &amp; QA</span>
            <span>LANGUAGE LAB · AMBITION GURU</span>
            <span>OCCASIONAL NOTES</span>
          </div>
        </section>

        {/* ── FEATURED POST ─────────────────────────────────────── */}
        <section
          className="featured-post page-wrap"
          aria-label="Featured note"
        >
          <ScrollReveal variant="scale">
            <div className="featured-art" aria-hidden="true">
              <span className="featured-art-kicker">A PRACTICAL THOUGHT</span>
              <p className="featured-art-quote">
                Clear is
                <br />
                <span>kind.</span>
              </p>
              <span className="featured-art-footer">
                PEOPLE FIRST · ALWAYS
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <div className="featured-copy">
              <p className="eyebrow">A NOTE ON COACHING</p>
              <h2>
                Feedback should leave you with a{" "}
                <span className="accent-word">next step.</span>
              </h2>
              <p>
                The point isn&apos;t to point out what went wrong. It&apos;s to
                make the next attempt easier to get right. Good feedback is
                directional—it closes the gap between where someone is and where
                they&apos;re trying to get to.
              </p>
              <a className="quiet-link" href="#all-notes">
                BROWSE MORE NOTES <span aria-hidden="true">↓</span>
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* ── ALL NOTES ─────────────────────────────────────────── */}
        <section
          className="all-notes page-wrap"
          id="all-notes"
          aria-labelledby="all-notes-title"
        >
          <ScrollReveal className="notes-heading">
            <div>
              <p className="eyebrow">THE NOTEBOOK</p>
              <h2 id="all-notes-title">
                On the job,
                <br />
                <span className="accent-word">and around it.</span>
              </h2>
            </div>
            <p className="notes-aside">
              A growing collection. Best enjoyed with a clear head and a
              reasonably short meeting ahead.
            </p>
          </ScrollReveal>

          <div className="blog-post-list">
            {posts.map((post, i) => (
              <ScrollReveal key={post.number} delay={(Math.min(i + 1, 5)) as 1 | 2 | 3 | 4 | 5}>
                <article className="blog-post">
                  <span className="blog-post-number">{post.number}</span>
                  <div className="blog-post-copy">
                    <p className="eyebrow">
                      {post.category}{" "}
                      <span className="post-dot">·</span>{" "}
                      {post.label}{" "}
                      <span className="post-dot">·</span>{" "}
                      {post.readTime}
                    </p>
                    <h3>{post.title}</h3>
                    <p className="post-excerpt">{post.excerpt}</p>
                  </div>
                  <span className="post-arrow" aria-hidden="true">↗</span>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── SIGNOFF ───────────────────────────────────────────── */}
        <section className="blog-signoff">
          <div className="page-wrap blog-signoff-inner">
            <div>
              <p className="eyebrow">THANKS FOR READING</p>
              <p>
                Keep it clear.
                <br />
                <span className="accent-word">Keep it kind.</span>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "flex-end",
              }}
            >
              <Link className="quiet-link" href="/">
                BACK TO THE PROFILE <span aria-hidden="true">↗</span>
              </Link>
              <Link className="quiet-link" href="/contact">
                GET IN TOUCH <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

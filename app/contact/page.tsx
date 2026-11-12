"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { ScrollReveal } from "../components/scroll-reveal";

const infoItems = [
  {
    icon: "✉",
    label: "EMAIL",
    value: "sharmaaijeysh@gmail.com",
    href: "mailto:sharmaaijeysh@gmail.com",
  },
  {
    icon: "in",
    label: "LINKEDIN",
    value: "linkedin.com/in/sharmaaijeysh",
    href: "https://www.linkedin.com/in/sharmaaijeysh/",
  },
  {
    icon: "◉",
    label: "BASED IN",
    value: "Nepal",
    href: null,
  },
  {
    icon: "✦",
    label: "CURRENTLY AT",
    value: "Language Lab · Ambition Guru",
    href: "https://www.ambitionguru.com",
  },
];

type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "TRAINING & QA",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");

    // Placeholder — Resend integration will go here
    await new Promise((r) => setTimeout(r, 1200));
    setFormState("sent");
  };

  return (
    <>
      <SiteHeader />
      <main className="contact-page">

        {/* ── CONTACT HERO ────────────────────────────────────────── */}
        <section className="contact-hero">
          <div className="page-wrap contact-hero-inner">
            <div>
              <p className="eyebrow" style={{ color: "rgba(255,255,255,0.4)" }}>
                START A CONVERSATION
              </p>
              <h1>
                Let&apos;s talk
                <br />
                <span className="accent-word">good work.</span>
              </h1>
              <p className="contact-hero-desc">
                Whether you&apos;re thinking about team training, QA processes,
                or just want to exchange ideas about mentoring; I&apos;d be glad
                to hear from you.
              </p>
            </div>

            <div className="contact-info-items">
              {infoItems.map((item) => (
                <div className="contact-info-item" key={item.label}>
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <div className="contact-info-label">{item.label}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        <div className="contact-info-value">{item.value}</div>
                      </a>
                    ) : (
                      <div className="contact-info-value">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT FORM ────────────────────────────────────────── */}
        <section className="contact-form-section">
          <div className="page-wrap contact-form-inner">

            <ScrollReveal>
              <div className="contact-form-heading">
                <p className="eyebrow">SEND A MESSAGE</p>
                <h2>
                  What&apos;s on
                  <br />
                  <span className="accent-word">your mind?</span>
                </h2>
                <p>
                  Fill out the form and I&apos;ll get back to you. If
                  it&apos;s urgent, drop me an email directly at{" "}
                  <a
                    href="mailto:sharmaaijeysh@gmail.com"
                    style={{ color: "var(--sage)", textDecoration: "underline" }}
                  >
                    sharmaaijeysh@gmail.com
                  </a>
                  .
                </p>
              </div>

              {formState === "sent" ? (
                <div className="form-toast" role="status">
                  <span className="form-toast-icon">✓</span>
                  <div>
                    <strong>Message received!</strong>
                    <br />
                    <span style={{ opacity: 0.75, fontSize: "12px" }}>
                      I&apos;ll be in touch soon. Thanks for reaching out.
                    </span>
                  </div>
                </div>
              ) : (
                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="form-input"
                        placeholder="Jane Smith"
                        required
                        value={fields.name}
                        onChange={handleChange}
                        disabled={formState === "sending"}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input"
                        placeholder="jane@example.com"
                        required
                        value={fields.email}
                        onChange={handleChange}
                        disabled={formState === "sending"}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">
                      What&apos;s this about?
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="form-select"
                      value={fields.subject}
                      onChange={handleChange}
                      disabled={formState === "sending"}
                    >
                      <option value="TRAINING & QA">Training &amp; QA</option>
                      <option value="TEAM SUPERVISION">Team Supervision</option>
                      <option value="MENTORING">Mentoring</option>
                      <option value="COLLABORATION">Collaboration</option>
                      <option value="OTHER">Something else</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      placeholder="Tell me what you have in mind..."
                      required
                      value={fields.message}
                      onChange={handleChange}
                      disabled={formState === "sending"}
                    />
                  </div>

                  <div className="form-submit">
                    <button
                      type="submit"
                      className="button button--primary"
                      disabled={formState === "sending"}
                      style={{ opacity: formState === "sending" ? 0.7 : 1 }}
                    >
                      {formState === "sending" ? (
                        <>SENDING…</>
                      ) : (
                        <>
                          SEND MESSAGE <span aria-hidden="true">↗</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </ScrollReveal>

            {/* ── SIDEBAR ─────────────────────────────────────────── */}
            <ScrollReveal delay={2} className="contact-sidebar">
              <div className="contact-sidebar-block">
                <p className="eyebrow">MY CURRENT ROLE</p>
                <h3>Supervisor · Training &amp; QA</h3>
                <p>
                  At Language Lab by Ambition Guru, an EdTech platform focused
                  on English-language mentoring. I oversee session quality,
                  train mentors, and design QA processes that actually help
                  rather than just measure.
                </p>
              </div>

              <div className="contact-sidebar-block">
                <p className="eyebrow">WHAT I&apos;M OPEN TO</p>
                <h3>Conversations about building better things</h3>
                <p>
                  I&apos;m always open to conversations around new ventures, solving meaningful problems, building and developing teams, streamlining operations, and turning ideas into actionable projects.

                  Whether it&apos;s exploring a business idea, improving how a team works, designing better processes, or figuring out how to take something from zero to one; I&apos;m interested in exchanging ideas, collaborating, and making things happen.
                </p>
              </div>

              <div className="contact-sidebar-block">
                <p className="eyebrow">RESPONSE TIME</p>
                <h3>Usually within 48 hours</h3>
                <p>
                  I read every message. If I don&apos;t get back to you
                  promptly, feel free to follow up; I&apos;m not ignoring you,
                  just probably in a session.
                </p>
              </div>

              <div
                style={{
                  paddingTop: "20px",
                  display: "flex",
                  gap: "14px",
                  flexDirection: "column" as const,
                }}
              >
                <Link className="quiet-link" href="/">
                  BACK TO HOME <span aria-hidden="true">↗</span>
                </Link>
                <Link className="quiet-link" href="/blog">
                  READ MY NOTES <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

// src/app/contact/page.tsx
import { Metadata } from "next";
import ContactForm from "./ContactForm";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Contact Aijeysh | SEO Expert in Kathmandu, Nepal",
  description:
    "Get in touch with Aijeysh Sharma — Nepal’s top SEO expert based in Kathmandu. Let’s grow your online visibility with powerful SEO and digital marketing strategies.",
  keywords: [
    "Aijeysh",
    "Aijeysh Sharma",
    "SEO Expert Nepal",
    "SEO Expert Kathmandu",
    "SEO Consultant Nepal",
    "Best SEO Expert",
    "SEO Services Nepal",
    "Digital Marketing Expert",
    "SEO Strategist",
  ],
  metadataBase: new URL("https://www.jagbijaya.com.np"),
  openGraph: {
    title: "Contact Aijeysh | SEO Expert in Kathmandu, Nepal",
    description:
      "Work with Aijeysh Sharma — Kathmandu-based SEO and Digital Marketing Expert helping brands grow with proven strategies.",
    url: "https://www.jagbijaya.com.np/contact",
    siteName: "Aijeysh Sharma",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Aijeysh | SEO Expert in Nepal",
    description:
      "Contact Aijeysh Sharma — SEO Expert & Digital Marketing Strategist in Nepal to boost your brand visibility online.",
    images: ["/og-image.png"],
    creator: "@aijeysh",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0b0f] via-[#13131a] to-[#0b0b0f] text-slate-100 py-24 relative overflow-hidden">
      {/* ✅ JSON-LD SEO Schema */}
      <Script
        id="seo-expert-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Aijeysh Sharma",
            jobTitle: "SEO Expert",
            url: "https://www.jagbijaya.com.np",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Kathmandu",
              addressCountry: "Nepal",
            },
            description:
              "Kathmandu-based SEO Expert helping Nepali and international brands grow online.",
          }),
        }}
      />

      <section className="max-w-6xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-fuchsia-400 text-transparent bg-clip-text">
            Let’s Grow Your Online Presence
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Hi, I’m <strong className="text-white">Aijeysh Sharma</strong> — a Kathmandu-based{" "}
            <strong>SEO Expert</strong> & <strong>Digital Marketing Strategist</strong> helping
            businesses rank higher and build visibility through smart, ethical SEO.
          </p>
        </div>

        {/* GRID - FORM + INFO */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* ✅ FORM visible first */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl bg-slate-900/40 p-8 shadow-xl backdrop-blur-sm border border-slate-800">
              <h2 className="text-2xl font-semibold mb-6 text-white">
                Get in Touch
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Why Work With Me?
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li>✅ Proven SEO & content strategies that actually rank</li>
                <li>✅ Data-driven approach using AI & modern SEO tools</li>
                <li>✅ Transparent reporting & long-term value creation</li>
                <li>✅ Customized SEO for Kathmandu & global audiences</li>
              </ul>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-2xl font-semibold text-white mb-2">
                Contact Information
              </h3>
              <div className="space-y-3">
                <p>
                  <span className="text-indigo-400 font-medium">📍</span>{" "}
                  Kathmandu, Nepal
                </p>
                <p>
                  <span className="text-indigo-400 font-medium">📞</span>{" "}
                  <a
                    href="tel:+9779765244601"
                    className="hover:text-indigo-300 transition-colors"
                  >
                    +977 9765244601
                  </a>
                </p>
                <p>
                  <span className="text-indigo-400 font-medium">✉️</span>{" "}
                  <a
                    href="mailto:sharmaaijeysh@gmail.com"
                    className="hover:text-indigo-300 transition-colors"
                  >
                    sharmaaijeysh@gmail.com
                  </a>
                </p>
                <p className="text-slate-400 text-sm">
                  Available for meetings in Kathmandu or virtual consultations
                  worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COLLAPSIBLE SEO SECTION */}
        <details className="mt-16 group border-t border-slate-800 pt-6 cursor-pointer">
          <summary className="text-indigo-400 text-lg font-medium select-none group-open:text-fuchsia-400 transition-colors">
            Read More About My SEO Services
          </summary>
          <div className="mt-4 text-slate-400 space-y-4 leading-relaxed">
            <p>
              I specialize in <strong>on-page optimization</strong>,{" "}
              <strong>technical SEO audits</strong>,{" "}
              <strong>keyword research</strong>, and{" "}
              <strong>content strategy</strong> — focusing on long-term,
              sustainable growth.
            </p>
            <p>
              Whether you’re targeting audiences in{" "}
              <strong>Kathmandu</strong>, <strong>Nepal</strong>, or global
              markets, I develop strategies that adapt to your brand’s goals and
              ensure higher visibility across search engines.
            </p>
            <p>
              Looking for the <strong>best SEO expert in Nepal</strong>? Let’s
              discuss how to take your digital presence to the next level.
            </p>
          </div>
        </details>
      </section>

      {/* Subtle Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </main>
  );
}

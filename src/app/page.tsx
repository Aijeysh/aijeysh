// src/app/page.tsx
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aijeysh Sharma — SEO Expert & Digital Marketing in Kathmandu",
  description:
    "Aijeysh Sharma (Sharma Aijeysh) — SEO Expert in Kathmandu, Nepal. SEO audits, content strategy, local SEO, and AI-driven growth for businesses and creators.",
  keywords: [
    "Aijeysh",
    "Aijeysh Sharma",
    "Sharma Aijeysh",
    "SEO Expert in Nepal",
    "SEO Expert Kathmandu",
    "Digital Marketing Expert",
    "SEO Consultant",
    "Local SEO Kathmandu",
  ],
  metadataBase: new URL("https://jagbijaya.com.np"),
  openGraph: {
    title: "Aijeysh Sharma — SEO Expert in Kathmandu",
    description:
      "SEO and Digital Marketing services by Aijeysh Sharma — on-page SEO, technical audits, content strategy and local SEO in Kathmandu, Nepal.",
    url: "https://jagbijaya.com.np/",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    siteName: "Aijeysh Sharma",
    type: "website",
  },
};

// ---------- Server-side helper (placeholder) ----------
async function getLatestPosts() {
  // Replace with real fetch from CMS or filesystem. Kept server-side friendly.
  return [
    {
      id: "post-1",
      title: "How I grew organic traffic 3x for a Kathmandu startup",
      slug: "/blog/grow-traffic-kathmandu-startup",
      excerpt:
        "A practical case study showing the exact technical fixes and content plays we used to triple organic traffic in 6 months.",
      date: "2025-07-02",
    },
    {
      id: "post-2",
      title: "Local SEO for Nepal: A practical checklist",
      slug: "/blog/local-seo-nepal-checklist",
      excerpt: "Step-by-step checklist to improve local visibility for Nepali businesses.",
      date: "2025-05-10",
    },
  ];
}

// ---------- Small presentational components ----------
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-700/30 text-indigo-200 text-sm">
      {children}
    </span>
  );
}

function ServiceCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-300 text-xl">{icon}</div>
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-slate-300 mt-2 text-sm">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <blockquote className="p-6 rounded-xl bg-slate-900/30 border border-slate-800">
      <p className="text-slate-200 italic">{quote}</p>
      <footer className="mt-4 text-slate-400 text-sm">— {author}</footer>
    </blockquote>
  );
}

export default async function HomePage() {
  const posts = await getLatestPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050508] via-[#0f1220] to-[#050508] text-slate-100 antialiased">
      {/* JSON-LD Person + Organization (server-rendered for SEO) */}
      <Script
        id="home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Aijeysh Sharma",
            url: "https://jagbijaya.com.np",
            jobTitle: "SEO Expert",
            sameAs: [
              "https://www.linkedin.com/in/aijeyshsharma",
              "https://twitter.com/aijeysh",
            ],
            description:
              "Aijeysh Sharma (Sharma Aijeysh) is an SEO Expert and Digital Marketing strategist based in Kathmandu, Nepal.",
          }),
        }}
      />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge>SEO Expert • Digital Marketing</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Aijeysh Sharma — SEO & Digital Marketing
            </h1>
            <p className="text-slate-300 max-w-xl">
              I help startups and brands in Kathmandu and globally rank higher, get
              measurable traffic, and increase conversions with ethical, data-driven
              SEO and content strategies.
            </p>

            <div className="flex gap-4 mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-md font-medium"
              >
                Hire Me
              </Link>

              <a
                href="#services"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-slate-700 text-sm"
              >
                View services
              </a>
            </div>

            <div className="mt-6 text-sm text-slate-400">
              <strong>Quick wins:</strong> Technical SEO audits • Local SEO (Kathmandu) • Content strategy
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="text-xs text-slate-400">Based in Kathmandu</span>
              <span className="text-xs text-slate-400">Freelance / Consultancy</span>
              <span className="text-xs text-slate-400">AI-assisted SEO</span>
            </div>
          </div>

          <div className="relative lg:order-last w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            {/* Suggestion: Replace with a professional portrait or hero illustration.
                Example images (suggested):
                - professional SEO consultant portrait, modern office (good for trust)
                - abstract digital marketing hero gradient or illustration (good for brand)
                See assistant message for suggested image sources.
            */}
            <Image
              src="/Aijeysh_Sharma.png"
              alt="Digital marketing hero image"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">Services Overview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ServiceCard
            title="Technical SEO & Audits"
            desc="Find and fix crawlability, speed and indexability issues that block growth. Includes prioritized fixes and impact estimates."
            icon="🛠"
          />
          <ServiceCard
            title="Content & Keyword Strategy"
            desc="Research-led content plans that target high-intent queries and support topical authority for long-term traffic."
            icon="✍️"
          />
          <ServiceCard
            title="Local SEO & GMB"
            desc="Optimize local presence for Kathmandu & Nepal searches — citations, GMB optimizations and local targeting."
            icon="📍"
          />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">What clients say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Testimonial
            quote="Aijeysh delivered a clear roadmap and our organic traffic doubled within months."
            author="Kailash, Founder — Kathmandu Startup"
          />
          <Testimonial
            quote="Practical, honest and effective. The audit highlighted issues we didn't know existed."
            author="Sita, Marketing Head — Local Retail"
          />
          <Testimonial
            quote="Great communication and measurable results. Highly recommended for Nepal-focused SEO."
            author="Ramesh, CEO — Service Company"
          />
        </div>
      </section>

      {/* LATEST BLOGS (server-rendered list) */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Latest insights</h2>
          <Link href="/blog" className="text-sm text-indigo-300">
            View all posts
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <article key={p.id} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800">
              <h3 className="text-lg font-semibold mb-2">
                <Link href={p.slug} className="hover:underline">
                  {p.title}
                </Link>
              </h3>
              <p className="text-slate-300 text-sm">{p.excerpt}</p>
              <div className="mt-4 text-xs text-slate-400">{p.date}</div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-700/30 to-fuchsia-700/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div>
            <h3 className="text-2xl font-semibold">Ready to grow?</h3>
            <p className="text-slate-300 mt-2">Book a free 20-minute strategy call or send your site for a quick audit.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/contact" className="px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500">
              Contact Aijeysh
            </Link>
            <Link href="/blog" className="px-5 py-3 rounded-full border border-slate-700">
              Read insights
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

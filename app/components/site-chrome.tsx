import Link from "next/link";
import { ScrollHeader } from "./motion";
import { ResponsiveNavigation } from "./responsive-navigation";

export function SiteHeader() {
  return (
    <>
      <ScrollHeader />
      <header className="site-header page-wrap" id="top">
        <Link className="wordmark" href="/" aria-label="Aijeysh Sharma, home">
          <span className="wordmark-mark">AS</span>
          <span className="wordmark-name">
            AIJEYSH<br />SHARMA
          </span>
        </Link>

        <ResponsiveNavigation />
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer page-wrap">
      <span>© AIJEYSH SHARMA · 2026</span>
      <span>LANGUAGE LAB · AMBITION GURU</span>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <a
          href="https://www.linkedin.com/in/sharmaaijeysh/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LINKEDIN ↗
        </a>
        <a href="mailto:sharmaaijeysh@gmail.com">EMAIL ↗</a>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}

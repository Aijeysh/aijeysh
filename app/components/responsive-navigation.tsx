"use client";

import { useState } from "react";
import Link from "next/link";

export function ResponsiveNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="mobile-menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        className={`main-nav${isOpen ? " is-open" : ""}`}
        id="primary-navigation"
        aria-label="Main navigation"
      >
        <Link href="/#approach" onClick={() => setIsOpen(false)}>
          APPROACH
        </Link>
        <Link href="/#experience" onClick={() => setIsOpen(false)}>
          EXPERIENCE
        </Link>
        <Link href="/blog" onClick={() => setIsOpen(false)}>
          NOTES
        </Link>
        <Link
          href="/contact"
          className="header-cta"
          onClick={() => setIsOpen(false)}
        >
          GET IN TOUCH <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </>
  );
}

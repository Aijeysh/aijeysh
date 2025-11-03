"use client";

import Script from "next/script";

export default function HeadSchema() {
  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Aijeysh Sharma",
          alternateName: "Sharma Aijeysh",
          url: "https://www.jagbijaya.com.np",
          logo: "https://www.jagbijaya.com.np/Aijeysh_Sharma.png",
          sameAs: [
            "https://www.linkedin.com/in/sharmaaijeysh/",
            "https://www.facebook.com/SharmaAijeysh",
            "https://www.instagram.com/aijeysh",
            "https://x.com/aijeysh",
          ],
        }),
      }}
    />
  );
}

export default function HeadSchema() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Aijeysh Sharma",
      alternateName: "Sharma Aijeysh",
      url: "https://www.jagbijaya.com.np",
      logo: "https://www.jagbijaya.com.np/Aijeysh_Sharma.png",
      sameAs: [
        "https://www.linkedin.com/in/sharmaaijeysh/",
        "https://x.com/aijeysh",
        "https://www.instagram.com/aijeysh",
        "https://www.facebook.com/SharmaAijeysh",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Aijeysh Sharma",
      alternateName: "Sharma Aijeysh",
      url: "https://www.jagbijaya.com.np",
      image: "https://www.jagbijaya.com.np/Aijeysh_Sharma.png",
      jobTitle: "SEO Expert and Digital Marketing Strategist",
      worksFor: {
        "@type": "Organization",
        name: "Aijeysh Sharma",
        url: "https://www.jagbijaya.com.np",
      },
      sameAs: [
        "https://www.linkedin.com/in/sharmaaijeysh/",
        "https://x.com/aijeysh",
        "https://www.instagram.com/aijeysh",
        "https://www.facebook.com/SharmaAijeysh",
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

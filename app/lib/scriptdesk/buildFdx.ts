import { ElementType, ScriptElement } from "./types";

// Final Draft (.fdx) is plain XML. Final Draft applies its own page layout
// from the paragraph Type, so no indents are needed here.
const FDX_TYPE: Record<ElementType, string> = {
  scene: "Scene Heading",
  action: "Action",
  character: "Character",
  parenthetical: "Parenthetical",
  dialogue: "Dialogue",
  transition: "Transition",
};

const UPPER: ElementType[] = ["scene", "character", "transition"];

function esc(s: string): string {
  return s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // illegal in XML 1.0
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphs(el: ScriptElement): string[] {
  // One FDX paragraph per line; blank lines are dropped.
  return el.text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      let text = UPPER.includes(el.type) ? line.toUpperCase() : line;
      if (el.type === "parenthetical" && !text.startsWith("(")) {
        text = `(${text.replace(/\)$/, "")})`;
      }
      return `    <Paragraph Type="${FDX_TYPE[el.type]}"><Text>${esc(text)}</Text></Paragraph>`;
    });
}

const centered = (text: string) =>
  `      <Paragraph Alignment="Center"><Text>${esc(text)}</Text></Paragraph>`;

export function buildFdx(title: string, author: string, elements: ScriptElement[]): string {
  let body = elements.flatMap(paragraphs);
  if (body.length === 0) body = [`    <Paragraph Type="Action"><Text></Text></Paragraph>`];

  const titlePage = [
    ...Array.from({ length: 8 }, () => centered("")),
    centered((title || "Untitled").toUpperCase()),
    ...(author ? [centered(""), centered("Written by"), centered(author)] : []),
  ];

  return [
    `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>`,
    `<FinalDraft DocumentType="Script" Template="No" Version="5">`,
    `  <Content>`,
    ...body,
    `  </Content>`,
    `  <TitlePage>`,
    `    <Content>`,
    ...titlePage,
    `    </Content>`,
    `  </TitlePage>`,
    `</FinalDraft>`,
    ``,
  ].join("\n");
}

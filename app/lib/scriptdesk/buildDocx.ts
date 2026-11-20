import {
  AlignmentType,
  Document,
  Header,
  LineRuleType,
  PageNumber,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { ElementType, ScriptElement } from "./types";

// Standard US screenplay layout: Courier 12pt, 1.5" left / 1" other margins.
// All measures are DXA (1440 = 1 inch). Text area is 6" = 8640.
const FONT = "Courier New";
const SIZE = 24; // half-points -> 12pt

interface Format {
  left: number;
  right: number;
  before: number;
  upper?: boolean;
  bold?: boolean;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  keepNext?: boolean;
}

const FORMAT: Record<ElementType, Format> = {
  scene: { left: 0, right: 0, before: 240, upper: true, bold: true, keepNext: true },
  action: { left: 0, right: 0, before: 240 },
  character: { left: 3168, right: 0, before: 240, upper: true, keepNext: true },
  parenthetical: { left: 2304, right: 3456, before: 0, keepNext: true },
  dialogue: { left: 1440, right: 2160, before: 0 },
  transition: { left: 0, right: 0, before: 240, upper: true, align: AlignmentType.RIGHT },
};

function runs(text: string, upper = false, bold = false) {
  return text.split("\n").map(
    (line, i) =>
      new TextRun({
        text: upper ? line.toUpperCase() : line,
        font: FONT,
        size: SIZE,
        bold,
        break: i > 0 ? 1 : undefined,
      })
  );
}

function toParagraph(el: ScriptElement): Paragraph | null {
  let text = el.text.replace(/\s+$/g, "");
  if (!text.trim()) return null;
  const f = FORMAT[el.type];
  if (el.type === "parenthetical" && !text.startsWith("(")) text = `(${text.replace(/\)$/, "")})`;

  return new Paragraph({
    alignment: f.align ?? AlignmentType.LEFT,
    keepNext: f.keepNext,
    keepLines: true,
    indent: { left: f.left, right: f.right },
    spacing: { before: f.before, after: 0, line: 240, lineRule: LineRuleType.EXACT },
    children: runs(text, f.upper, f.bold),
  });
}

const PAGE = {
  size: { width: 12240, height: 15840 },
  margin: { top: 1440, bottom: 1440, left: 2160, right: 1440, header: 720 },
};

export async function buildDocx(
  title: string,
  author: string,
  elements: ScriptElement[]
): Promise<Buffer> {
  const body = elements.map(toParagraph).filter((p): p is Paragraph => p !== null);
  if (body.length === 0) body.push(new Paragraph({ children: [] }));

  const centered = (text: string, before: number, bold = false) =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before, after: 0, line: 240, lineRule: LineRuleType.EXACT },
      children: [new TextRun({ text, font: FONT, size: SIZE, bold })],
    });

  const titlePage = [
    centered((title || "Untitled").toUpperCase(), 4320, true),
    ...(author ? [centered("Written by", 720), centered(author, 240)] : []),
  ];

  const doc = new Document({
    title: title || "Untitled",
    creator: author || "Scriptdesk",
    styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
    sections: [
      { properties: { page: PAGE }, children: titlePage },
      {
        properties: {
          titlePage: true, // page 1 of the script carries no page number
          page: { ...PAGE, pageNumbers: { start: 1 } },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ children: [PageNumber.CURRENT, "."], font: FONT, size: SIZE }),
                ],
              }),
            ],
          }),
          first: new Header({ children: [new Paragraph({ children: [] })] }),
        },
        children: body,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

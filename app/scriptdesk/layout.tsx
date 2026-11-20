import type { Metadata } from "next";
import { Courier_Prime, Instrument_Sans } from "next/font/google";
import "./scriptdesk.css";

const scriptFont = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-script" });
const uiFont = Instrument_Sans({ subsets: ["latin"], variable: "--font-ui" });

export const metadata: Metadata = {
  title: "Scriptdesk",
  description: "Write screenplays and export them to Word or Final Draft.",
};

// Nested layout: only wraps /scriptdesk, your root layout is untouched.
export default function ScriptdeskLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${scriptFont.variable} ${uiFont.variable}`}>{children}</div>;
}

import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "./mongodb";
import { ELEMENT_TYPES, Script, ScriptElement } from "./types";

export interface ScriptDoc {
  _id: ObjectId;
  title: string;
  author: string;
  elements: ScriptElement[];
  createdAt: Date;
  updatedAt: Date;
}

export async function scriptsCollection() {
  const db = await getDb();
  return db.collection<ScriptDoc>("scriptdesk_scripts");
}

export function toScript(d: ScriptDoc): Script {
  return {
    id: d._id.toString(),
    title: d.title,
    author: d.author,
    elements: d.elements,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}

export function parseId(id: string): ObjectId | null {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export function clean(value: unknown, max: number): string | undefined {
  return typeof value === "string" ? value.slice(0, max) : undefined;
}

/** Validates what the client sends; returns null if the payload is malformed. */
export function sanitizeElements(input: unknown): ScriptElement[] | null {
  if (!Array.isArray(input) || input.length > 5000) return null;
  const out: ScriptElement[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") return null;
    const { id, type, text } = raw as Record<string, unknown>;
    if (typeof id !== "string" || typeof text !== "string") return null;
    if (!ELEMENT_TYPES.includes(type as ScriptElement["type"])) return null;
    out.push({
      id: id.slice(0, 64),
      type: type as ScriptElement["type"],
      text: text.slice(0, 10000),
    });
  }
  return out;
}

export function fail(e: unknown) {
  console.error(e);
  return NextResponse.json(
    { error: "Database error. Check MONGODB_URI and Atlas network access." },
    { status: 500 }
  );
}

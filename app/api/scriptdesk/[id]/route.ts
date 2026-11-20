import { NextResponse } from "next/server";
import {
  clean,
  fail,
  parseId,
  sanitizeElements,
  scriptsCollection,
  toScript,
} from "../../../lib/scriptdesk/scripts";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const oid = parseId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  try {
    const col = await scriptsCollection();
    const doc = await col.findOne({ _id: oid });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(toScript(doc));
  } catch (e) {
    return fail(e);
  }
}

// Autosave target: replaces title, author and elements
export async function PUT(req: Request, { params }: Ctx) {
  const oid = parseId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const elements = sanitizeElements(body?.elements);
  const title = clean(body?.title, 200);
  const author = clean(body?.author, 200);
  if (!elements || title === undefined || author === undefined) {
    return NextResponse.json({ error: "Invalid screenplay data" }, { status: 400 });
  }

  try {
    const col = await scriptsCollection();
    const updatedAt = new Date();
    const res = await col.updateOne(
      { _id: oid },
      { $set: { title, author, elements, updatedAt } }
    );
    if (!res.matchedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ updatedAt: updatedAt.toISOString() });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const oid = parseId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  try {
    const col = await scriptsCollection();
    await col.deleteOne({ _id: oid });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

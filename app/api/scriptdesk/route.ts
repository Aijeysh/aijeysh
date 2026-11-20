import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { clean, fail, ScriptDoc, scriptsCollection, toScript } from "../../lib/scriptdesk/scripts";

// List screenplays (without their bodies)
export async function GET() {
  try {
    const col = await scriptsCollection();
    const docs = await col
      .find({}, { projection: { title: 1, author: 1, updatedAt: 1 } })
      .sort({ updatedAt: -1 })
      .limit(200)
      .toArray();
    return NextResponse.json(
      docs.map((d) => ({
        id: d._id.toString(),
        title: d.title,
        author: d.author,
        updatedAt: d.updatedAt.toISOString(),
      }))
    );
  } catch (e) {
    return fail(e);
  }
}

// Create a screenplay
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const now = new Date();
    const doc: ScriptDoc = {
      _id: new ObjectId(),
      title: clean(body?.title, 200) ?? "Untitled screenplay",
      author: "",
      elements: [{ id: crypto.randomUUID(), type: "scene", text: "" }],
      createdAt: now,
      updatedAt: now,
    };
    const col = await scriptsCollection();
    await col.insertOne(doc);
    return NextResponse.json(toScript(doc), { status: 201 });
  } catch (e) {
    return fail(e);
  }
}

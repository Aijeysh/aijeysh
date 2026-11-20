import { NextResponse } from "next/server";
import { buildDocx } from "../../../../lib/scriptdesk/buildDocx";
import { buildFdx } from "../../../../lib/scriptdesk/buildFdx";
import { fail, parseId, scriptsCollection } from "../../../../lib/scriptdesk/scripts";

// GET /api/scriptdesk/<id>/export?format=docx|fdx
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const oid = parseId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const format = new URL(req.url).searchParams.get("format") ?? "docx";
  if (format !== "docx" && format !== "fdx") {
    return NextResponse.json({ error: "Unknown format" }, { status: 400 });
  }

  try {
    const col = await scriptsCollection();
    const doc = await col.findOne({ _id: oid });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const slug =
      doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "screenplay";

    const body =
      format === "docx"
        ? new Uint8Array(await buildDocx(doc.title, doc.author, doc.elements))
        : buildFdx(doc.title, doc.author, doc.elements);

    return new NextResponse(body, {
      headers: {
        "Content-Type":
          format === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}.${format}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return fail(e);
  }
}

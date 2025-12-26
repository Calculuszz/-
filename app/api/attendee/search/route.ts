import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getImageEmbeddingFromBuffer } from "@/lib/geminiEmbedding";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const file = form.get("image") as File;
  const eventId = form.get("event_id") as string;

  if (!file || !eventId) {
    return NextResponse.json({ error: "missing data" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  /* 1) embedding */
  const embedding = await getImageEmbeddingFromBuffer(buffer);

  /* 2) vector search */
  const { data, error } = await supabaseAdmin.rpc("search_items_by_image", {
    p_event_id: eventId,
    p_query: embedding,
    p_k: 10,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({
    results: data,
  });
}

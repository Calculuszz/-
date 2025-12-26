import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getImageEmbedding } from "@/lib/clipEmbedding";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const eventId = formData.get("event_id") as string;

  if (!file || !eventId) {
    return NextResponse.json({ error: "missing data" }, { status: 400 });
  }

  /* 1) save query image */
  const bytes = Buffer.from(await file.arrayBuffer());
  const imagePath = path.join("uploads", `query-${Date.now()}-${file.name}`);
  await fs.writeFile(imagePath, bytes);

  /* 2) embedding */
  const queryEmbedding = await getImageEmbedding(imagePath);

  /* 3) similarity search */
  const { data, error } = await supabaseAdmin.rpc("search_items_by_embedding", {
    p_event_id: eventId,
    p_query: queryEmbedding,
    p_limit: 5,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  /* 4) threshold (optional but recommended) */
  const results = data.filter((r: any) => r.similarity > 0.75);

  return NextResponse.json({
    results,
  });
}

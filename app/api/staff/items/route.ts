import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getImageEmbedding } from "@/lib/clipEmbedding";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("image") as File;
  const title = formData.get("title") as string;
  const eventId = formData.get("event_id") as string;

  if (!file || !eventId) {
    return NextResponse.json({ error: "missing data" }, { status: 400 });
  }

  /* 1) save image (local for testing) */
  const bytes = Buffer.from(await file.arrayBuffer());
  const imagePath = path.join("uploads", `${Date.now()}-${file.name}`);
  await fs.writeFile(imagePath, bytes);

  /* 2) insert item */
  const { data: item, error: itemError } = await supabaseAdmin
    .from("items")
    .insert({
      event_id: eventId,
      title,
    })
    .select()
    .single();

  if (itemError) {
    return NextResponse.json({ error: itemError }, { status: 500 });
  }

  /* 3) insert item_images */
  const { data: image, error: imageError } = await supabaseAdmin
    .from("item_images")
    .insert({
      item_id: item.id,
      image_path: imagePath,
    })
    .select()
    .single();

  if (imageError) {
    return NextResponse.json({ error: imageError }, { status: 500 });
  }

  /* 4) embedding */
  const embedding = await getImageEmbedding(imagePath);

  /* 5) insert item_embeddings */
  await supabaseAdmin.from("item_embeddings").insert({
    item_image_id: image.id,
    model: "clip-local",
    embedding,
  });

  return NextResponse.json({
    success: true,
    item_id: item.id,
  });
}

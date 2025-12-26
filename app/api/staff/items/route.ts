import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getImageEmbeddingFromBuffer } from "@/lib/geminiEmbedding";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const file = form.get("image") as File;
  const eventId = form.get("event_id") as string;
  const title = (form.get("title") as string) ?? "unknown item";

  if (!file || !eventId) {
    return NextResponse.json({ error: "missing data" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  /* 1) upload image */
  const imagePath = `items/event_${eventId}/${randomUUID()}.jpg`;

  await supabaseAdmin.storage
    .from("items")
    .upload(imagePath, buffer, { contentType: file.type });

  /* 2) insert item */
  const { data: item } = await supabaseAdmin
    .from("items")
    .insert({ event_id: eventId, title })
    .select()
    .single();

  /* 3) insert item_images */
  const { data: image } = await supabaseAdmin
    .from("item_images")
    .insert({
      item_id: item.id,
      image_path: imagePath,
    })
    .select()
    .single();

  /* 4) embedding */
  const embedding = await getImageEmbeddingFromBuffer(buffer);

  /* 5) insert vector */
  await supabaseAdmin.from("item_embeddings").insert({
    item_image_id: image.id,
    model: "vertex-multimodal-embedding",
    embedding,
  });

  return NextResponse.json({
    success: true,
    item_id: item.id,
  });
}

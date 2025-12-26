import { getImageEmbedding } from "./lib/clipEmbedding.ts";

async function main() {
  const embedding = await getImageEmbedding("test.jpg");

  console.log("Embedding length:", embedding.length);
  console.log("First 5 values:", embedding.slice(0, 5));
}

main();

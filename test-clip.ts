require("dotenv").config();
const fs = require("fs");
const { getImageEmbedding } = require("./lib/clipEmbedding");

async function main() {
  const buffer = fs.readFileSync("test.jpg");
  const embedding = await getImageEmbedding(buffer);

  console.log("Embedding length:", embedding.length);
  console.log("First 5 values:", embedding.slice(0, 5));
}

main();

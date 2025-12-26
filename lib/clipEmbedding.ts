const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

module.exports = {
  getImageEmbedding: async (buffer: Buffer) => {
    const base64 = buffer.toString("base64");

    const output = await replicate.run("openai/clip-vit-large-patch14", {
      input: {
        image: `data:image/jpeg;base64,${base64}`,
      },
    });

    return output;
  },
};

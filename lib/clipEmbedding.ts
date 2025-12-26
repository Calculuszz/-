import { execFile } from "child_process";
import path from "path";

export function getImageEmbedding(imagePath: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve("clip_embed.py");

    execFile(
      "python",
      [scriptPath, imagePath],
      { maxBuffer: 1024 * 1024 * 10 },
      (error, stdout) => {
        if (error) return reject(error);

        try {
          const embedding = JSON.parse(stdout);
          resolve(embedding);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

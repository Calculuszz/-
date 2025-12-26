import sys
import json
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

# โหลด model (ครั้งแรกจะโหลดจากเน็ต)
model = CLIPModel.from_pretrained("openai/clip-vit-large-patch14")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-large-patch14")

def embed_image(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        features = model.get_image_features(**inputs)

    # normalize (สำคัญสำหรับ similarity)
    features = features / features.norm(p=2, dim=-1, keepdim=True)

    return features[0].tolist()  # length = 768

if __name__ == "__main__":
    image_path = sys.argv[1]
    embedding = embed_image(image_path)
    print(json.dumps(embedding))

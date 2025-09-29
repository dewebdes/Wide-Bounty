# 🧱 RoomGlyphX — Dual-Upload Room Visualization Platform

**RoomGlyphX** is an open-source, modular visualization tool that lets users upload their own room photos and inject custom materials (e.g., carpets, tiles) into segmented regions with perspective-aware warping. Inspired by Roomvo, built for diagnostic clarity and resilient workflows.

---

## 🔧 Features

- 🖼️ Upload your own room image
- 🧠 Auto-segment floor region using deep learning
- 🎨 Upload custom material textures (e.g., carpet, tile)
- 📐 Warp textures to match room perspective using homography
- 🧩 Inject textures into segmented regions with blending
- 🏠 Browse pre-defined room templates
- 🧵 Choose from built-in material libraries
- 💾 Export final preview image
- 🌐 Fully web-based, no per-image fees

---

## 🧩 Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Frontend | React + FilePond | Dual upload UI (room + material) |
| Segmentation | U^2-Net / Detectron2 | Floor region detection |
| Texture Mapping | OpenCV + NumPy | Homography warp + overlay |
| Material Picker | Fabric.js / Custom | Interactive texture selection |
| Export | html2canvas / canvas.toBlob | Save final image |

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourname/roomglyphx.git
cd roomglyphx
npm install
npm start
```

---

## 🧠 Architecture Overview

1. **Room Upload Phase**  
   User uploads a photo of their room or selects a pre-defined template.

2. **Segmentation Phase**  
   AI model detects the floor region and generates a binary mask.

3. **Material Selection Phase**  
   User uploads a texture or selects from built-in materials.

4. **Warp Phase**  
   Texture is transformed via homography to match the room’s perspective.

5. **Injection Phase**  
   Warped texture is blended into the segmented region using alpha blending.

6. **Export Phase**  
   Final image is rendered and saved.

---

## 📦 Assets & Models

- Pre-defined rooms stored in `/assets/rooms/`
- Built-in materials stored in `/assets/materials/`
- Free 3D models from [Sketchfab](https://sketchfab.com/search?features=downloadable&licenses=cc)
- Material textures from [AmbientCG](https://ambientcg.com/) and [Poly Haven](https://polyhaven.com/)

---

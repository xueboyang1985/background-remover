# AI Background Remover

Remove image backgrounds instantly with AI — **100% browser-based, nothing uploaded to any server.**

[![Live Tool](https://img.shields.io/badge/Try%20it-Live-brightgreen)](https://xueboyang1985.github.io/background-remover/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue)](https://github.com/xueboyang1985/background-remover/tree/main/extension)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **AI-powered** — Uses ISNet neural network for pixel-level background removal
- **100% local** — Runs in your browser via WebGPU/WASM, no server upload
- **Before/after comparison** — Interactive slider to compare results
- **HD download** — Free: up to 1080px, PRO: full original resolution
- **Background color** — PRO: replace background with any color
- **Batch processing** — PRO: up to 10 images at once
- **Multiple formats** — JPG, PNG, WebP input; PNG output with transparency

## Try It

👉 **[https://xueboyang1985.github.io/background-remover/](https://xueboyang1985.github.io/background-remover/)**

Upload an image and the AI removes the background instantly. No signup, no email, no tracking.

## Chrome Extension

Right-click any image on the web → "Remove background with AI". 

[Download extension.zip](https://xueboyang1985.github.io/background-remover/extension.zip) — load as unpacked extension in Chrome.

## Usage

1. Open the [tool page](https://xueboyang1985.github.io/background-remover/)
2. Drop an image (JPG, PNG, WebP, max 20MB)
3. Wait 2-10 seconds for AI processing
4. Download the result with transparent background

First use downloads a ~40MB AI model (cached in browser for future use).

## PRO Version

| Feature | Free | PRO |
|---------|------|-----|
| Output resolution | Max 1080px | Full HD+ (original) |
| Background color | — | Any color |
| Batch processing | — | Up to 10 images |
| AI model | Standard (int8) | High quality (FP16) |

**PRO: [$9.99 one-time](https://xuebo8.gumroad.com/l/bgrmv-pro)** — individual tool license  
**Bundle: [$19.99 one-time](https://xuebo8.gumroad.com/l/skxcpj)** — all 11 browser tools

## Tech Stack

- **AI:** [@imgly/background-removal](https://github.com/imgly/background-removal-js) (ISNet model)
- **Runtime:** ONNX Runtime Web (WebGPU/WASM)
- **Bundler:** esbuild (IIFE)
- **Hosting:** GitHub Pages
- **License verification:** Gumroad API

## How It Works

The tool uses a pre-trained ISNet neural network optimized for portrait and product background removal. The model runs entirely in the browser using ONNX Runtime Web with WebGPU acceleration. Your images never leave your device.

```js
import { removeBackground } from '@imgly/background-removal';
const result = await removeBackground(imageBlob, {
  model: 'isnet_quint8',  // or 'isnet_fp16' for PRO
  output: { format: 'image/png' }
});
```

## License

MIT — free to use, modify, and distribute.

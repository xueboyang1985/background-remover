// AI Background Remover - Popup
const B = Bgrmv;
const MAX_FREE_DIM = 1080;
let sourceBlob = null;
let resultBlob = null;
let processing = false;
let isPro = false;

try { isPro = localStorage.getItem('bgrmv_pro') === '1'; } catch(e) {}

// DOM
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const progressWrap = document.getElementById('progress-wrap');
const progressFill = document.getElementById('progress-fill');
const progLabel = document.getElementById('prog-label');
const resultWrap = document.getElementById('result-wrap');
const previewBefore = document.getElementById('preview-before');
const previewAfter = document.getElementById('preview-after');
const btnDownload = document.getElementById('btn-download');
const btnNew = document.getElementById('btn-new');
const statusText = document.getElementById('status-text');
const proSection = document.getElementById('pro-section');
const buyLink = document.getElementById('buy-pro-link');

// Check for pending image from context menu
chrome.storage.local.get('pendingImageUrl', ({ pendingImageUrl }) => {
  if (pendingImageUrl) {
    chrome.storage.local.remove('pendingImageUrl');
    fetch(pendingImageUrl)
      .then(r => r.blob())
      .then(blob => handleFile(new File([blob], 'image.png', { type: blob.type })))
      .catch(() => {}); // fall through to manual upload
  }
});

// Paste support
document.addEventListener('paste', (e) => {
  const items = e.clipboardData.items;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile();
      if (blob) handleFile(new File([blob], 'pasted.png', { type: blob.type }));
    }
  }
});

uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.style.borderColor = '#6366f1'; });
uploadZone.addEventListener('dragleave', () => { uploadZone.style.borderColor = '#e2e8f0'; });
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = '#e2e8f0';
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });

btnDownload.addEventListener('click', () => {
  if (!resultBlob) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(resultBlob);
  a.download = 'no-bg.png';
  a.click();
  URL.revokeObjectURL(a.href);
});

btnNew.addEventListener('click', resetUI);

buyLink.addEventListener('click', (e) => {
  e.preventDefault();
  const url = 'https://xuebo8.gumroad.com/l/bgrmv-pro';
  chrome.tabs.create({ url });
});

async function handleFile(file) {
  if (!file.type.startsWith('image/')) return;
  if (file.size > 20 * 1024 * 1024) { setStatus('File too large (max 20MB)'); return; }
  if (processing) return;

  sourceBlob = file;
  resultBlob = null;
  processing = true;
  resultWrap.classList.remove('active');

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => { previewBefore.src = e.target.result; };
  reader.readAsDataURL(file);

  progressWrap.classList.add('active');
  progressFill.style.width = '5%';
  progLabel.textContent = 'Loading AI model...';

  try {
    await B.preload({ device: 'gpu', model: isPro ? 'isnet_fp16' : 'isnet_quint8' });
    progressFill.style.width = '40%';
    progLabel.textContent = 'Processing image...';

    const imgBlob = await B.removeBackground(file, {
      device: 'gpu',
      model: isPro ? 'isnet_fp16' : 'isnet_quint8',
      output: { format: 'image/png', quality: 1.0 }
    });
    progressFill.style.width = '90%';

    if (!isPro) {
      resultBlob = await resizeImage(imgBlob, MAX_FREE_DIM);
    } else {
      resultBlob = imgBlob;
    }

    previewAfter.src = URL.createObjectURL(resultBlob);
    await new Promise(r => { previewAfter.onload = r; setTimeout(r, 300); });

    resultWrap.classList.add('active');
    progressWrap.classList.remove('active');

    const kb = (resultBlob.size / 1024).toFixed(0);
    setStatus(`Done! ${kb}KB | ${isPro ? 'HD' : 'Standard'} quality`);

    if (!isPro) {
      proSection.style.display = 'block';
    }
  } catch (err) {
    setStatus('Error: ' + (err.message || 'unknown'));
    progressWrap.classList.remove('active');
  }
  processing = false;
}

function resizeImage(blob, maxDim) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(b => resolve(b), 'image/png');
    };
    img.src = URL.createObjectURL(blob);
  });
}

function setStatus(msg) {
  statusText.textContent = msg;
}

function resetUI() {
  sourceBlob = null;
  resultBlob = null;
  resultWrap.classList.remove('active');
  proSection.style.display = 'none';
  setStatus('');
  progressWrap.classList.remove('active');
  previewBefore.src = '';
  previewAfter.src = '';
}

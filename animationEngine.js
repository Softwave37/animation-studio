// Handles frames, playback, drawing, styles

export const state = {
  canvas: null,
  ctx: null,
  characterImage: null,
  frames: [],
  activeFrameIndex: 0,
  isPlaying: false,
  lastTime: 0,
  frameDuration: 1000 / 8, // default 8 fps
};

export function initCanvas() {
  state.canvas = document.getElementById("canvas");
  state.ctx = state.canvas.getContext("2d");
}

export function createEmptyFrames(count) {
  state.frames = [];
  for (let i = 0; i < count; i++) {
    state.frames.push({
      offsetX: 0,
      offsetY: 0,
    });
  }
}

export function applyStylePreset(style) {
  const ctx = state.ctx;
  switch (style) {
    case "toon":
      ctx.filter = "contrast(1.3) saturate(1.4)";
      break;
    case "soft":
      ctx.filter = "brightness(1.1) saturate(0.9)";
      break;
    case "noir":
      ctx.filter = "grayscale(1) contrast(1.4)";
      break;
    default:
      ctx.filter = "none";
  }
}

export function draw(style) {
  const { canvas, ctx, characterImage, frames, activeFrameIndex } = state;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0b0c10";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!characterImage) {
    ctx.fillStyle = "#c5c6c7";
    ctx.font = "16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      "Upload a character image to start",
      canvas.width / 2,
      canvas.height / 2
    );
    return;
  }

  const frame = frames[activeFrameIndex] || { offsetX: 0, offsetY: 0 };

  applyStylePreset(style);

  const imgW = characterImage.width;
  const imgH = characterImage.height;
  const scale = Math.min(
    (canvas.width * 0.5) / imgW,
    (canvas.height * 0.7) / imgH
  );

  const drawW = imgW * scale;
  const drawH = imgH * scale;

  const centerX = canvas.width / 2 + Number(frame.offsetX);
  const centerY = canvas.height / 2 + Number(frame.offsetY);

  ctx.drawImage(
    characterImage,
    centerX - drawW / 2,
    centerY - drawH / 2,
    drawW,
    drawH
  );

  ctx.filter = "none";
}

export function loop(timestamp, style, onFrameChange) {
  if (!state.isPlaying) return;

  if (timestamp - state.lastTime >= state.frameDuration) {
    state.lastTime = timestamp;
    state.activeFrameIndex = (state.activeFrameIndex + 1) % state.frames.length;
    onFrameChange(state.activeFrameIndex);
    draw(style);
  }

  requestAnimationFrame((t) => loop(t, style, onFrameChange));
}

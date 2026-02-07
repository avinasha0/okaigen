const fs = require("fs");
const path = require("path");

const MIN_SIZE = 48;
const ICO_SIZES = [16, 32, 48];
const APPLE_TOUCH_SIZE = 180;

async function main() {
  const publicDir = path.join(__dirname, "..", "public");
  const pngPath = path.join(publicDir, "favicon.png");
  const icoPath = path.join(publicDir, "favicon.ico");
  const applePath = path.join(publicDir, "apple-touch-icon.png");

  if (!fs.existsSync(pngPath)) {
    console.error("Missing source PNG at", pngPath);
    process.exit(1);
  }

  try {
    const sharp = (await import("sharp")).default;
    const meta = await sharp(pngPath).metadata();
    const minDim = Math.min(meta.width || 0, meta.height || 0);

    if (minDim < MIN_SIZE) {
      await sharp(pngPath).resize(MIN_SIZE, MIN_SIZE).toFile(pngPath);
    }

    // Flatten onto white background so icon is never fully transparent (Google requirement)
    const withBackground = (size) =>
      sharp(pngPath)
        .resize(size, size)
        .flatten({ background: "#ffffff" })
        .png();

    const toIco = (await import("png-to-ico")).default;
    const tempDir = path.join(publicDir, ".favicon-temp");
    fs.mkdirSync(tempDir, { recursive: true });
    const tempPaths = [];

    try {
      for (const size of ICO_SIZES) {
        const tempPath = path.join(tempDir, `favicon-${size}.png`);
        await withBackground(size).toFile(tempPath);
        tempPaths.push(tempPath);
      }
      const icoBuffer = await toIco(tempPaths);
      fs.writeFileSync(icoPath, icoBuffer);
      console.log("favicon.ico written (16x16, 32x32, 48x48)");
    } finally {
      for (const p of tempPaths) {
        try { fs.unlinkSync(p); } catch (_) {}
      }
      try { fs.rmdirSync(tempDir); } catch (_) {}
    }

    await withBackground(APPLE_TOUCH_SIZE).toFile(applePath);
    console.log("apple-touch-icon.png written (180x180)");
    console.log("Favicon set ready");
  } catch (err) {
    console.error("Failed to generate favicon:", err);
    process.exit(1);
  }
}

main();

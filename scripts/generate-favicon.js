const fs = require("fs");
const path = require("path");

const MIN_SIZE = 48; // Google Search minimum

async function main() {
  const pngPath = path.join(__dirname, "..", "public", "favicon.png");
  const icoPath = path.join(__dirname, "..", "public", "favicon.ico");

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

    try {
      const toIco = (await import("png-to-ico")).default;
      const buffer = await toIco([pngPath]);
      fs.writeFileSync(icoPath, buffer);
    } catch (_) {
      // png-to-ico optional; PNG suffices for Google
    }
    console.log("Favicon ready");
  } catch (err) {
    console.error("Failed to generate favicon:", err);
    process.exit(1);
  }
}

main();

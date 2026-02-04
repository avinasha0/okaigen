const fs = require("fs");
const path = require("path");

async function main() {
  const pngPath = path.join(__dirname, "..", "public", "favicon.png");
  const icoPath = path.join(__dirname, "..", "public", "favicon.ico");

  if (!fs.existsSync(pngPath)) {
    console.error("Missing source PNG at", pngPath);
    process.exit(1);
  }

  try {
    const toIco = (await import("png-to-ico")).default;
    const buffer = await toIco([pngPath]);
    fs.writeFileSync(icoPath, buffer);
    console.log("Generated", icoPath, "size:", buffer.length, "bytes");
  } catch (err) {
    console.error("Failed to generate favicon.ico:", err);
    process.exit(1);
  }
}

main();

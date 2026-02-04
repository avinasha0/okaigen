const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const NEXT_DIR = path.join(ROOT, ".next");
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

function killByPort(port) {
  try {
    if (process.platform === "win32") {
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
      const pids = new Set();
      out.split("\n").forEach((line) => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (/^\d+$/.test(pid)) pids.add(pid);
      });
      pids.forEach((pid) => {
        try {
          execSync(`taskkill /F /PID ${pid}`);
          console.log("Killed PID", pid, "on port", port);
        } catch {}
      });
    } else {
      const out = execSync(`lsof -i :${port} -t || true`, { encoding: "utf8" });
      out
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => /^\d+$/.test(l))
        .forEach((pid) => {
          try {
            execSync(`kill -9 ${pid}`);
            console.log("Killed PID", pid, "on port", port);
          } catch {}
        });
    }
  } catch {}
}

function cleanNext() {
  try {
    if (fs.existsSync(NEXT_DIR)) {
      fs.rmSync(NEXT_DIR, { recursive: true, force: true });
      console.log(".next directory removed");
    }
  } catch (e) {
    console.error("Failed to remove .next", e.message);
  }
}

console.log("Stopping processes on port", PORT);
killByPort(PORT);
console.log("Cleaning .next");
cleanNext();
console.log("Clean complete");

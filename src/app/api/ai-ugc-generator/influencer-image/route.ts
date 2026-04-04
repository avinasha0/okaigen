import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

// Serves the influencer avatar image for the dashboard lip-sync demo.
// NOTE: This is currently wired to your local Cursor workspace path.
const INFLUENCER_IMAGE_PATH = String.raw`C:\Users\allad\.cursor\projects\d-okaigen\assets\c__Users_allad_AppData_Roaming_Cursor_User_workspaceStorage_08a4d47d6a18efb73c49d32050774766_images_image-d3e47d41-e4ce-415c-8cc5-1148a68fb2ba.png`;

export async function GET() {
  try {
    const buffer = await readFile(INFLUENCER_IMAGE_PATH);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Influencer image not found" }, { status: 404 });
  }
}


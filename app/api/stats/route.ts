import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const statsFilePath = path.join(process.cwd(), "data", "stats.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(statsFilePath, "utf8");
    const stats = JSON.parse(fileContents);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

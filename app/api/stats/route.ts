import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import defaultStats from "../../../data/stats.json";

const statsFilePath = path.join(process.cwd(), "data", "stats.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(statsFilePath, "utf8");
    const stats = JSON.parse(fileContents);
    return NextResponse.json(stats);
  } catch (error) {
    console.warn("Falling back to default stats data:", error);
    return NextResponse.json(defaultStats);
  }
}

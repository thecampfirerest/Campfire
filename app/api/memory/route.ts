// /app/api/memory/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DBFILE = path.resolve(process.cwd(), "data", "memories.json");

// Attempt to use Prisma if DATABASE_URL present
const usePrisma = !!process.env.DATABASE_URL;
let PrismaClient: any = null;
let prisma: any = null;

if (usePrisma) {
  try {
    PrismaClient = require("@prisma/client").PrismaClient;
    prisma = new PrismaClient();
  } catch (e) {
    // Prisma not installed – fallback will be used
    prisma = null;
  }
}

function readDB() {
  try {
    const raw = fs.readFileSync(DBFILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { memories: [] };
  }
}

function writeDB(obj: any) {
  fs.mkdirSync(path.dirname(DBFILE), { recursive: true });
  fs.writeFileSync(DBFILE, JSON.stringify(obj, null, 2));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If prisma available, write to DB
    if (prisma) {
      await prisma.memory.create({
        data: {
          travId: body.travId || "anon",
          payload: body.payload ? JSON.stringify(body.payload) : body.text ? body.text : null,
        },
      });
      return NextResponse.json({ ok: true });
    }

    // Fallback file write (dev only)
    const db = readDB();
    db.memories.unshift({ ...body, createdAt: new Date().toISOString() });
    writeDB(db);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (prisma) {
      const rows = await prisma.memory.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
      return NextResponse.json({ memories: rows });
    }
    const db = readDB();
    return NextResponse.json(db);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

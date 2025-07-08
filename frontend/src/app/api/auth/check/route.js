import { NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { count } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select({ value: count() }).from(admins);
    const adminCount = result[0].value;

    const canRegister = adminCount < 2;
    return NextResponse.json({ canRegister });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

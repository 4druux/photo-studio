import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    const existingAdmin = await db.query.admins.findFirst({
      where: eq(admins.email, email),
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(admins).values({
      name,
      email,
      password: hashedPassword,
      updatedAt: new Date(),
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error("Gagal melakukan registrasi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

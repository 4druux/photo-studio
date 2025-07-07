import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log(`Mencoba login dengan email: ${email}`);

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      console.log(`Admin dengan email ${email} tidak ditemukan.`);
      return NextResponse.json(
        { message: "Email atau password salah." },
        { status: 401 }
      );
    }

    console.log(`Admin ditemukan. Membandingkan password...`);
    console.log(`Password dari user: ${password}`);
    console.log(`Hash dari DB: ${admin.password}`);

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      console.log(`Perbandingan password GAGAL untuk email: ${email}`);
      return NextResponse.json(
        { message: "Email atau password salah." },
        { status: 401 }
      );
    }

    console.log(`Login BERHASIL untuk email: ${email}`);
    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({ message: "Login berhasil!" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("ERROR LOGIN:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat login." },
      { status: 500 }
    );
  }
}

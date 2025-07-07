import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount >= 2) {
      return NextResponse.json(
        {
          message:
            "Registrasi tidak diizinkan karena jumlah admin sudah maksimal.",
        },
        { status: 403 }
      );
    }

    const { name, email, password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Password harus terdiri dari minimal 6 karakter." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...adminData } = newAdmin;

    return NextResponse.json(adminData, { status: 201 });
  } catch (error) {
    console.error("ERROR REGISTRASI:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan saat registrasi." },
      { status: 500 }
    );
  }
}

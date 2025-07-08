import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token dan password diperlukan." },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await db.query.admins.findFirst({
      where: and(
        eq(admins.passwordResetToken, hashedToken),
        gte(admins.passwordResetExpires, new Date())
      ),
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Token tidak valid atau telah kedaluwarsa." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(admins)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      })
      .where(eq(admins.id, admin.id));

    return NextResponse.json({ message: "Password berhasil direset!" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}

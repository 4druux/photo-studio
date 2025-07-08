// frontend/src/app/api/auth/forgot-password/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db"; // Impor koneksi Drizzle
import { admins } from "@/db/schema"; // Impor skema tabel admins
import { eq } from "drizzle-orm";
import { sendPasswordResetEmail } from "@/lib/mailer"; // Kita masih gunakan mailer yang sama

export async function POST(request) {
  try {
    const { email } = await request.json();

    const admin = await db.query.admins.findFirst({
      where: eq(admins.email, email),
    });

    if (admin) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // Token berlaku 10 menit

      await db
        .update(admins)
        .set({
          passwordResetToken: passwordResetToken,
          passwordResetExpires: passwordResetExpires,
        })
        .where(eq(admins.email, email));

      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

      await sendPasswordResetEmail({
        to: admin.email,
        name: admin.name,
        resetLink: resetUrl,
      });
    }

    // Selalu kembalikan respons sukses untuk mencegah user enumeration
    return NextResponse.json({
      message: "Jika email terdaftar, link reset telah dikirim.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}

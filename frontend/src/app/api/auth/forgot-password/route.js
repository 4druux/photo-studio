import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendPasswordResetEmail } from "@/lib/mailer";

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

      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

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

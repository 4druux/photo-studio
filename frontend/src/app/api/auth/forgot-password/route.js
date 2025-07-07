import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/mailer";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (admin) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.admin.update({
        where: { email },
        data: {
          passwordResetToken,
          passwordResetExpires,
        },
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

      await sendPasswordResetEmail({
        to: admin.email,
        name: admin.name,
        resetLink: resetUrl,
      });
    }

    return NextResponse.json({});
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}

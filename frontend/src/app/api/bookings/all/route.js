import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const sanitizedBookings = bookings.map((b) => ({
      ...b,
      tanggal: b.tanggal.toISOString(),
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));

    return NextResponse.json(sanitizedBookings, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data booking:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

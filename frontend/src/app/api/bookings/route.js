import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();

    const newBooking = await prisma.booking.create({
      data: {
        publicId: nanoid(10),
        nama: data.nama,
        telepon: data.telepon,
        paket: data.paket,
        tanggal: new Date(data.tanggal),
        catatan: data.catatan,
      },
    });

    return NextResponse.json(
      {
        message: "Booking berhasil dibuat!",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal membuat booking:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat membuat booking.",
      },
      { status: 500 }
    );
  }
}

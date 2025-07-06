import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();

    const bookingDateTimeString = `${data.date.split("T")[0]}T${data.time}:00`;
    const bookingDate = new Date(bookingDateTimeString);

    const newBooking = await prisma.booking.create({
      data: {
        publicId: nanoid(10),
        nama: data.nama,
        telepon: data.telepon,
        paket: data.paket,
        tanggal: bookingDate,
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

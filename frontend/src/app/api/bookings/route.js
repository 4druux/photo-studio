// File: src/app/api/booking/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();

    const bookingDate = new Date(data.date);
    const [hours, minutes] = data.time.split(":");
    bookingDate.setHours(hours, minutes);

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

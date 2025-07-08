import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  try {
    const data = await request.json();
    const newPublicId = nanoid(10);

    await db.insert(bookings).values({
      publicId: newPublicId,
      nama: data.nama,
      telepon: data.telepon,
      paket: data.paket,
      tanggal: new Date(data.tanggal),
      catatan: data.catatan,
      updatedAt: new Date(),
    });

    const createdBooking = await db.query.bookings.findFirst({
      where: eq(bookings.publicId, newPublicId),
    });

    if (!createdBooking) {
      throw new Error("Gagal mengambil data booking setelah dibuat.");
    }

    return NextResponse.json(
      {
        message: "Booking berhasil dibuat!",
        booking: createdBooking,
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

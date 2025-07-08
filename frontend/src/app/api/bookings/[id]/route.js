import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.publicId, id),
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data booking:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { message: "Nilai status tidak valid." },
        { status: 400 }
      );
    }

    const updatedResult = await db
      .update(bookings)
      .set({ status: status, updatedAt: new Date() })
      .where(eq(bookings.publicId, id));

    if (updatedResult.affectedRows === 0) {
      return NextResponse.json(
        { message: `Booking dengan ID ${id} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[ERROR_UPDATE_BOOKING_STATUS]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server saat memperbarui status." },
      { status: 500 }
    );
  }
}

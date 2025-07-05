import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const booking = await prisma.booking.findUnique({
      where: {
        publicId: id,
      },
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
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { message: "Nilai status tidak valid." },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        publicId: id,
      },
      data: {
        status: status,
      },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("[ERROR_UPDATE_BOOKING_STATUS]", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: `Booking dengan ID ${params.id} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server saat memperbarui status." },
      { status: 500 }
    );
  }
}

// File: src/app/api/booking/[id]/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const booking = await prisma.booking.findUnique({
      where: {
        id: parseInt(id, 10), 
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

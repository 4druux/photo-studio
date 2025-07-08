// frontend/src/app/api/bookings/all/route.js

import { NextResponse } from "next/server";
import { db } from "@/db"; // Impor koneksi Drizzle
import { bookings } from "@/db/schema"; // Impor skema tabel
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    // Menggunakan Drizzle untuk mengambil semua data dari tabel bookings
    // .orderBy() untuk mengurutkan, desc() untuk descending
    const allBookings = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));

    // Sanitasi data tidak lagi diperlukan karena Drizzle mengembalikan format yang sudah sesuai
    return NextResponse.json(allBookings, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data booking:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

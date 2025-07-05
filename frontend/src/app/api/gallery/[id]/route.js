import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { unlink } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const { id } = params; // 'id' di sini akan berisi nama file dari URL

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Nama file diperlukan." },
      { status: 400 }
    );
  }

  try {
    const image = await prisma.galleryImage.findUnique({
      where: { filename: id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Gambar tidak ditemukan di database." },
        { status: 404 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      image.filename
    );

    try {
      await unlink(filePath);
    } catch (fileError) {
      console.warn(
        `File fisik tidak ditemukan di server: ${filePath}, tapi akan tetap dihapus dari DB.`
      );
    }

    await prisma.galleryImage.delete({
      where: { filename: id },
    });

    return NextResponse.json({
      success: true,
      message: "Gambar berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error saat menghapus gambar:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

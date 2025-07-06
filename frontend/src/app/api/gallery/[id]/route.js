import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function DELETE(request, { params }) {
  const publicId = decodeURIComponent(params.id);

  if (!publicId) {
    return NextResponse.json(
      { success: false, message: "ID gambar diperlukan." },
      { status: 400 }
    );
  }

  try {
    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(new Error("Gagal berkomunikasi dengan Cloudinary."));
        }
        if (result.result === "not found") {
          console.warn(
            `File dengan public_id ${publicId} tidak ditemukan di Cloudinary, melanjutkan penghapusan dari DB.`
          );
        }
        resolve(result);
      });
    });

    await prisma.galleryImage.delete({
      where: { filename: publicId },
    });

    return NextResponse.json({
      success: true,
      message: "Gambar berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error saat menghapus gambar:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Gambar tidak ditemukan di database." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

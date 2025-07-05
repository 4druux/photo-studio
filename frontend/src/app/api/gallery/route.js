import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      include: {
        categories: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Ubah format data agar lebih mudah digunakan di frontend
    const formattedImages = images.map((img) => ({
      src: img.url,
      alt: img.filename,
      categories: img.categories.map((cat) => cat.name),
    }));

    // Dapatkan semua kategori unik dari database
    const categories = await prisma.category.findMany({
      select: { name: true },
    });
    const categoryNames = categories.map((cat) => cat.name);

    return NextResponse.json({
      images: formattedImages,
      categories: categoryNames,
    });
  } catch (error) {
    console.error("Gagal mengambil data galeri:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Pastikan route ini tidak di-cache agar data selalu baru
export const dynamic = "force-dynamic";

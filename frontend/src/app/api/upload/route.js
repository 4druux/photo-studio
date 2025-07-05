import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.formData();
    const files = data.getAll("images");
    const categoriesArray = data.getAll("categories");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    const uploadedFileNames = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const categories = JSON.parse(categoriesArray[i]);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, "_")}`;

      // Path ini sekarang akan valid karena folder `uploads` sudah ada
      const filePath = path.join(process.cwd(), "public", "uploads", filename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      // Logika untuk menyimpan ke database
      await prisma.galleryImage.create({
        data: {
          filename: filename,
          url: `/uploads/${filename}`,
          categories: {
            connectOrCreate: categories.map((categoryName) => ({
              where: { name: categoryName },
              create: { name: categoryName },
            })),
          },
        },
      });

      uploadedFileNames.push(filename);
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFileNames.length} gambar berhasil di-upload.`,
      fileNames: uploadedFileNames,
    });
  } catch (error) {
    console.error("Error di server:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan di server." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

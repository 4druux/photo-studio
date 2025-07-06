import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.formData();
    const files = data.getAll("images");
    const metadataArray = data.getAll("metadata");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    const uploadedFileNames = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const metadata = JSON.parse(metadataArray[i]);
      const { categories, width, height } = metadata;

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, "_")}`;
      const filePath = path.join(process.cwd(), "public", "uploads", filename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      await prisma.galleryImage.create({
        data: {
          filename: filename,
          url: `/uploads/${filename}`,
          width: width,
          height: height,
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
    console.error("Error di server saat upload:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

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

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const metadata = JSON.parse(metadataArray[i]);
      const { categories, width, height } = metadata;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "demo-photo-studio",
            },
            (error, result) => {
              if (error) {
                reject(error);
              }
              resolve(result);
            }
          )
          .end(buffer);
      });

      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Gagal mengunggah file ke Cloudinary.");
      }

      const newImage = await prisma.galleryImage.create({
        data: {
          filename: uploadResult.public_id,
          url: uploadResult.secure_url,
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
      uploadedImages.push(newImage);
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedImages.length} gambar berhasil di-upload.`,
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

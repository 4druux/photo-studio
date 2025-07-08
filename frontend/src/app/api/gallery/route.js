import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  galleryImages,
  categories,
  galleryImagesToCategories,
} from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";

export async function GET() {
  try {
    const allImages = await db
      .select()
      .from(galleryImages)
      .orderBy(desc(galleryImages.createdAt));

    if (allImages.length === 0) {
      const allCategories = await db
        .select({ name: categories.name })
        .from(categories);
      return NextResponse.json({
        images: [],
        categories: allCategories.map((c) => c.name),
      });
    }

    const relationsData = await db
      .select({
        imageId: galleryImagesToCategories.galleryImageId,
        categoryName: categories.name,
      })
      .from(galleryImagesToCategories)
      .innerJoin(
        categories,
        eq(galleryImagesToCategories.categoryId, categories.id)
      )
      .where(
        inArray(
          galleryImagesToCategories.galleryImageId,
          allImages.map((img) => img.id)
        )
      );

    const imageToCategoriesMap = new Map();
    for (const relation of relationsData) {
      if (!imageToCategoriesMap.has(relation.imageId)) {
        imageToCategoriesMap.set(relation.imageId, []);
      }
      imageToCategoriesMap.get(relation.imageId).push(relation.categoryName);
    }

    const formattedImages = allImages.map((img) => ({
      src: img.url,
      alt: img.filename,
      categories: imageToCategoriesMap.get(img.id) || [],
      aspectRatio: img.width && img.height ? img.width / img.height : 1,
    }));

    const allCategoryNames = await db
      .select({ name: categories.name })
      .from(categories);

    return NextResponse.json({
      images: formattedImages,
      categories: allCategoryNames.map((c) => c.name),
    });
  } catch (error) {
    console.error("Gagal mengambil data galeri:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server.", error: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

import {
  mysqlTable,
  int,
  varchar,
  text,
  datetime,
  mysqlEnum,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

export const admins = mysqlTable(
  "Admin",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    password: varchar("password", { length: 191 }).notNull(),
    createdAt: datetime("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updatedAt").notNull(),
    passwordResetToken: varchar("passwordResetToken", { length: 191 }),
    passwordResetExpires: datetime("passwordResetExpires"),
  },
  (table) => ({
    emailIdx: uniqueIndex("Admin_email_key").on(table.email),
    passwordResetTokenIdx: uniqueIndex("Admin_passwordResetToken_key").on(
      table.passwordResetToken
    ),
  })
);

export const bookings = mysqlTable(
  "Booking",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 191 }).notNull(),
    nama: varchar("nama", { length: 191 }).notNull(),
    telepon: varchar("telepon", { length: 191 }).notNull(),
    paket: varchar("paket", { length: 191 }).notNull(),
    tanggal: datetime("tanggal").notNull(),
    catatan: text("catatan"),
    status: mysqlEnum("status", ["PENDING", "CONFIRMED", "CANCELLED"])
      .default("PENDING")
      .notNull(),
    createdAt: datetime("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updatedAt").notNull(),
  },
  (table) => ({
    publicIdIdx: uniqueIndex("Booking_publicId_key").on(table.publicId),
  })
);

export const categories = mysqlTable(
  "Category",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex("Category_name_key").on(table.name),
  })
);

export const galleryImages = mysqlTable(
  "GalleryImage",
  {
    id: int("id").autoincrement().primaryKey(),
    filename: varchar("filename", { length: 191 }).notNull(),
    url: varchar("url", { length: 191 }).notNull(),
    width: int("width"),
    height: int("height"),
    createdAt: datetime("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    filenameIdx: uniqueIndex("GalleryImage_filename_key").on(table.filename),
  })
);

export const galleryImagesToCategories = mysqlTable(
  "_ImageToCategory",
  {
    galleryImageId: int("B")
      .notNull()
      .references(() => galleryImages.id, { onDelete: "cascade" }),
    categoryId: int("A")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.galleryImageId, t.categoryId] }),
  })
);

export const galleryImagesRelations = relations(galleryImages, ({ many }) => ({
  galleryImagesToCategories: many(galleryImagesToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  galleryImagesToCategories: many(galleryImagesToCategories),
}));

export const galleryImagesToCategoriesRelations = relations(
  galleryImagesToCategories,
  ({ one }) => ({
    galleryImage: one(galleryImages, {
      fields: [galleryImagesToCategories.galleryImageId],
      references: [galleryImages.id],
    }),
    category: one(categories, {
      fields: [galleryImagesToCategories.categoryId],
      references: [categories.id],
    }),
  })
);

// frontend/src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const admin = await db.query.admins.findFirst({
          where: eq(admins.email, credentials.email),
        });

        if (!admin) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        // Jika berhasil, kembalikan objek user
        return {
          id: admin.id.toString(), // Pastikan ID adalah string
          name: admin.name,
          email: admin.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Callback untuk menambahkan ID user ke token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Callback untuk menambahkan ID user dari token ke objek session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Tentukan halaman login kustom Anda
  },
  secret: process.env.NEXTAUTH_SECRET, // Pastikan variabel ini ada di file .env
  debug: process.env.NODE_ENV === "development", // Aktifkan debug hanya saat development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

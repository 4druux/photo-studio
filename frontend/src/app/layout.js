import "./globals.css";
import { Poppins } from "next/font/google";
import ToastProvider from "@/components/providers/ToastProvider";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Antika Studio",
  description:
    "Antika Studio adalah studio fotografi profesional yang menyediakan layanan foto pernikahan, potret keluarga, komersial, dan produk. Dilengkapi fasilitas studio modern dan tim fotografer berpengalaman, kami membantu Anda mengabadikan momen berharga dengan kualitas terbaik.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <NextAuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

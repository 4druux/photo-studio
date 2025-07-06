import { Suspense } from "react";
import Booking from "@/layout/user/booking/Booking";
import DotLoader from "@/components/loading/dotloader";

export const metadata = {
  title: "Konfirmasi Booking | Antika Studio",
  description:
    "Booking Anda di Antika Studio telah berhasil diterima. Lihat detail jadwal sesi foto Anda dan informasi langkah selanjutnya untuk konfirmasi pembayaran.",
};

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <Booking />
    </Suspense>
  );
}

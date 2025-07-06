import { Suspense } from "react";
import DotLoader from "@/components/loading/dotloader";
import FormBooking from "@/layout/user/booking/FormBooking";

export const metadata = {
  title: "Formulir Booking | Antika Studio",
  description:
    "Lengkapi data diri dan pilih jadwal untuk paket foto pilihan Anda di Antika Studio.",
};

export default function FormulirPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <FormBooking />
    </Suspense>
  );
}

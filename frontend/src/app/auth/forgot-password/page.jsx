import { Suspense } from "react";
import DotLoader from "@/components/loading/dotloader";
import ForgotPasswordForm from "@/layout/auth/ForgotPasswordForm";

export const metadata = {
  title: "Lupa Kata Sandi | Antika Studio",
  descriptioln:
    "Lupa kata sandi Anda di Antika Studio. Masukkan alamat email Anda dan kami akan mengirimkan instruksi untuk mereset kata sandi Anda.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}

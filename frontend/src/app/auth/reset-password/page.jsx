import { Suspense } from "react";
import DotLoader from "@/components/loading/dotloader";
import ResetPasswordForm from "@/layout/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Kata Sandi | Antika Studio",
  descriptioln:
    "Reset kata sandi Anda di Antika Studio. Masukkan alamat email Anda dan kami akan mengirimkan instruksi untuk mereset kata sandi Anda.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

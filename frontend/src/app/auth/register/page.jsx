import { Suspense } from "react";
import DotLoader from "@/components/loading/dotloader";
import SignUpForm from "@/layout/auth/SignUpForm";

export const metadata = {
  title: "Register | Antika Studio",
  descriptioln:
    "Daftar sebagai pengguna baru di Antika Studio. Masukkan informasi diri Anda dan buat akun Anda.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}

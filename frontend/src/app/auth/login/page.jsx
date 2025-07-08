import { Suspense } from "react";
import DotLoader from "@/components/loading/dotloader";
import SignInForm from "@/layout/auth/SignInForm";

export const metadata = {
  title: "Login | Antika Studio",
  descriptioln:
    "Login sebagai pengguna di Antika Studio. Masukkan email dan kata sandi Anda.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

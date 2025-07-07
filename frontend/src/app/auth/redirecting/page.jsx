
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DotLoader from "@/components/loading/dotloader"; 

export default function RedirectingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <DotLoader />
    </div>
  );
}

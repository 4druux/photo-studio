"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import DotLoader from "@/components/loading/dotloader";
import Image from "next/image";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setApiError("Token reset tidak valid atau tidak ditemukan.");
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "password") {
      setPassword(value);
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password baru wajib diisi.";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal harus 6 karakter.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi.";
    } else if (password && password !== confirmPassword) {
      newErrors.confirmPassword =
        "Password dan konfirmasi password tidak cocok.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal mereset password.");
      }

      toast.success("Password berhasil direset!");

      setTimeout(() => {
        setIsSuccess(true);
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setApiError(err.message || "Terjadi kesalahan.");
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <DotLoader />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-gray-100 shadow-md">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="logo antika studio"
            width={100}
            height={100}
            className="mx-auto w-[150px] h-[40px] object-cover"
          />
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-600">
            Reset <span className="text-teal-500">Password</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Masukkan password baru Anda di bawah ini.
          </p>
        </div>
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {apiError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{apiError}</span>
            </div>
          )}

          {token && (
            <>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password Baru
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                    errors.password || apiError
                      ? "border-red-500"
                      : "border-gray-300 focus:border-teal-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Konfirmasi Password
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                    errors.confirmPassword || apiError
                      ? "border-red-500"
                      : "border-gray-300 focus:border-teal-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 rounded-full hover:opacity-95 disabled:opacity-70 flex items-center justify-center transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-3" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <DotLoader />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

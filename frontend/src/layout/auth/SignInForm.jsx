"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import DotLoader from "@/components/loading/dotloader";
import Image from "next/image";
import { signIn } from "next-auth/react";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [canRegister, setCanRegister] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAdminCount = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (response.ok) {
          const data = await response.json();
          setCanRegister(data.canRegister);
        }
      } catch (error) {
        console.error("Gagal memeriksa status registrasi:", error);
      }
    };
    checkAdminCount();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPassword(value);
    }

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
    if (authError) {
      setAuthError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = "Email wajib diisi.";
    if (!password) newErrors.password = "Password wajib diisi.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    setAuthError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      // Untuk debugging, kita bisa lihat apa isi 'result'
      console.log("Login result:", result);

      if (result.error) {
        setIsLoading(false);
        setAuthError("Email atau Kata Sandi salah.");
      }
      if (result.error) {
        toast.error("Email atau Kata Sandi salah.");
      } else if (result.ok) {
        toast.success("Login berhasil!");
        router.push("/admin/booking");
      } else {
        setIsLoading(false);
        toast.error("Login gagal karena alasan yang tidak diketahui.");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Terjadi kesalahan yang tidak terduga.");
      console.error("Login error:", error);
    }
  };

  if (isRedirecting) {
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

        <h1 className="text-2xl font-semibold text-center text-gray-600">
          Admin <span className="text-teal-500 ml-1">Login</span>
        </h1>
        <form noValidate onSubmit={handleSubmit}>
          {authError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{authError}</span>
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Email Anda"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                errors.email || authError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleInputChange}
              placeholder="Password Anda"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                errors.password || authError
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

          <p className="text-sm text-end font-medium text-teal-600 my-2 hover:underline">
            <Link href="/auth/forgot-password">lupa kata sandi?</Link>
          </p>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 rounded-full hover:opacity-95 disabled:opacity-70 flex items-center justify-center transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-3" />
                  <span>Loading...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        {canRegister && (
          <p className="text-sm text-center text-gray-600">
            Tidak punya akun?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-teal-600 hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

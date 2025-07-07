
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import DotLoader from "@/components/loading/dotloader";
import Image from "next/image";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    const checkAdminCount = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        setIsAllowed(data.canRegister);
      } catch (error) {
        console.error("Gagal memeriksa jumlah admin:", error);
      } finally {
        setIsChecking(false);
      }
    };
    checkAdminCount();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "name") {
      setName(value);
    } else if (id === "email") {
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

    if (!name) newErrors.name = "Nama wajib diisi.";
    if (!email) {
      newErrors.email = "Email wajib diisi.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!password) {
      newErrors.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.message || "Terjadi kesalahan saat registrasi.");
        return;
      }
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/auth/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <DotLoader />
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold text-red-500">
          Pendaftaran Tidak Tersedia
        </h1>
        <p className="mt-2 text-gray-600">Jumlah admin sudah maksimal.</p>
        <Link
          href="/auth/login"
          className="mt-4 px-6 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
        >
          Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-gray-100 shadow-md">
        <Image
          src="/images/logo.png"
          alt="logo antika studio"
          width={100}
          height={100}
          className="mx-auto w-[150px] h-[40px] object-cover"
        />

        <h1 className="text-2xl font-semibold text-center text-gray-600">
          Admin <span className="text-teal-500 ml-1">Register</span>
        </h1>
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{authError}</span>
            </div>
          )}
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleInputChange}
              placeholder="Nama Anda"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
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
          <div className="relative">
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
                errors.password
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
                "Register"
              )}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-teal-600 hover:underline"
          >
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

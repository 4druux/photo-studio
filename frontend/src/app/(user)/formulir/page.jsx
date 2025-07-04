"use client";

import { useSearchParams } from "next/navigation";

// Contoh data untuk mencocokkan query dengan nama lengkap paket
const packageNames = {
  pelajar: "Paket Pelajar",
  standar: "Paket Standar",
  medium: "Paket Medium",
  pro: "Paket Pro",
};

export default function FormulirPage() {
  const searchParams = useSearchParams();
  const selectedPackageQuery = searchParams.get("paket");
  const selectedPackageName =
    packageNames[selectedPackageQuery] || "Tidak Diketahui";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Formulir Booking
        </h2>
        <p className="text-gray-500 mb-8">
          Paket Pilihan:{" "}
          <span className="font-semibold text-red-500">
            {selectedPackageName}
          </span>
        </p>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Telepon
            </label>
            <input
              type="tel"
              id="phone"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Tanggal Pilihan
            </label>
            <input
              type="date"
              id="date"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
          >
            Kirim Pengajuan
          </button>
        </form>
      </div>
    </div>
  );
}

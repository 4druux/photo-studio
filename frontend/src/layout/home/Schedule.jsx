"use client";

import Link from "next/link";
import { Users, Star, Crown, Rocket } from "lucide-react";
import ButtonTextFlip from "@/components/button/ButtonTextFlip";
import Tittle from "@/components/text/Tittle";
import Description from "@/components/text/Description";

// --- DATA PAKET BARU (tetap sama) ---
const schedulePackages = [
  {
    icon: Star,
    title: "Paket Pelajar",
    features: [
      "1 Orang",
      "Durasi Foto 5 Menit",
      "All Soft File via GDrive (berlaku 1 hari)",
    ],
    price: "Rp 10.000",
    query: "pelajar",
  },
  {
    icon: Users,
    title: "Paket Standar",
    features: [
      "3 Orang",
      "Durasi Foto 15 Menit",
      "All Soft File via GDrive (berlaku 3 hari)",
    ],
    price: "Rp 45.000",
    query: "standar",
  },
  {
    icon: Crown,
    title: "Paket Medium",
    features: [
      "5 Orang",
      "Durasi Foto 20 Menit",
      "All Soft File via GDrive (berlaku 7 hari)",
    ],
    price: "Rp 100.000",
    query: "medium",
  },
  {
    icon: Rocket,
    title: "Paket Pro",
    features: [
      "8 Orang",
      "Durasi Foto 25 Menit",
      "All Soft File via GDrive (berlaku 1 bulan)",
      "Free Custom & 3 Spot Foto",
      "Free Wifi & Fotografer",
      "Termasuk Jasa Edit",
    ],
    price: "Rp 160.000",
    query: "pro",
  },
];

export default function Schedule() {
  return (
    <section id="schedule" className="pt-12 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4 lg:mb-8">
          <Tittle text="Pesan Jadwal Anda" />
          <Description
            text="Pilih paket yang paling sesuai dengan kebutuhan Anda dan booking sesi foto Anda hari ini."
            className="mt-2 max-w-2xl mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {schedulePackages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.query}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center flex flex-col cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mx-auto bg-sky-100 text-sky-500 p-4 rounded-full mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {pkg.title}
                </h3>
                <p className="text-3xl font-semibold text-sky-500 mb-4">
                  {pkg.price}
                </p>

                <ul className="text-gray-500 text-sm space-y-2 text-left px-4 flex-grow mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">&#10003;</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <ButtonTextFlip
                  href={`/formulir?paket=${pkg.query}`}
                  label="Booking Sekarang"
                  hoverLabel="Booking Sekarang"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

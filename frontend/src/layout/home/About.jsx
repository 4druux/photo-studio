"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaPalette, FaTags, FaLock, FaBoxOpen } from "react-icons/fa";

// Data fitur yang sudah di-improve dengan ikon
const features = [
  {
    icon: FaPalette,
    title: "Kontrol Kreatif Penuh",
    description:
      "Anda memiliki kendali atas semua aspek, mulai dari pencahayaan, latar, hingga sudut pengambilan gambar.",
  },
  {
    icon: FaTags,
    title: "Harga Kompetitif",
    description:
      "Nikmati kualitas foto profesional tanpa perlu membayar biaya yang mahal. Solusi terbaik untuk budget Anda.",
  },
  {
    icon: FaLock,
    title: "Sesi Foto Privat",
    description:
      "Kami menyediakan lingkungan yang tenang dan intim untuk sesi foto personal Anda, bebas dari gangguan.",
  },
  {
    icon: FaBoxOpen,
    title: "Properti & Latar Lengkap",
    description:
      "Pilih dari berbagai latar belakang dan properti unik untuk menciptakan foto dengan tampilan yang berbeda-beda.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function About() {
  return (
    <section className="relative w-full py-24 md:py-60 mt-16 overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/waves.png"
          alt="Abstract wave background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      <motion.div
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-medium mb-12 tracking-tight"
          variants={itemVariants}
        >
          Kenapa Memilih Studio Kami?
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-left hover:bg-white/20 transition-colors duration-300"
                variants={itemVariants}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

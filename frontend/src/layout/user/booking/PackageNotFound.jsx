"use client";

import { motion } from "framer-motion";
import ButtonTextFlip from "@/components/button/ButtonTextFlip";

export default function PackageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-6xl font-extrabold text-teal-500"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-2 text-xl font-medium text-gray-500"
        >
          Paket tidak ditemukan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.9,
            type: "spring",
            stiffness: 120,
          }}
          className="mt-6"
        >
          <ButtonTextFlip
            label="Kembali"
            hoverLabel="Kembali"
            href="/"
            className="flex"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

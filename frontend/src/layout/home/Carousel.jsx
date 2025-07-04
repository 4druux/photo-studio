"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import { motion } from "framer-motion";
import ButtonAnimation from "@/components/button/ButtonAnimation";

export default function Carousel() {
  const ref = useRef(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaRef.current) {
      vantaRef.current = FOG({
        el: ref.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: 0xffffff,
        midtoneColor: 0x38bdf8,
        lowlightColor: 0x0c4a6e,
        baseColor: 0xffffff,
        blurFactor: 0.62,
        speed: 2.4,
      });
    }

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] text-white overflow-hidden">
      <div ref={ref} className="absolute inset-0 w-full h-full z-0" />

      <div className="relative z-10 container mx-auto h-full flex">
        <div className="flex space-x-12 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
            >
              Abadikan Momen{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-sky-200 via-sky-500 to-blue-500">
                Berhargamu
              </span>
            </h1>
            <p
              className="text-lg md:text-xl text-gray-50 mb-4"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
            >
              Studio foto profesional dengan konsep modern untuk setiap momen
              spesial dalam hidup Anda.
            </p>

            <ButtonAnimation
              href="#schedule"
              label="Booking Sekarang"
              hoverLabel="Booking Sekarang?"
              className="shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden md:flex justify-center"
          >
            <div className="relative w-[350px] h-[350px] lg:w-[450px] lg:h-[450px]">
              <Image
                src="/path/to/your/photo.png"
                alt="Contoh Hasil Foto Studio"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-3xl shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

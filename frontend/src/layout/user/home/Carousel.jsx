"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import { motion } from "framer-motion";
import ButtonAnimation from "@/components/button/ButtonAnimation";
import {
  carouselTextVariants,
  carouselImageVariants,
} from "@/utils/animations";

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
        <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-12 items-center justify-center md:justify-between">
          <motion.div
            variants={carouselTextVariants}
            initial="hidden"
            animate="visible"
            className="text-center md:text-left space-y-2 md:space-y-4"
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
            >
              Abadikan Momen{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-sky-200 via-sky-500 to-blue-500">
                Berhargamu
              </span>
            </h1>
            <p
              className="text-lg md:text-xl text-gray-50"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
            >
              Dengan tim profesional dan suasana yang nyaman, kami bantu
              abadikan momen terbaik kamu, tanpa ribet.
            </p>

            <ButtonAnimation
              href="#schedule"
              label="Booking Sekarang"
              hoverLabel="Booking Sekarang?"
              className="shadow-md"
            />
          </motion.div>

          <motion.div
            variants={carouselImageVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <div className="relative w-[350px] h-[350px] lg:w-[450px] lg:h-[450px]">
              <Image
                src="/images/carousel.jpg"
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

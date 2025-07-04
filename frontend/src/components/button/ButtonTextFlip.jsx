"use client";
import React from "react";
import Link from "next/link";

export default function ButtonTextFlip({
  href = "/",
  className = "",
  label = "",
  hoverLabel = "",
}) {
  return (
    <Link
      href={href}
      className={`px-6 py-3 rounded-full shadow-md overflow-hidden bg-gradient-to-br from-sky-200 via-sky-500 to-blue-500 group cursor-pointer ${className}`}
    >
      <div className="perspectiveText relative flex flex-col justify-center items-center w-full h-full [transform-style:preserve-3d] transition-transform duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:[transform:rotateX(-90deg)]">
        <p className="text-gray-100 text-md font-semibold m-0 transition-all duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)] pointer-events-none group-hover:-translate-y-full group-hover:opacity-0">
          {label}
        </p>

        <p className="text-white text-md font-semibold m-0 absolute inset-0 flex items-center justify-center transition-all duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)] pointer-events-none origin-bottom [transform:rotateX(90deg)_translateY(11px)] opacity-0 group-hover:opacity-100">
          {hoverLabel}
        </p>
      </div>
    </Link>
  );
}

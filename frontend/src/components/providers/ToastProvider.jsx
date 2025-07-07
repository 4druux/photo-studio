"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider({ children }) {
  return (
    <>
      <Toaster
        duration={5000}
        position="top-right"
        reverseOrder={true}
        toastOptions={{ className: "custom-toast" }}
      />
      {children}
    </>
  );
}

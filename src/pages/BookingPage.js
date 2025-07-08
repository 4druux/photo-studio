import React, { Suspense } from "react";
import Booking from "../components/booking/Booking";
import DotLoader from "../components/loading/DotLoader";

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <Booking />
    </Suspense>
  );
}
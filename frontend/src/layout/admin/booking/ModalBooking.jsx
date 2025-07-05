"use client";

import { Fragment } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Utility untuk format tanggal
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Badge status sama seperti di Booking
const StatusBadge = ({ status }) => {
  const base = "px-3 py-1 text-xs font-medium rounded-full";
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return <span className={`${base} ${styles[status]}`}>{status}</span>;
};

export default function ModalBooking({ booking, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop, klik di luar modal menutup */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Konten Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()} // mencegah klik di konten menutup
          >
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  Detail Booking
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Nama:</span> {booking.nama}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Kontak:</span> {booking.telepon}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Paket:</span> {booking.paket}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Jadwal Sesi:</span>{" "}
                  {formatDate(booking.tanggal)}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Status:</span>
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

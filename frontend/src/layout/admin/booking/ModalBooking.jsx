import React from "react";
import { X, Package, FileText, CalendarClock, User, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { schedulePackages } from "@/data/packages";

const formatSessionDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const formatCreationDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
export default function ModalBooking({ booking, isOpen, onClose }) {
  const pkg = schedulePackages.find((p) => p.title === booking.paket);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-medium text-gray-600">
                Detail Booking
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-6">
              {/* Meta Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full font-mono">
                    FOTO-{booking.id.toString().padStart(5, "0")}
                  </span>
                  <span className="text-sm text-gray-500">
                    Dibuat: {formatCreationDate(booking.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Customer & Schedule Details */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="flex items-center text-gray-500 text-sm font-medium">
                    <User className="w-4 h-4 mr-1" /> Nama
                  </dt>
                  <dd className="mt-1 text-gray-800">{booking.nama}</dd>
                </div>
                <div>
                  <dt className="flex items-center text-gray-500 text-sm font-medium">
                    <Phone className="w-4 h-4 mr-1" /> Kontak
                  </dt>
                  <dd className="mt-1 text-gray-800">{booking.telepon}</dd>
                </div>
                <div>
                  <dt className="flex items-center text-gray-500 text-sm font-medium">
                    <CalendarClock className="w-4 h-4 mr-1" /> Jadwal Sesi
                  </dt>
                  <dd className="mt-1 text-gray-800">
                    {formatSessionDate(booking.tanggal)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-sm font-medium">Paket</dt>
                  <dd className="mt-1 text-gray-800">{booking.paket}</dd>
                </div>
              </dl>

              {/* Package Details */}
              {pkg && (
                <div className="border border-sky-200 p-4 rounded-lg bg-sky-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-sky-600" />
                      <h3 className="text-lg font-semibold text-sky-800">
                        {pkg.title}
                      </h3>
                    </div>
                    <span className="text-xl font-bold text-sky-600">
                      {pkg.price}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-sky-700 space-y-1 pl-4 text-sm">
                    {pkg.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {booking.catatan && (
                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center mb-2 text-gray-700">
                    <FileText className="w-5 h-5 mr-2" />
                    <h4 className="font-semibold">Catatan Pemesan</h4>
                  </div>
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">
                    {booking.catatan}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { X, Package, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { schedulePackages } from "@/data/packages";

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

// Badge status
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
  const packageDetails = schedulePackages.find(
    (pkg) => pkg.title === booking.paket
  );

  return (
    <AnimatePresence>
      {isOpen && (
        // Wrapper ini berfungsi sebagai overlay/backdrop
        // Klik di sini akan menutup modal
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 border-b pb-3">
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

            <div className="space-y-4">
              {/* Informasi Pemesan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Nama</p>
                  <p className="text-gray-800">{booking.nama}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Kontak</p>
                  <p className="text-gray-800">{booking.telepon}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Jadwal Sesi</p>
                  <p className="text-gray-800">{formatDate(booking.tanggal)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-500">Status:</p>
                  <StatusBadge status={booking.status} />
                </div>
              </div>

              {/* Detail Paket */}
              {packageDetails && (
                <div className="bg-sky-50 border border-sky-100 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Package className="w-5 h-5 text-sky-600 mr-2" />
                    <h4 className="font-semibold text-sky-800">
                      {packageDetails.title}
                    </h4>
                    <p className="ml-auto font-bold text-sky-600">
                      {packageDetails.price}
                    </p>
                  </div>
                  <ul className="list-disc list-inside text-xs text-sky-700 space-y-1 pl-2">
                    {packageDetails.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Catatan/Deskripsi */}
              {booking.catatan && (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">
                      Catatan dari Pemesan
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
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

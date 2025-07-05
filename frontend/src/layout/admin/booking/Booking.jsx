"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import ModalBooking from "./ModalBooking";
import DotLoader from "@/components/loading/dotloader";

const fetcher = (url) => fetch(url).then((res) => res.json());

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

const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  const statusClasses = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

export default function Booking() {
  const {
    data: bookings,
    error,
    mutate,
  } = useSWR("/api/bookings/all", fetcher, {
    revalidateOnFocus: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 20;

  const totalPages = bookings ? Math.ceil(bookings.length / itemsPerPage) : 0;

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleStatusChange = async (publicId, newStatus) => {
    try {
      const response = await fetch(`/api/bookings/${publicId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengubah status");
      }

      mutate(); // Trigger SWR to re-fetch data

      toast.success("Status berhasil diperbarui!", {
        className: "custom-toast",
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui status.", { className: "custom-toast" });
    }
  };

  if (error) return <div>Gagal memuat data...</div>;
  if (!bookings)
    return (
      <div className="flex justify-center items-center h-full">
        <DotLoader text="Memuat data booking..." />
      </div>
    );

  const displayedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-0 lg:p-8">
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <h1 className="text-lg font-semibold text-gray-600 p-6">
          Kelola Daftar Booking
        </h1>
        <div className="overflow-x-auto px-6 pb-2">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jadwal Sesi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedBookings.map((booking) => (
                <tr
                  key={booking.publicId}
                  onClick={() => openModal(booking)}
                  className="even:bg-gray-50 odd:bg-white hover:bg-sky-50 hover:cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                    {booking.nama}
                  </td>
                  <td className="px-6 py-4">{booking.telepon}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.paket}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(booking.tanggal)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking.publicId, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-full focus:ring-sky-500 focus:border-sky-500 block w-full p-2"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-end items-center space-x-4 pr-6 py-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-white border rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-white border rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdKeyboardDoubleArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="lg:hidden space-y-4 p-4">
        <h1 className="text-md  font-semibold text-gray-600">
          Kelola Daftar Booking
        </h1>
        {displayedBookings.map((booking) => (
          <div
            key={booking.publicId}
            onClick={() => openModal(booking)}
            className="bg-white rounded-2xl shadow-md p-4 hover:cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Nama</p>
                  <p className="text-sm font-medium text-gray-700">
                    {booking.nama}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kontak</p>
                  <p className="text-sm font-medium text-gray-700">
                    {booking.telepon}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Paket</p>
                  <p className="text-sm font-medium text-gray-700">
                    {booking.paket}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <StatusBadge status={booking.status} />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs text-gray-500 mb-1">Aksi</p>
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking.publicId, e.target.value)
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-sky-500 focus:border-sky-500 block w-full p-2"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Jadwal Sesi</p>
              <p className="text-sm font-medium text-gray-700">
                {formatDate(booking.tanggal)}
              </p>
            </div>
          </div>
        ))}

        {/* Mobile/Tablet Pagination */}
        <div className="flex justify-center items-center space-x-4 pt-4 pb-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-white border rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-white border rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdKeyboardDoubleArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Component */}
      {selectedBooking && (
        <ModalBooking
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

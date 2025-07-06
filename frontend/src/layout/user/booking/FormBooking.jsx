"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import useSWR from "swr";
import { schedulePackages } from "@/data/packages";
import BookingCalendar from "@/components/BookingCalendar";
import PackageNotFound from "@/layout/user/booking/PackageNotFound";
import { containerVariants, itemVariants } from "@/utils/animations";

const PHONE_PREFIX = "+62";

const formatPhoneNumber = (value) => {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "");
  const match = numbers.match(/^(\d{1,3})(\d{0,4})(\d{0,5})$/);
  if (match) {
    const [, part1, part2, part3] = match;
    let formatted = part1;
    if (part2) formatted += `-${part2}`;
    if (part3) formatted += `-${part3}`;
    return formatted;
  }
  return numbers;
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FormBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paketQuery = searchParams.get("paket");

  const { data: bookings } = useSWR("/api/bookings/all", fetcher);

  const selectedPackage = schedulePackages.find(
    (pkg) => pkg.query === paketQuery
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
  });
  const [formattedPhone, setFormattedPhone] = useState("");
  const [bookingDetails, setBookingDetails] = useState({
    date: null,
    time: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (rawNumber) => {
    let error = "";
    if (!rawNumber) {
      error = "";
    } else if (!rawNumber.startsWith("8")) {
      error = "Harus diawali angka 8.";
    } else if (rawNumber.length < 9 || rawNumber.length > 12) {
      error = "Harus terdiri dari 9-12 digit.";
    }
    setErrors((prev) => ({ ...prev, phoneFormat: error }));
    return error;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 12) {
        setFormData((prev) => ({ ...prev, phone: numericValue }));
        setFormattedPhone(formatPhoneNumber(numericValue));
        setErrors((prev) => ({ ...prev, phone: "" }));
        validatePhoneNumber(numericValue);
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
      if (id === "name") setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleDateTimeChange = (details) => {
    setBookingDetails(details);
    if (details.date && details.time) {
      setErrors((prev) => ({ ...prev, date: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setErrors({});
    let formIsValid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi.";
      formIsValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi.";
      formIsValid = false;
    }
    if (!bookingDetails.date || !bookingDetails.time) {
      newErrors.date = "Tanggal & waktu wajib dipilih.";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (!formIsValid) return;

    setIsLoading(true);

    const [hour, minute] = bookingDetails.time.split(":");
    const bookingDateTime = new Date(bookingDetails.date);
    bookingDateTime.setHours(hour, minute, 0, 0);

    const payload = {
      nama: formData.name,
      telepon: `${PHONE_PREFIX}${formData.phone}`,
      paket: selectedPackage.title,
      tanggal: bookingDateTime.toISOString(),
      catatan: formData.description,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal mengirim data.");
      setFormData({ name: "", phone: "", description: "" });
      setFormattedPhone("");
      setBookingDetails({ date: null, time: null });
      router.push(`/booking?id=${result.booking.publicId}`);
    } catch (error) {
      setErrors({ submit: error.message || "Terjadi kesalahan pada server." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPackage) {
    return <PackageNotFound />;
  }

  const { title, features, price } = selectedPackage;
  const isPhoneInvalid = errors.phone || errors.phoneFormat;

  const bookedDates = bookings
    ? bookings.map((booking) => new Date(booking.tanggal).toISOString())
    : [];

  return (
    <div className="min-h-screen p-0 md:p-12">
      <motion.div
        className="max-w-2xl mx-auto bg-white p-4 md:p-6 md:rounded-2xl shadow-md pb-12 md:mb-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center text-gray-700 mb-2">
            <Link href="/#schedule">
              <ArrowLeft className="inline-block mr-1 cursor-pointer hover:scale-105 transition-transform duration-300" />
            </Link>
            <h2 className="text-lg lg:text-xl font-semibold">
              Formulir Booking
            </h2>
          </div>
          <p className="text-sm lg:text-base text-gray-500 mb-4">
            Lengkapi data diri, deskripsi opsional, dan pilih jadwal Anda.
          </p>
        </motion.div>
        <motion.div
          className="bg-teal-50 border border-teal-200 p-4 rounded-xl mb-4 space-y-3"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold text-teal-800">{title}</h3>
          <p className="text-2xl font-bold text-teal-600">{price}</p>
          <ul className="text-teal-700 text-sm space-y-2 pt-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center">
                <span className="text-green-500 mr-2">&#10003;</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <div
          className="space-y-6"
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        >
          <motion.div variants={itemVariants}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`block w-full border shadow-sm py-2 px-3 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nomor Telepon
            </label>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-3 py-2 border border-r-0 bg-gray-50 text-gray-500 rounded-l-lg ${
                  isPhoneInvalid ? "border-red-500" : "border-gray-300"
                }`}
              >
                +62
              </span>
              <input
                type="tel"
                id="phone"
                value={formattedPhone}
                onChange={handleInputChange}
                placeholder="812-3456-7890"
                className={`block w-full border shadow-sm py-2 px-3 rounded-r-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                  isPhoneInvalid ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
            {errors.phoneFormat && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneFormat}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal & Waktu Pilihan
            </label>
            <BookingCalendar
              onDateTimeChange={handleDateTimeChange}
              bookedDates={bookedDates}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Deskripsi (Opsional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="block w-full border border-gray-300 shadow-sm py-2 px-3 rounded-lg min-h-[100px] focus:outline-none `focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 placeholder:text-sm`"
              placeholder="Detail tambahan tentang sesi foto Anda..."
            />
          </motion.div>

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 rounded-full font-semibold text-white flex items-center justify-center ${
              isLoading
                ? "bg-teal-400 cursor-not-allowed"
                : "bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 hover:bg-none hover:bg-teal-600 hover:shadow-md"
            }`}
            variants={itemVariants}
          >
            {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-3" />}
            {isLoading ? "Mengirim..." : "Booking Sekarang"}
          </motion.button>

          {errors.submit && (
            <p className="text-red-500 text-xs mt-1 text-center">
              {errors.submit}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

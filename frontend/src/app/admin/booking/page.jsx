import Booking from "@/layout/admin/booking/Booking";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getBookings() {
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return bookings.map((b) => ({
    ...b,
    tanggal: b.tanggal.toISOString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));
}

export const metadata = {
  title: "Request Booking | Admin Antika Studio",
  description: "Kelola permintaan booking yang masuk.",
};

export default async function RequestBookingPage() {
  const initialBookings = await getBookings();

  return <Booking initialBookings={initialBookings} />;
}

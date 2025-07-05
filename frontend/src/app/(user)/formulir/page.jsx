import { schedulePackages } from "@/data/packages";
import FormBooking from "@/layout/booking/FormBooking";
import PackageNotFound from "@/layout/booking/PackageNotFound";

export const metadata = {
  title: "Formulir Booking | Antika Studio",
  description:
    "Lengkapi formulir booking untuk paket pilihan Anda di Antika Studio.",
};

export default function FormulirPage({ searchParams }) {
  const selectedPackage = schedulePackages.find(
    (pkg) => pkg.query === searchParams.paket
  );

  if (!selectedPackage) {
    return <PackageNotFound />;
  }

  const packageForClient = {
    title: selectedPackage.title,
    features: selectedPackage.features,
    price: selectedPackage.price,
  };

  return <FormBooking selectedPackage={packageForClient} />;
}


export default function AuthLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main>{children}</main>
    </div>
  );
}

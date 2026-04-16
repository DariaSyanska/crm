import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl shadow-lg p-8 border">
        <h1 className="text-3xl font-bold mb-4">CRM Frontend</h1>
        <p className="text-gray-600 mb-6">
          Login to the customer relationship management system.
        </p>
        <Link
          href="/login"
          className="block text-center rounded-xl bg-black text-white px-4 py-3"
        >
          Go to Login
        </Link>
      </div>
    </main>
  );
}

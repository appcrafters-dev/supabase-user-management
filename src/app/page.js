import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Platform</h1>
        <p className="text-lg mb-12">Please log in or sign up to continue</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Signup
          </Link>
        </div>
      </div>
    </>
  );
}

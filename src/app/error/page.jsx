import Link from 'next/link';

export default function ErrorPage({ errorMessage }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <div className="max-w-lg bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-4">Error</h1>
      <p className="text-gray-300 mb-4">{errorMessage}</p>
      <p className="text-gray-300 mb-4">
        Please try again later or contact support if the problem persists.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to home
      </Link>
    </div>
  </div>
);
}

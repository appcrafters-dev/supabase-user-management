'use client'
import { login } from "../actions"
import Link from 'next/link'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault(); 
    const formData = new FormData(event.target); 

    try {
      const data = await login(formData);

      router.replace('/profile');
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form className="w-full max-w-sm bg-gray-800 rounded-lg shadow-md p-6" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Welcome Back</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="off"
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="off"
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
          />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log in
          </button>
        </div>
        <div className="mt-4 text-center">
          <Link href="/signup" className="text-sm font-medium text-gray-300 hover:text-white">
            Do not have an account? Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { signup } from '../actions';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    website: '',
    avatar_url: '',
    password: '',
    avatar_file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar_file') {
      setFormData((prevData) => ({
        ...prevData,
        avatar_url: '', 
        avatar_file: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataInstance = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataInstance.append(key, formData[key]);
      }
    }
    await signup(formDataInstance);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-300">Full Name</label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              required
              autoComplete="off"
              value={formData.fullname}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="off"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="website" className="block text-sm font-medium text-gray-300">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="avatar_file" className="block text-sm font-medium text-gray-300">Upload Profile Photo</label>
            <input
              id="avatar_file"
              name="avatar_file"
              type="file"
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">
          Already have an account? Log in
        </Link>
      </div>
    </>
  );
}

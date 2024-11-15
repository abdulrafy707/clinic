<<<<<<< HEAD
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    address: '',
    role: 'DOCTOR',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

=======
// app/signup/page.js

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    address: '',
    role: 'USER', // Default role can be set to 'USER' or other roles as necessary
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

>>>>>>> be7b3cb5cd7ee7013e5cf7ebc8d8e756d8398f1f
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
<<<<<<< HEAD
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Account created successfully!')
        router.push('/login')
      } else {
        setMessage(data.error || 'Failed to create account.')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
      console.error('Error submitting signup form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-3">
      <div className="grid w-full max-w-6xl gap-8 md:grid-cols-2">
        {/* Left Side - Content */}
        <div className="flex flex-col justify-center ">
          <Link href="/" className="mb-12 text-4xl font-bold text-indigo-600">
            Scribe
          </Link>

          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            You&apos;re 20 seconds away from totally automatic medical records 🎉
          </h1>

          <div className="space-y-4 text-gray-600">
            <p className="flex items-center gap-2">
              ✨ Get 50 free Automatic Medical Records just by signing up.
            </p>
            <p className="flex items-center gap-2">
              🎯 We&apos;ll make it easy for you - no demo, onboarding call, or credit card is required!
            </p>
            <p className="flex items-center gap-2">
              💬 If you need help though, please contact us!
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center bg-white p-3 md:p-8 rounded-xl shadow-md shadow-indigo-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Dr. Jane Smith"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="jane@clinic.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="(555) 555-5555"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="California"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Clinic Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="123 Medical Center Dr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-gray-900 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {message && (
              <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full rounded-lg bg-indigo-600 px-8 py-3 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating your account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
=======
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'User created successfully!');
        router.push('/login'); // Redirect to login after successful signup
      } else {
        setMessage(data.error || 'Failed to create user.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error submitting signup form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Left Side - Signup Form */}
      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Fields */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          >
            
            <option value="DOCTOR">Doctor</option>
       
            {/* Add more roles as needed */}
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 col-span-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors col-span-2"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>

      {/* Right Side - Image or Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg items-center justify-center">
        <h2 className="text-4xl font-bold text-white px-6">Join Us Today</h2>
      </div>
    </div>
  );
};

export default SignupPage;
>>>>>>> be7b3cb5cd7ee7013e5cf7ebc8d8e756d8398f1f

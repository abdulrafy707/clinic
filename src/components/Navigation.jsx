'use client'
import Link from 'next/link'
import { useState } from 'react'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <nav className="bg-white px-4 py-4 shadow-md">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Scribe
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 md:flex">
              <Link href="/pricing" className="text-gray-600 hover:text-indigo-600">
                Pricing
              </Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-indigo-600">
                Testimonials
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-indigo-600">
                About Us
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-indigo-600">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-indigo-600">
                Contact
              </Link>
              <Link
                href="/signin"
                className="rounded-full border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-600 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="block md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6 text-indigo-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-4 md:hidden">
              <div className="flex flex-col space-y-4">
                <Link href="/pricing" className="text-gray-600 hover:text-indigo-600">
                  Pricing
                </Link>
                <Link href="/testimonials" className="text-gray-600 hover:text-indigo-600">
                  Testimonials
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-indigo-600">
                  About Us
                </Link>
                <Link href="/blog" className="text-gray-600 hover:text-indigo-600">
                  Blog
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-indigo-600">
                  Contact
                </Link>
                <Link
                  href="/signin"
                  className="rounded-full border border-indigo-600 px-4 py-2 text-center text-indigo-600 hover:bg-indigo-600 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-indigo-600 px-4 py-2 text-center text-white hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
  )
}

export default Navigation
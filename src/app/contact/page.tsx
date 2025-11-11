'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
            🐄 Cowtion
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-red-600 transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-red-600 transition">
              About
            </Link>
            <Link href="/contact" className="text-red-600 font-semibold">
              Contact
            </Link>
            <Link href="/terms-privacy" className="hover:text-red-600 transition">
              Terms & Privacy
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b-2 border-red-100">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Have questions? We'd love to hear from you!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>

            {/* Email Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">📧</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600">For general inquiries and support</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-red-600 mb-4">cowtionhelp@gmail.com</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
              >
                View Details
              </button>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">📱</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Phone</h3>
                  <p className="text-gray-600">For urgent support and assistance</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-4">+91 123-665-578</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>

            {/* Response Time */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-8 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-600 mb-3">📬 Response Time</h3>
              <p className="text-gray-700">
                We typically respond to all inquiries within <span className="font-bold">24-48 hours</span>. 
                For urgent matters, please call us directly.
              </p>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How Can We Help?</h2>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">We're here to help with:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Bug reports and technical issues</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Feature requests and suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Account and registration help</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Media inquiries and partnerships</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">General questions about Cowtion</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Safety and road hazard reporting</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/about" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold">
                  → Learn More About Cowtion
                </Link>
                <Link href="/terms-privacy" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold">
                  → Terms & Privacy Policy
                </Link>
                <Link href="/home" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold">
                  → View Live Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Details</h2>

            {/* Email Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📧</span>
                <h3 className="text-lg font-bold text-gray-900">Email</h3>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200 mb-3">
                <p className="text-sm text-gray-600 mb-2">Send us an email:</p>
                <a
                  href="mailto:cowtionhelp@gmail.com"
                  className="text-xl font-bold text-red-600 hover:text-red-700 break-all"
                >
                  cowtionhelp@gmail.com
                </a>
              </div>
              <button
                onClick={() => window.location.href = 'mailto:cowtionhelp@gmail.com'}
                className="w-full px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
              >
                Send Email
              </button>
            </div>

            {/* Phone Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📱</span>
                <h3 className="text-lg font-bold text-gray-900">Phone</h3>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 mb-3">
                <p className="text-sm text-gray-600 mb-2">Call us during business hours:</p>
                <a
                  href="tel:+91123665578"
                  className="text-xl font-bold text-blue-600 hover:text-blue-700"
                >
                  +91 123-665-578
                </a>
              </div>
              <button
                onClick={() => window.location.href = 'tel:+91123665578'}
                className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Call Now
              </button>
            </div>

            {/* Hours */}
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200 mb-6">
              <p className="text-sm font-bold text-gray-900 mb-2">📞 Business Hours</p>
              <p className="text-sm text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
              <p className="text-sm text-gray-700">Saturday - Sunday: 10:00 AM - 4:00 PM IST</p>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2025 Cowtion - Road Safety Alert System. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Making Indian Roads Safer, One Alert at a Time 🐄</p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-red-600">
            <span>🐮Cowtion!</span>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/about" className="text-gray-600 hover:text-red-600 font-semibold transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-red-600 font-semibold transition">
              Contact
            </Link>
            <Link href="/terms-privacy" className="text-gray-600 hover:text-red-600 font-semibold transition">
              Terms & Privacy
            </Link>
            <Link
              href="/home"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 pt-32 px-4 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center text-9xl">
            🐄
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Drive Safe with <span className="text-red-600">Cowtion!</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Real-time cattle alerts on the road. Stay cautious. Stay safe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/home"
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-lg font-semibold"
            >
              Open Map
            </Link>
            <Link href={"#features"}>
            <button className="px-8 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition text-lg font-semibold">
              Learn More
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white" id='features'>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Powerful Features for Road Safety
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-linear-to-br from-red-50 to-orange-50 rounded-lg hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Real-time Map</h3>
              <p className="text-gray-600">
                See your location and cattle alerts on an interactive map with live updates every 30 seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-linear-to-br from-red-50 to-orange-50 rounded-lg hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Automatic cattle detection and road condition assessment powered by Google's Gemini AI.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-linear-to-br from-red-50 to-orange-50 rounded-lg hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Community Voting</h3>
              <p className="text-gray-600">
                Vote on alerts to help others identify reliable reports and improve overall credibility.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-linear-to-br from-red-50 to-orange-50 rounded-lg hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Image Upload</h3>
              <p className="text-gray-600">
                Capture and upload geotagged images with automatic compression for fast processing.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-linear-to-br from-red-50 to-orange-50 rounded-lg hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Geolocation</h3>
              <p className="text-gray-600">
                All alerts are tagged with precise coordinates for accurate location-based filtering.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-linear-to-br from-red-50 to-orange-50 rounded-lg hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600">
                Cloud-based storage with Firebase for reliable, secure data management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50" id='how-it-works'>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            How Cowtion Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Get Location', desc: 'App detects your current location' },
              { num: '2', title: 'See Alerts', desc: 'View color-coded cattle alerts on map' },
              { num: '3', title: 'Report Alert', desc: 'Click + to upload cattle photo' },
              { num: '4', title: 'AI Analysis', desc: 'Gemini AI analyzes image & road' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Drive Safer?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Start reporting and viewing cattle alerts in real-time. Help keep roads safe for everyone.
          </p>
          <Link
            href="/home"
            className="inline-block px-8 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition text-lg font-semibold"
          >
            Open Cowtion Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">Cowtion!</h3>
              <p className="text-sm">
                Making roads safer with real-time cattle alerts and community support.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white">How it Works?</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/terms-privacy" className='hover:text-white'>Privacy & Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Cowtion. All rights reserved. Stay safe on the roads! 🚗🐄</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

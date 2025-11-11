import Link from 'next/link';

export default function TermsPrivacyPage() {
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
            <Link href="/contact" className="hover:text-red-600 transition">
              Contact
            </Link>
            <Link href="/terms-privacy" className="text-red-600 font-semibold">
              Terms & Privacy
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b-2 border-red-100">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms & Privacy</h1>
          <p className="text-xl text-gray-600">
            Your trust and privacy are important to us
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Table of Contents */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            <li><a href="#terms" className="text-red-600 hover:text-red-700 font-semibold">→ Terms of Service</a></li>
            <li><a href="#privacy" className="text-red-600 hover:text-red-700 font-semibold">→ Privacy Policy</a></li>
            <li><a href="#data-usage" className="text-red-600 hover:text-red-700 font-semibold">→ Data Usage & Protection</a></li>
            <li><a href="#community" className="text-red-600 hover:text-red-700 font-semibold">→ Community Guidelines</a></li>
            <li><a href="#liability" className="text-red-600 hover:text-red-700 font-semibold">→ Liability Disclaimer</a></li>
          </ul>
        </div>

        {/* Terms of Service */}
        <section id="terms" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-red-300 pb-3">Terms of Service</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Cowtion platform, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. User Responsibilities</h3>
              <p className="text-gray-700 leading-relaxed mb-3">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Use Cowtion only for its intended purpose of reporting road safety hazards</li>
                <li>Provide accurate and truthful information in all reports</li>
                <li>Not upload false, misleading, or malicious content</li>
                <li>Respect intellectual property and other users' rights</li>
                <li>Not use the platform for commercial purposes without permission</li>
                <li>Not attempt to hack, disrupt, or damage the platform</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. User-Generated Content</h3>
              <p className="text-gray-700 leading-relaxed">
                All reports, images, and comments you submit are user-generated content. 
                By submitting content, you grant Cowtion the right to use, modify, and distribute 
                your content for improving road safety and platform functionality.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">4. Prohibited Activities</h3>
              <p className="text-gray-700 leading-relaxed mb-3">You may NOT:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Submit false or misleading safety alerts</li>
                <li>Harass, abuse, or threaten other users</li>
                <li>Spam or flood the platform with repetitive content</li>
                <li>Share personally identifiable information of others</li>
                <li>Attempt to manipulate voting systems</li>
                <li>Use automated tools to scrape data</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">5. Service Availability</h3>
              <p className="text-gray-700 leading-relaxed">
                Cowtion is provided on an "as-is" basis. We strive for 99.9% uptime but do not guarantee 
                uninterrupted service. We may perform maintenance or updates that temporarily affect availability.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">6. Changes to Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the platform 
                after changes implies acceptance of the new terms.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy */}
        <section id="privacy" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-blue-300 pb-3">Privacy Policy</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h3>
              <p className="text-gray-700 leading-relaxed mb-3">Cowtion collects the following information:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Location Data:</strong> GPS coordinates from your device (with your permission)</li>
                <li><strong>Image Data:</strong> Photos you upload of cattle and road conditions</li>
                <li><strong>Device Information:</strong> Device type, OS, browser, IP address</li>
                <li><strong>Usage Data:</strong> How you interact with the platform</li>
                <li><strong>Voting Data:</strong> Your upvotes and downvotes on alerts</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Data</h3>
              <p className="text-gray-700 leading-relaxed mb-3">Your data is used for:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Displaying alerts on the real-time map</li>
                <li>AI analysis of images using Google Gemini API</li>
                <li>Improving platform functionality and user experience</li>
                <li>Analyzing road safety trends (anonymized)</li>
                <li>Preventing fraud and abuse</li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Data Sharing</h3>
              <p className="text-gray-700 leading-relaxed">
                We do NOT sell your personal data. However, we may share information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Google (for image analysis via Gemini API)</li>
                <li>Firebase (for database and storage)</li>
                <li>Law enforcement (if legally required)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">4. Data Retention</h3>
              <p className="text-gray-700 leading-relaxed">
                Reports are stored indefinitely to maintain historical data for road safety analysis. 
                You can request deletion by contacting us, though we may retain anonymized data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">5. Your Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Access your data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion (where applicable)</li>
                <li>Opt-out of data collection (limited functionality)</li>
                <li>Lodge a complaint with authorities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                We use essential cookies for authentication and functionality. 
                You can disable cookies in your browser, though this may affect your experience.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">7. Security</h3>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your data. 
                However, no system is 100% secure. We recommend using strong passwords and keeping your device secure.
              </p>
            </div>
          </div>
        </section>

        {/* Data Usage & Protection */}
        <section id="data-usage" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-green-300 pb-3">Data Usage & Protection</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Encryption</h3>
              <p className="text-gray-700 leading-relaxed">
                All data transmitted between your device and our servers is encrypted using HTTPS. 
                Sensitive data in our database is encrypted at rest.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Anonymization</h3>
              <p className="text-gray-700 leading-relaxed">
                While reports are public (to help other road users), user identities are kept anonymous. 
                We do not collect or display personally identifiable information like names or phone numbers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Third-Party APIs</h3>
              <p className="text-gray-700 leading-relaxed">
                We use Google Generative AI (Gemini) for image analysis. 
                Images are sent to Google's servers. Please review Google's privacy policy for details on how they handle data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compliance</h3>
              <p className="text-gray-700 leading-relaxed">
                Cowtion complies with Indian data protection laws and follows best practices from 
                international privacy standards including GDPR principles.
              </p>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section id="community" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-purple-300 pb-3">Community Guidelines</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Be Honest</h3>
              <p className="text-gray-700 leading-relaxed">
                Report only genuine safety hazards. False reports can mislead drivers and are counterproductive to our mission.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Be Respectful</h3>
              <p className="text-gray-700 leading-relaxed">
                Treat other users with respect. Harassment, bullying, or discriminatory behavior will result in account suspension.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vote Responsibly</h3>
              <p className="text-gray-700 leading-relaxed">
                Vote up helpful, accurate alerts. Vote down false or misleading reports. 
                Voting helps maintain data quality for everyone.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Consequences of Violation</h3>
              <p className="text-gray-700 leading-relaxed mb-3">Violations may result in:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Content removal</li>
                <li>Account warning or suspension</li>
                <li>Permanent ban from the platform</li>
                <li>Legal action (in case of serious violations)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Liability Disclaimer */}
        <section id="liability" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-orange-300 pb-3">Liability Disclaimer</h2>

          <div className="space-y-6">
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-600 mb-3">⚠️ Important</h3>
              <p className="text-gray-700 leading-relaxed">
                Cowtion provides road safety alerts for informational purposes only. 
                We are NOT liable for accidents, injuries, or damages resulting from the use or misuse of alerts.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User Responsibility</h3>
              <p className="text-gray-700 leading-relaxed">
                It is the user's (driver's, cyclist's, pedestrian's) responsibility to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Exercise caution and follow traffic rules at all times</li>
                <li>Verify alerts before acting on them</li>
                <li>Make safe driving decisions</li>
                <li>Report any false alerts to us</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Guarantee</h3>
              <p className="text-gray-700 leading-relaxed">
                Cowtion does not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>100% accuracy of alerts</li>
                <li>Complete coverage of all roads</li>
                <li>Real-time updates in all cases</li>
                <li>Uninterrupted service availability</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact for Issues</h3>
              <p className="text-gray-700 leading-relaxed">
                If you experience issues or believe an alert is false, please contact us immediately at 
                <a href="mailto:cowtionhelp@gmail.com" className="text-red-600 font-bold hover:text-red-700"> cowtionhelp@gmail.com</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-linear-to-r from-red-600 to-orange-600 rounded-lg shadow-lg p-12 text-white text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Policies?</h2>
          <p className="text-lg mb-6">
            Contact us at <a href="mailto:cowtionhelp@gmail.com" className="underline font-bold">cowtionhelp@gmail.com</a>
          </p>
          <Link href="/contact" className="inline-block px-8 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition">
            Get in Touch
          </Link>
        </section>

        {/* Last Updated */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            Last Updated: November 11, 2025
          </p>
          <p className="text-sm text-gray-500 mt-2">
            These policies may be updated at any time. Continued use of Cowtion implies acceptance of changes.
          </p>
        </div>
      </div>

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

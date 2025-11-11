import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: '#ff5055' }}>
            � Cowtion!
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="hover:opacity-80 transition" style={{ color: '#ff5055' }}>
              Home
            </Link>
            <Link href="/about" className="font-semibold" style={{ color: '#ff5055' }}>
              About
            </Link>
            <Link href="/contact" className="hover:opacity-80 transition" style={{ color: '#ff5055' }}>
              Contact
            </Link>
            <Link href="/terms-privacy" className="hover:opacity-80 transition" style={{ color: '#ff5055' }}>
              Terms & Privacy
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b-2 border-red-100">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About Cowtion</h1>
          <p className="text-xl text-gray-600">
            Protecting Lives on Indian Roads Through Smart Cattle Alerts
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* What is Cowtion */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Cowtion?</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Cowtion is a community-driven road safety platform designed specifically for Indian roads. 
              It's a real-time alert system that helps drivers, cyclists, and pedestrians stay aware of cattle 
              on roadways—a critical safety concern across India.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              By combining geolocation technology, AI-powered image analysis, and community voting, 
              Cowtion creates a living map of cattle alerts that keeps everyone on the road safe.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Spot & Report</h3>
              <p className="text-gray-600">
                See cattle on the road? Tap the + button to open the camera and capture a photo with your location.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your image to count cattle, assess road conditions, and generate actionable alerts automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Map</h3>
              <p className="text-gray-600">
                Your alert appears on the map with a color-coded density marker (Red = High Risk, Orange = Medium, Amber = Low).
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">👍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Vote</h3>
              <p className="text-gray-600">
                Users vote on alert accuracy. Alerts with 100+ downvotes are auto-removed to keep the system clean.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits in India */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Cowtion Matters in India</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefit 1 */}
            <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-lg p-8 border-2 border-red-200">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#ff5055' }}>🚗 Reduces Road Accidents</h3>
              <p className="text-gray-700 leading-relaxed">
                According to NHAI data, stray cattle cause thousands of road accidents annually in India. 
                Cowtion provides real-time warnings, giving drivers time to react and avoid collisions.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">💰 Saves Lives & Money</h3>
              <p className="text-gray-700 leading-relaxed">
                Fewer accidents mean fewer injuries, fatalities, and insurance claims. 
                The economic impact of prevented accidents is substantial across the entire nation.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-8 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-600 mb-4">🤝 Community-Driven Safety</h3>
              <p className="text-gray-700 leading-relaxed">
                Crowdsourced data creates a community responsibility for road safety. 
                Every user contributes to a safer environment for everyone.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg p-8 border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">📊 Actionable Data</h3>
              <p className="text-gray-700 leading-relaxed">
                Anonymous data patterns help identify high-risk zones for government intervention, 
                animal relocation programs, and targeted road safety measures.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-lg p-8 border-2 border-yellow-200">
              <h3 className="text-2xl font-bold text-amber-600 mb-4">🌍 Accessible to All</h3>
              <p className="text-gray-700 leading-relaxed">
                Works on basic smartphones with 3G/4G connectivity. No registration required. 
                Designed for users across India, rural and urban.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-lg p-8 border-2 border-indigo-200">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">⚡ Real-Time Intelligence</h3>
              <p className="text-gray-700 leading-relaxed">
                Unlike static road signs, Cowtion provides live updates. 
                Conditions change minute by minute on Indian highways—so does our data.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-bold text-gray-900">Image-Based Reporting</h4>
                  <p className="text-gray-600">Upload photos with automatic compression and AI analysis</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-bold text-gray-900">Geolocation Tracking</h4>
                  <p className="text-gray-600">Precise GPS coordinates ensure alerts are location-accurate</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-bold text-gray-900">Cattle Density Visualization</h4>
                  <p className="text-gray-600">Color-coded markers show risk levels at a glance</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-bold text-gray-900">Community Voting</h4>
                  <p className="text-gray-600">Upvote helpful alerts, downvote false reports</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-bold text-gray-900">AI-Powered Analysis</h4>
                  <p className="text-gray-600">Google Gemini API for automated image recognition</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-bold text-gray-900">Auto-Cleanup</h4>
                  <p className="text-gray-600">Alerts with 100+ downvotes are automatically removed</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-bold text-gray-900">Anonymous & Private</h4>
                  <p className="text-gray-600">No registration required, reports are anonymous</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <div className="rounded-lg shadow-lg p-12 text-white text-center" style={{ background: 'linear-gradient(to right, #ff5055, #ff9900)' }}>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg mb-6 leading-relaxed">
              To save lives and reduce accidents on Indian roads by creating a real-time, 
              community-driven cattle alert system that empowers drivers with instant, 
              accurate information.
            </p>
            <p className="text-lg">
              Every alert shared. Every life protected. Every road safer. 🐄 Cowtion.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Make Roads Safer?</h2>
          <div className="flex gap-4 justify-center">
            <Link
              href="/home"
              className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition shadow-lg"
              style={{ backgroundColor: '#ff5055' }}
            >
              View Live Map
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2025 Cowtion - Road Safety Alert System. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Making Indian Roads Safer, One Alert at a Time 🐄</p>
        </div>
      </footer>
    </div>
  );
}

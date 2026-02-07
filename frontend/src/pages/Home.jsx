import { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.jpg";

const Home = () => {
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!suggestion.trim()) {
      return;
    }
    setSubmitted(true);
    setSuggestion("");
  };

  return (
    <div className="w-full">
      {/* ================= HERO SECTION ================= */}
      <section className="min-h-[95vh] flex items-center bg-[#F8F9FA] px-6">
        <div className="w-full max-w-376 mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 items-center">
          {/* LEFT TEXT */}
          <div className="md:col-span-2 -ml-4">
            <h1 className="text-6xl md:text-7xl lg:text-[5.75rem] font-semibold text-[#0A2540] leading-[1.08] mb-10">
              Real problems <br />
              deserve real <br />
              action — <br />
              <span className="text-[#2EC4B6]">not silence.</span>
            </h1>

            <p className="text-2xl text-gray-600 max-w-xl mb-12">
              civicconnect helps citizens report everyday civic issues and track
              real action transparently.
            </p>

            <Link
              to="/raise"
              className="inline-block bg-[#2EC4B6] text-[#0A2540] px-12 py-4 rounded-full text-xl font-medium hover:opacity-90 transition"
            >
              Start Reporting
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="md:col-span-3 w-full h-180 rounded-[2.75rem] overflow-hidden shadow-2xl">
            <img
              src={heroImage}
              alt="city"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= WHAT WE SOLVE ================= */}
<section className="w-full py-32 bg-gradient-to-r from-[#0A2540] via-[#0F3D5E] to-[#1C5D99]">
  <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-20 items-center">

    {/* LEFT CONTENT */}
    <div className="text-white">
      <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
        From everyday problems <br />
        to <span className="text-[#2EC4B6]">community-driven</span> solutions
      </h2>

      <p className="text-blue-100 max-w-xl text-lg leading-relaxed">
        civicconnect transforms local civic complaints into visible,
        trackable actions — empowering communities and enabling
        accountable governance.
      </p>
    </div>

    {/* RIGHT CARDS */}
    <div className="space-y-6">

      <div className="bg-white/10 backdrop-blur-md p-7 rounded-2xl border border-white/15 hover:bg-white/15 transition">
        <h3 className="text-lg font-medium text-white mb-2">
          🤝 Community Power
        </h3>
        <p className="text-blue-100">
          Report and support issues together, making every voice count.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-7 rounded-2xl border border-white/15 hover:bg-white/15 transition">
        <h3 className="text-lg font-medium text-white mb-2">
          📍 Smart Tracking
        </h3>
        <p className="text-blue-100">
          Track issues in real time with live status updates and maps.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-7 rounded-2xl border border-white/15 hover:bg-white/15 transition">
        <h3 className="text-lg font-medium text-white mb-2">
          🏛 Trusted Resolution
        </h3>
        <p className="text-blue-100">
          Ensure problems are resolved transparently with clear accountability.
        </p>
      </div>

    </div>
  </div>
</section>



     {/* ================= HOW IT WORKS ================= */}
<section className="py-32 bg-white px-6">
  <div className="max-w-7xl mx-auto text-center">

    <h2 className="text-4xl md:text-5xl font-semibold text-[#0A2540] mb-4">
      Simple for citizens.
    </h2>
    <h3 className="text-4xl md:text-5xl font-semibold text-[#2EC4B6] mb-20">
      Powerful for cities.
    </h3>

    <div className="grid md:grid-cols-3 gap-14">

      {/* CARD 1 */}
      <div className="group bg-[#F8F9FA] p-14 rounded-[2.5rem] shadow-sm hover:shadow-xl transition">
        <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center rounded-full bg-[#2EC4B6]/15 text-3xl">
          📸
        </div>
        <h3 className="font-medium text-2xl mb-4 text-[#0A2540]">
          Raise an Issue
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          Upload a photo, add location, and clearly describe the problem.
        </p>
      </div>

      {/* CARD 2 */}
      <div className="group bg-[#F8F9FA] p-14 rounded-[2.5rem] shadow-sm hover:shadow-xl transition">
        <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center rounded-full bg-[#2EC4B6]/15 text-3xl">
          🔄
        </div>
        <h3 className="font-medium text-2xl mb-4 text-[#0A2540]">
          Track Progress
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          Follow real-time status updates as action is taken.
        </p>
      </div>

      {/* CARD 3 */}
      <div className="group bg-[#F8F9FA] p-14 rounded-[2.5rem] shadow-sm hover:shadow-xl transition">
        <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center rounded-full bg-[#2EC4B6]/15 text-3xl">
          ✅
        </div>
        <h3 className="font-medium text-2xl mb-4 text-[#0A2540]">
          Issue Resolved
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          Resolution is completed transparently with proof.
        </p>
      </div>

    </div>
  </div>
</section>

      {/* ================= SUGGESTION BOX ================= */}
      <section className="py-28 bg-[#F8F9FA] px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#0A2540] mb-5">
              Suggest an improvement
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Share ideas for better streets, safer neighborhoods, and faster
              civic response. Your suggestions help guide what we build next.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10"
          >
            <label
              htmlFor="citizen-suggestion"
              className="block text-sm font-semibold text-[#0A2540] mb-3"
            >
              Your suggestion
            </label>
            <textarea
              id="citizen-suggestion"
              rows="5"
              value={suggestion}
              onChange={(event) => {
                setSuggestion(event.target.value);
                setSubmitted(false);
              }}
              placeholder="Tell us what should improve in your city..."
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]/40"
            />
            {submitted && (
              <p className="mt-3 text-sm text-[#2EC4B6]">
                Thanks for sharing. We will review your suggestion.
              </p>
            )}
            <button
              type="submit"
              disabled={!suggestion.trim()}
              className="mt-6 w-full rounded-full bg-[#2EC4B6] text-[#0A2540] py-3 text-lg font-semibold hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send Suggestion
            </button>
          </form>
        </div>
      </section>


     {/* ================= FOOTER ================= */}
<footer className="bg-[#0A2540] text-gray-300 pt-16">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 pb-12">

    {/* BRAND */}
    <div>
      <h3 className="text-2xl font-semibold text-white mb-4">
        civicconnect
      </h3>
      <p className="text-gray-400 leading-relaxed">
        Empowering citizens to report civic issues, track action,
        and build transparent, accountable cities.
      </p>
    </div>

    {/* QUICK LINKS */}
    <div>
      <h4 className="text-lg font-medium text-white mb-4">
        Quick Links
      </h4>
      <ul className="space-y-2">
        <li className="hover:text-white transition">Home</li>
        <li className="hover:text-white transition">Report Issue</li>
        <li className="hover:text-white transition">Map View</li>
        <li className="hover:text-white transition">My Complaints</li>
      </ul>
    </div>

    {/* FEATURES */}
    <div>
      <h4 className="text-lg font-medium text-white mb-4">
        Features
      </h4>
      <ul className="space-y-2">
        <li>Issue Reporting</li>
        <li>Live Status Tracking</li>
        <li>Location-based Visibility</li>
        <li>Authority Accountability</li>
      </ul>
    </div>

    {/* CTA */}
    <div>
      <h4 className="text-lg font-medium text-white mb-4">
        Get Started
      </h4>
      <p className="text-gray-400 mb-6">
        Raise issues, follow progress, and be part of the change.
      </p>
      <Link
        to="/raise"
        className="inline-block bg-[#2EC4B6] text-[#0A2540] px-6 py-3 rounded-full font-medium hover:scale-105 transition"
      >
        Report an Issue
      </Link>
    </div>

  </div>

  {/* BOTTOM BAR */}
  <div className="border-t border-white/10 py-6 text-center text-sm text-gray-400">
    Built for Smart Cities · Designed for Transparency <br />
    © {new Date().getFullYear()} civicconnect. All rights reserved.
  </div>
</footer>

    </div>
  );
};

export default Home;

import React, { useState } from "react";
import {
  Play,
  Zap,
  Eye,
  Wand2,
  Edit3,
  Upload,
  Menu,
  X,
  Check,
  Star,
  ArrowRight,
} from "lucide-react";
import ThreeBackground from "./components/ThreeBackground";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Describe Your Video Idea",
      description:
        "Type a topic, upload a script, or give the AI a prompt — Moviq.AI writes the script and voiceover for you.",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Watch the Scenes Build Themselves",
      description:
        "The system generates multilayered templates filled with synced images, transitions, and motion graphics.",
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "Preview and Customize",
      description:
        "Swap out visuals, regenerate scenes, or tweak the script — all within seconds.",
    },
    {
      icon: <Edit3 className="w-8 h-8" />,
      title: 'Click "Export" — You\'re Done',
      description:
        "Get a polished MP4 ready for YouTube — or let the platform auto-upload to your channel.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99/month",
      description: "For solo creators or editors starting out",
      features: [
        "Up to 80 minutes of video/month",
        "Up to 1 YouTube channel connected",
      ],
    },
    {
      name: "Growth (most popular)",
      price: "$199/month",
      description: "For growing editors and agencies",
      features: [
        "Up to 240 minutes of video/month",
        "Up to 3 YouTube channels",
        "Team collaboration enabled",
      ],
      popular: true,
    },
    {
      name: "Content Farm Pro",
      price: "$499/month",
      description: "For full-time YouTube teams and content farms",
      features: [
        "Up to 800 minutes of video/month",
        "Up to 10 YouTube channels",
        "Dedicated onboarding",
      ],
    },
  ];

  const niches = [
    {
      title: "Geographic Motion Graphics",
      image: "/images/geographic-motion-graphics.png",
      description:
        "Dynamic country highlights, zooms, and animated conflict overlays — perfect for geopolitics or war topics.",
    },
    {
      title: "Auto-Synced Charts & Graphs",
      image: "/images/auto-synced-charts-graphs.png",
      description:
        "Real-time data visualizations like bar charts, progress bars, and counters, matched with your narration.",
    },
    {
      title: "AI Avatars",
      image: "/images/ai-avatars.png",
      description:
        "Talking presenters embedded in scenes, reacting to narration and surrounded by dynamic visuals.",
    },
    {
      title: "Smart Text Callouts, Quotes & Highlights",
      image: "/images/smart-text-callouts.png",
      description:
        "Auto-generated text boxes, quote highlights, and animated tags that sync to keywords and timestamps.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Animated Background */}
      <ThreeBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Zap className="w-8 h-8 text-purple-400" />
                <span className="ml-2 text-xl font-bold text-white">
                  Moviq AI
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#features"
                  className="text-slate-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-slate-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#niches"
                  className="text-slate-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Automation
                </a>
                <button
                  className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:brightness-110 whitespace-normal break-words min-w-0 w-full sm:w-auto overflow-hidden text-center"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(234, 245, 237, 0.76), rgba(59, 130, 246, 0.7))",
                  }}
                >
                  <span className="inline-block">Join the Waitlist</span>
                </button>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-purple-400"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-slate-300 hover:text-purple-400"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-slate-300 hover:text-purple-400"
              >
                Pricing
              </a>
              <a
                href="#niches"
                className="block px-3 py-2 text-slate-300 hover:text-purple-400"
              >
                Niches
              </a>
              <button
                className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:brightness-110 whitespace-normal break-words min-w-0 w-full sm:w-auto overflow-hidden text-center"
                style={{
                  background:
                    "linear-gradient(to right, rgba(234, 245, 237, 0.76), rgba(59, 130, 246, 0.7))",
                }}
              >
                <span className="inline-block">Join the Waitlist</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Moviq AI
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto">
              Turn Ideas Into Viral Documentaries — Automatically
            </p>

            {/* Video Preview */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-700/30">
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                  <video controls className="w-full h-full object-cover">
                    <source
                      src="https://example.com/sample-video.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            <button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-xl whitespace-normal break-words min-w-0 w-full sm:w-auto overflow-hidden text-center"
              style={{
                background:
                  "linear-gradient(to right, rgba(234, 245, 237, 0.76), rgba(59, 130, 246, 0.7))",
              }}
            >
              <span className="inline-block">Join the Waitlist</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Here's what Moviq AI can do
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto">
              From idea to final edit — Moviq AI turns your script into
              cinematic, narration-synced videos with motion graphics,
              transitions, and YouTube-ready formatting
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  {feature.icon}
                </div>
                <h3
                  className="text-xl font-semibold text-white mb-4"
                  style={{ textAlign: "center" }}
                >
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-white leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border-2 relative ${
                  plan.popular
                    ? "border-purple-500/50 shadow-2xl shadow-purple-500/20"
                    : "border-slate-700/30"
                } hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 ${
                  plan.popular ? "scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium border border-purple-400">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {plan.price}
                  </div>
                  <p className="text-slate-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8" style={{ height: "150px" }}>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                      : "bg-slate-700/30 text-slate-300 hover:bg-slate-600/30"
                  }`}
                  style={{
                    background:
                      "linear-gradient(to right, rgba(234, 245, 237, 0.76), rgba(59, 130, 246, 0.7))",
                  }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
          <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto">
            Video editors charge $25–$80 per minute for faceless documentary
            videos like these. With our platform, you get the same result for
            under $2 per minute — fully automated
          </p>
        </div>
      </section>

      {/* Niches Section */}
      <section id="niches" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Next-Level Automation Is on the Way
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {niches.map((niche, index) => (
              <div
                key={index}
                className={`group cursor-pointer bg-slate-800/20 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 border border-slate-700/30 hover:shadow-lg hover:shadow-purple-500/10`}
              >
                <button
                  className="w-full h-20 mb-4 text-sm font-medium text-center rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition-colors duration-300 ease-in-out flex items-center justify-center overflow-hidden 
                    bg-slate-700/30 text-slate-300 hover:bg-slate-600/30"
                  title={niche.title} // Tooltip for full text on hover
                >
                  <span className="truncate w-full text-ellipsis">
                    {niche.title}
                  </span>
                </button>
                <div className="overflow-hidden mb-4 aspect-video relative group-hover:scale-105">
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                  >
                    <source src="your-video-link-here.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-center text-slate-400 text-xs mt-2">
                  {niche.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Content Creation?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of creators who are already automating their video
            production
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg border-0 bg-slate-800/30 backdrop-blur-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center whitespace-normal break-words min-w-0 w-full sm:w-auto overflow-hidden"
              style={{
                background:
                  "linear-gradient(to right, rgba(234, 245, 237, 0.76), rgba(59, 130, 246, 0.7))",
              }}
            >
              <span className="inline-block">Join</span>
              <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-sm text-white py-16 relative z-10 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
                <span className="ml-2 text-xl font-bold">Moviq AI</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Revolutionizing content creation with AI-powered video
                automation. Create professional documentaries in minutes, not
                months.
              </p>
              <div className="flex space-x-4">
                <Star className="w-6 h-6 text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
                <Star className="w-6 h-6 text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
                <Star className="w-6 h-6 text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 VideoAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

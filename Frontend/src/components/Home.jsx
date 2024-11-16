import { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// Import icons from react-icons
import { FaHistory, FaBook, FaChartBar, FaUser } from 'react-icons/fa';

const Home = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const loadParticles = async () => {
      await loadFull();
    };
    loadParticles();

    // Rotate quotes every 3 seconds
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const particlesOptions = {
    background: {
      color: "#0f0f0f",
    },
    particles: {
      number: { value: 80 },
      color: { value: "#00FFFF" },
      shape: { type: "circle" },
      opacity: { value: 0.5 },
      size: { value: 3 },
      move: { enable: true, speed: 2 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
    },
  };

  const quotes = [
    "Translation bridges cultures, connecting people across borders.",
    "Languages are threads that weave the fabric of human connection.",
    "Every translation is a bridge to greater understanding between people."
  ];

  // Icons mapped to the respective sections
  const cardIcons = {
    History: <FaHistory size={30} />,
    Resources: <FaBook size={30} />,
    "Lang Stats": <FaChartBar size={30} />,
    Profile: <FaUser size={30} />,
  };

  return (
    <div className="h-screen w-screen relative">
      {/* Particle.js Background */}
      <Particles options={particlesOptions} className="absolute inset-0" />

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row h-full">
        {/* Left Panel */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center items-center p-8">
          <h1 className="text-6xl font-extrabold text-cyan-300 mb-32 tracking-wide text-center drop-shadow-lg border-neutral-50">
            Language Translator
          </h1>

          {/* Carousel */}
          <div className="w-4/5 overflow-hidden relative mb-8 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <div className="text-white text-xl font-semibold">
              <p className="text-center py-4 text-orange-700">
                {quotes[currentQuote]}
              </p>
            </div>
          </div>

          {/* Navigate to Translate */}
          <button
            onClick={() => (window.location.href = "/translate")}
            className="px-6 py-4 text-lg font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-xl transform hover:scale-110 text-black"
          >
            Translate Now!
          </button>
        </div>

        {/* Right Panel */}
        <div className="w-full h-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 p-24">
          {["History", "Resources", "Lang Stats", "Profile"].map((name) => (
            <div
              key={name}
              onClick={() => (window.location.href = `/${name.toLowerCase()}`)}
              className="w-full h-40 bg-gray-700 border border-cyan-500 flex justify-center items-center text-white text-xl font-bold rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_20px_5px_cyan] cursor-pointer relative"
            >
              {/* Add icon to each card */}
              <div className="text-cyan-500 mr-2">
                {cardIcons[name]} {/* Render corresponding icon */}
              </div>
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

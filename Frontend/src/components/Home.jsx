import { useEffect, useState, useRef } from "react";
import ParticlesBackground from "./ParticlesBackground";
import { FaHistory, FaBook, FaChartBar, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Updated quotes
  const quotes = [
    "The oldest language known to the world is Tamil, still thriving in its rich literary tradition.",
    "Mandarin is widely regarded as the hardest language to master, with its intricate tones and characters.",
    "Hindi holds the title as the most spoken language in India, connecting millions across the nation."
  ];
  

  const cardIcons = {
    History: <FaHistory size={30} />,
    Resources: <FaBook size={30} />,
    "Lang Stats": <FaChartBar size={30} />,
    Profile: <FaUser size={30} />,
  };

  const cardColors = {
    History: "from-green-500 to-purple-500",
    Resources: "from-red-500 to-green-500",
    "Lang Stats": "from-green-500 to-indigo-800",
    Profile: "from-pink-500 to-cyan-500",
  };

  useEffect(() => {
    // Set interval for rotating quotes
    intervalRef.current = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 3000);

    // Cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, [quotes.length]);

  return (
    <div className="h-screen w-screen relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row h-full">
        {/* Left Panel */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center items-center p-8">
          <h1 className="text-5xl font-extrabold text-cyan-300 mb-16 tracking-wide text-center drop-shadow-lg border-neutral-50">
            Welcome, <span className="text-yellow-400">User Name</span>
          </h1>

          {/* Quotes Carousel */}
          <div className="w-4/5 overflow-hidden relative mb-8 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <div className="text-white text-xl font-semibold">
              <p className="text-center py-4 text-orange-700">
                {quotes[currentQuote]}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-6">
            <button
              onClick={() => navigate("/translate")}
              className="px-6 py-4 text-lg font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-xl transform hover:scale-110 text-black"
              aria-label="Navigate to Translate"
            >
              Translate Now!
            </button>
            <button
              onClick={() => navigate("/game")}
              className="px-6 py-4 text-lg font-semibold text-white bg-gradient-to-br from-yellow-500 to-red-500 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-xl transform hover:scale-110 text-black"
              aria-label="Navigate to Play and Learn"
            >
              Play And Learn!
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full h-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 p-24">
          {["History", "Resources", "Lang Stats", "Profile"].map((name) => (
            <div
              key={name}
              role="button"
              aria-label={`Navigate to ${name}`}
              tabIndex={0}
              onClick={() => navigate(`/${name.toLowerCase()}`)}
              className={`w-full h-40 bg-gradient-to-br ${
                cardColors[name]
              } border border-cyan-500 flex justify-center items-center text-white text-xl font-bold rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_20px_5px_cyan] cursor-pointer relative`}
            >
              <div className="text-cyan-500 mr-2">{cardIcons[name]}</div>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

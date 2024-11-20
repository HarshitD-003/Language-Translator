import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Slider from "react-slick"; // Import react-slick
import { FaHistory, FaBook, FaChartBar, FaUser } from "react-icons/fa";
import Chatbot from "./Chatbot";

const Home = () => {
  const navigate = useNavigate();

  // Updated quotes
  const quotes = [
    "The oldest language known to the world is Tamil, still thriving in its rich literary tradition.",
    "Mandarin is widely regarded as the hardest language to master, with its intricate tones and characters.",
    "Hindi holds the title as the most spoken language in India, connecting millions across the nation."
  ];

  // Slider settings
  const settings = {
    dots: true, // Show dots for navigation
    infinite: true, // Loop through the quotes
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one quote at a time
    autoplay: true, // Auto-rotate quotes
    autoplaySpeed: 3000, // Interval between quotes
  };

  // Card Icons and Colors
  const cardIcons = {
    History: <FaHistory size={30} />,
    Resources: <FaBook size={30} />,
    "Stats": <FaChartBar size={30} />,
    Profile: <FaUser size={30} />,
  };

  const cardColors = {
    History: "from-rose-900 to-yellow-700",
    Resources: "from-rose-900 to-emerald-700",
    "Stats": "from-gray-600 to-indigo-600",
    Profile: "from-pink-600 to-red-600",
  };

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
          <div className="w-4/5 overflow-hidden relative mb-8 bg-gray-800 bg-opacity-50 p-8 rounded-lg">
            <Slider {...settings}>
              {quotes.map((quote, index) => (
                <div key={index} className="text-white text-xl font-semibold text-center">
                  <p className="py-4 text-purple-500">{quote}</p>
                </div>
              ))}
            </Slider>
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
          {["History", "Resources", "Stats", "Profile"].map((name) => (
            <div
              key={name}
              role="button"
              aria-label={`Navigate to ${name}`}
              tabIndex={0}
              onClick={() =>
                name === "Resources" // Specific check for Resources
                  ? navigate("/resources") // Navigate to resources.jsx
                  : navigate(`/${name.toLowerCase()}`) // Default behavior for other cards
              }
              className={`w-full h-40 bg-gradient-to-br ${cardColors[name]} border border-cyan-500 flex justify-center items-center text-white text-xl font-bold rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_20px_5px_cyan] cursor-pointer relative`}
            >
              <div className="text-cyan-500 mr-2">{cardIcons[name]}</div>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Chatbot Component */}
      <Chatbot initialMessage="Welcome to the Home page! Let me guide you through our features." />
    </div>
  );
};

export default Home;

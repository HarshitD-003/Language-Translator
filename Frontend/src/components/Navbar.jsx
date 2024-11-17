import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-16 bg-gray-900 flex items-center shadow-lg px-4 pt-3">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Langify Logo" className="h-10 w-10 mr-3" />
        <h1 className="text-2xl font-bold text-cyan-400">
          Langify
        </h1>
      </div>
    </div>
  );
};

export default Navbar;

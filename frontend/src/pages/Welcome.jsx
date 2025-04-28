import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 p-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">
        Welcome to Our App
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Link to="/login">
          <button className="px-8 py-4 cursor-pointer text-lg font-semibold rounded-full bg-white text-blue-600 ">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-8 py-4 cursor-pointer text-lg font-semibold rounded-full bg-white text-indigo-600 ">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;

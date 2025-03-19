import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-105">
        <h1 className="text-9xl font-bold text-gray-800 mb-4 animate-bounce">
          404
        </h1>
        <p className="text-2xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-lg text-gray-500 mb-8">
          You tried to access <span className="font-mono text-blue-600">{location.pathname}</span>, but it's not available.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
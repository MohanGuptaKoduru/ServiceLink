import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login"); // 'login' or 'signup'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 shadow-md backdrop-blur-sm h-16 flex items-center">
      <div className="container-custom flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-3xl font-bold text-blue-600">
          <Wrench size={28} />
          <span>ServiceLink</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-10">
          {[
            { name: "Home", link: "/" },
            { name: "Features", link: "#features" },
            { name: "How It Works", link: "#how-it-works" },
            { name: "Contact", link: "#contact" },
          ].map(({ name, link }) => (
            <a
              key={name}
              href={link}
              className="text-lg font-medium text-gray-700 hover:text-blue-500 relative group"
            >
              {name}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}

          {/* Login/Signup Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <Link
              to="/login"
              className={`px-5 py-2 text-lg font-medium transition-all ${
                authTab === "login" ? "bg-blue-500 text-white" : "text-gray-700 hover:text-blue-500"
              }`}
              onClick={() => setAuthTab("login")}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-5 py-2 text-lg font-medium transition-all ${
                authTab === "signup" ? "bg-blue-500 text-white" : "text-gray-700 hover:text-blue-500"
              }`}
              onClick={() => setAuthTab("signup")}
            >
              Signup
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-800"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col p-6 space-y-6 text-xl">
          {[
            { name: "Features", link: "#features" },
            { name: "How It Works", link: "#how-it-works" },
            { name: "Testimonials", link: "#testimonials" },
            { name: "Contact", link: "#contact" },
          ].map(({ name, link }) => (
            <a
              key={name}
              href={link}
              className="text-gray-800 hover:text-blue-600 font-medium py-3 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {name}
              <span className="absolute left-0 bottom-0 w-0 h-1 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}

          {/* Mobile Login/Signup */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 self-start">
            <Link
              to="/login"
              className={`px-6 py-3 text-lg font-medium transition-colors ${
                authTab === "login" ? "bg-blue-500 text-white" : "text-gray-800"
              }`}
              onClick={() => {
                setAuthTab("login");
                setIsMobileMenuOpen(false);
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-6 py-3 text-lg font-medium transition-colors ${
                authTab === "signup" ? "bg-blue-500 text-white" : "text-gray-800"
              }`}
              onClick={() => {
                setAuthTab("signup");
                setIsMobileMenuOpen(false);
              }}
            >
              Signup
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

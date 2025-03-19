import { ArrowRight, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signup'); // Replace '/signup' with the actual path to your signup page
  };
  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center text-white overflow-hidden relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-500/60 z-0"></div>

      <div className="container-custom relative z-10 py-16 md:py-24 px-6 md:px-12 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Trusted Professionals for Home Services
            </h1>

            <p className="text-lg md:text-xl font-light max-w-2xl">
              Connecting you to skilled experts for all your home service
               needs  from plumbing and electrical work to carpentry and painting...
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="button-primary flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 transition"
                aria-label="Get Started with Home Services"
                onClick={handleClick}
              >
                <Wrench size={24} className="mr-2" />
                Get Started
              </button>
              <a
                href="#features" // Link to the features section
                className="button-secondary flex items-center justify-center px-6 py-3 rounded-lg font-medium border border-white hover:bg-white hover:text-blue-600 transition"
                aria-label="Learn More about Our Services"
              >
                Learn More
                <ArrowRight size={24} className="ml-2" />
              </a>
            </div>
          </div>

          {/* Right Content - Larger Tablet Mockup */}
          <div className="relative animate-fade-in delay-200">
            <div className="relative hidden md:block">
              <div className="relative mx-auto border-blue-800 bg-blue-800 border-[16px] rounded-[3rem] h-[650px] w-[500px] shadow-2xl">
                {/* Tablet Speaker */}
                <div className="w-[120px] h-[12px] bg-blue-800 top-0 rounded-b-[0.75rem] left-1/2 -translate-x-1/2 absolute"></div>
                {/* Side Buttons */}
                <div className="h-[50px] w-[4px] bg-blue-800 absolute -left-[18px] top-[100px] rounded-l-lg"></div>
                <div className="h-[50px] w-[4px] bg-blue-800 absolute -left-[18px] top-[170px] rounded-l-lg"></div>
                <div className="h-[70px] w-[4px] bg-blue-800 absolute -right-[18px] top-[140px] rounded-r-lg"></div>

                {/* Tablet Screen */}
                <div className="rounded-[2.5rem] overflow-hidden w-[468px] h-[618px] bg-white relative">
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                    className="w-full h-full object-cover"
                    alt="Preview of Service Booking App"
                  />
                </div>
              </div>

              {/* Abstract Background Elements */}
              <div className="absolute -bottom-8 -right-16 w-48 h-48 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -top-14 -left-16 w-72 h-72 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
            </div>

            {/* Mobile Image (Simplified for Small Screens) */}
            <div className="md:hidden mx-auto max-w-[500px] relative">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                className="w-full h-auto rounded-xl shadow-lg"
                alt="Preview of Service Booking App"
              />
              <div className="absolute bottom-4 right-4 opacity-70">
                <Wrench size={32} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

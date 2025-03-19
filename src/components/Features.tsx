import { Wrench, Shield, Clock, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

// Feature items with improved clarity & UX
const featureItems = [
  {
    icon: <Wrench size={28} />,
    bgColor: 'bg-blue-600',
    title: 'Expert Technicians',
    description: 'Our verified professionals bring years of experience and the right tools to complete your job efficiently and effectively.'
  },
  {
    icon: <Shield size={28} />,
    bgColor: 'bg-blue-700',
    title: 'Guaranteed Work',
    description: 'Every service is backed by our satisfaction guarantee. If you’re not happy, we’ll make it right—no extra charge.'
  },
  {
    icon: <Clock size={28} />,
    bgColor: 'bg-blue-500',
    title: 'On-Time Service',
    description: 'We respect your time. If our professionals arrive late, your next service is discounted as a token of our commitment.'
  },
  {
    icon: <Star size={28} />,
    bgColor: 'bg-blue-600',
    title: 'Transparent Pricing',
    description: 'No hidden fees or unexpected costs. We provide clear, upfront pricing before you confirm your booking.'
  }
];

const Features = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="features" className="relative overflow-hidden py-12 bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-blue-200 rounded-full opacity-20 blur-3xl transform -translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full opacity-30 blur-3xl transform translate-x-1/4 translate-y-1/4"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm transition-all duration-700 ease-out"
                style={{ opacity: animated ? 1 : 0, transform: animated ? 'translateY(0)' : 'translateY(10px)' }}>
            <Wrench size={16} className="mr-2 animate-pulse" />
            Professional Home Services
          </span>
          <h2 className="text-2xl md:text-3xl font-bold my-3 transition-all duration-700 ease-out"
              style={{ opacity: animated ? 1 : 0, transform: animated ? 'translateY(0)' : 'translateY(20px)' }}>
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-transparent bg-clip-text">
              Experience the ServiceLink Difference
            </span>
          </h2>
          <p className="text-gray-700 text-base md:text-lg transition-all duration-700 ease-out"
             style={{ opacity: animated ? 1 : 0, transform: animated ? 'translateY(0)' : 'translateY(20px)' }}>
            We’ve reimagined home services to be reliable, transparent, and hassle-free—so you can focus on what matters most.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
          {featureItems.map((feature, index) => (
            <div 
              key={index}
              className="relative bg-white rounded-xl p-6 shadow-md border border-transparent hover:border-blue-400 transition-all duration-500 group cursor-pointer"
              style={{ 
                opacity: animated ? 1 : 0,
                transform: animated ? 'translateY(0)' : `translateY(${40}px)`,
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Icon Container */}
              <div className={`${feature.bgColor} text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md transition-transform duration-300 group-hover:scale-105`}>
                {feature.icon}
              </div>

              {/* Feature Title & Description */}
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-700 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8 transition-all duration-700 ease-out"
             style={{ opacity: animated ? 1 : 0, transform: animated ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '700ms' }}>
          <a href="#" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm">
            <Wrench size={16} className="mr-2" />
            Explore All Services
            <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;

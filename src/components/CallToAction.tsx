import { Wrench, ArrowRight, CheckCircle, Star, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const CallToAction = () => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  
    const handleClick = () => {
      navigate('/login'); // Replace '/signup' with the actual path to your signup page
    };
  
  const benefits = [
    { icon: <CheckCircle size={16} />, text: "100% Satisfaction Guarantee" },
    { icon: <Star size={16} />, text: "Top-rated professionals" },
    { icon: <Shield size={16} />, text: "Insured & background checked" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-12 md:py-16">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 bg-white opacity-5 w-72 h-72 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 bg-white opacity-5 w-72 h-72 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center p-2 bg-white bg-opacity-10 rounded-full mb-4 backdrop-blur-sm">
            <Wrench size={28} className="text-white" />
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Fix It Right the First Time?
          </h2>
          
          {/* Subheading */}
          <p className="text-lg text-white text-opacity-90 mb-6 max-w-2xl mx-auto">
            Join thousands of happy customers who have made home maintenance stress-free with ServiceLink.
          </p>
          
          {/* CTA Button */}
          <button 
            className="group relative bg-white hover:bg-gray-50 transition-all duration-300 text-blue-600 font-bold py-3 px-6 rounded-lg text-lg shadow-md mb-6 overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleClick}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center">
              <Wrench size={18} className={`mr-2 transition-all duration-300 ${isHovering ? 'rotate-12' : ''}`} />
              <span>Book a Service Now</span>
              <ArrowRight size={14} className={`ml-2 transition-all duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
            </span>
          </button>
          
          {/* Benefits List */}
          <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-3 md:gap-6 mt-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg py-2 px-3 shadow-md">
                <div className="mr-2 text-blue-200">
                  {benefit.icon}
                </div>
                <p className="text-white text-sm font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-white border-opacity-20">
            <p className="text-sm text-white text-opacity-80">Trusted by over 10,000+ homeowners across the country</p>
            
            {/* Rating Stars */}
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-300 fill-yellow-300 mx-0.5" />
              ))}
              <span className="ml-1 text-white font-medium">4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

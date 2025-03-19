import { Wrench, Settings, HardHat, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    number: 1,
    icon: <Wrench size={24} />,
    title: 'Choose Your Service',
    description: 'Select from our wide range of home repair and maintenance services.',
    bgColor: 'bg-blue-600',
    accentColor: 'from-blue-400 to-blue-600',
  },
  {
    number: 2,
    icon: <Settings size={24} />,
    title: 'Book a Professional',
    description: 'Browse through verified professionals, check their ratings, and select the one that fits your needs.',
    bgColor: 'bg-blue-500',
    accentColor: 'from-blue-400 to-blue-500',
  },
  {
    number: 3,
    icon: <HardHat size={24} />,
    title: 'Get Your Job Done',
    description: 'Your selected professional will arrive at the scheduled time. Track their arrival in real-time.',
    bgColor: 'bg-blue-400',
    accentColor: 'from-blue-300 to-blue-400',
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Dynamic background accent */}
      <div className={`absolute inset-0 bg-gradient-to-r ${steps[activeStep].accentColor} opacity-10 transition-all duration-500`} />

      <div className="container-custom relative z-10">
        {/* Header Section (Reduced margin) */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="flex justify-center mb-3">
            <Wrench size={36} className="text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Three Simple Steps to Home Service Bliss</h2>
          <p className="text-gray-600 text-base md:text-lg">ServiceLink makes finding and booking home services simple and stress-free.</p>
        </div>

        {/* Mobile Navigation */}
        <div className="flex overflow-x-auto pb-3 mb-6 md:hidden gap-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`flex-shrink-0 px-3 py-2 text-sm rounded-full font-medium transition-all duration-300 ${
                activeStep === index ? `text-white ${step.bgColor}` : 'text-gray-600 bg-gray-200'
              }`}
            >
              Step {step.number}
            </button>
          ))}
        </div>

        {/* Desktop Steps (Reduced height & spacing) */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-center transform transition-all duration-500 cursor-pointer ${
                activeStep === index ? 'scale-105 opacity-100 shadow-md' : 'scale-100 opacity-80'
              } hover:scale-105 hover:shadow-lg`}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div className={`step-circle ${step.bgColor} mx-auto shadow-md transition-all duration-300 text-sm w-12 h-12 flex items-center justify-center font-semibold`}>
                {step.number}
              </div>
              <div className="p-4 md:p-5 rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                <div className={`mb-4 flex justify-center transition-all duration-300 ${activeStep === index ? 'scale-110' : 'scale-100'}`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>

                {/* Arrow Indicator */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="text-gray-400 w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Step Details (Reduced padding & margins) */}
        <div className="md:hidden">
          <div className="bg-white rounded-lg p-5 shadow-md transition-all duration-300 hover:shadow-lg">
            <div className={`step-circle ${steps[activeStep].bgColor} mx-auto mb-4 text-sm w-10 h-10 flex items-center justify-center font-semibold`}>
              {steps[activeStep].number}
            </div>
            <div className="text-center mb-3">{steps[activeStep].icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-center">{steps[activeStep].title}</h3>
            <p className="text-gray-600 text-sm text-center">{steps[activeStep].description}</p>
          </div>
        </div>

        {/* Step Indicators (Reduced spacing) */}
        <div className="hidden md:flex justify-center mt-8 space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeStep === index ? `${steps[index].bgColor} scale-125` : 'bg-gray-300 hover:scale-110'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

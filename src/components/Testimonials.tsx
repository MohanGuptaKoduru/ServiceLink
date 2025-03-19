import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "Fixed my plumbing in an hour – amazing service! The app was so easy to use, and the plumber was professional and fast.",
    name: "Priya S.",
    location: "Chennai",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/79.jpg"
  },
  {
    id: 2,
    content: "I needed an electrician urgently and ServiceLink delivered. The professional arrived within 30 minutes and solved my issue.",
    name: "Michael T.",
    location: "Bangalore",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    content: "As a busy professional, I love how ServiceLink saves me time finding reliable home service providers. Great experience!",
    name: "Rahul K.",
    location: "Mumbai",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/11.jpg"
  },
  {
    id: 4,
    content: "The carpenter I booked through ServiceLink did an outstanding job with my furniture assembly. Will definitely use again!",
    name: "Ananya R.",
    location: "Hyderabad",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(window.innerWidth >= 768 ? 3 : 1);

  // Handle responsive itemsToShow
  useEffect(() => {
    const updateItemsToShow = () => {
      setItemsToShow(window.innerWidth >= 768 ? 3 : 1);
    };

    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section-padding bg-blue-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 text-lg">
            Don't just take our word for it – hear from people who have experienced ServiceLink.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Navigation Buttons */}
          <div className="hidden md:block">
            <button 
              onClick={prevSlide}
              className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-200 transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-200 transition"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Testimonials Grid/Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-transform duration-300 ease-in-out">
            {testimonials.slice(activeIndex, activeIndex + itemsToShow).map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className="bg-white p-6 rounded-xl shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill={i < testimonial.rating ? "currentColor" : "none"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"{testimonial.content}"</p>
              </div>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="mt-6 flex justify-center space-x-2 md:hidden">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "bg-blue-600 scale-125" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

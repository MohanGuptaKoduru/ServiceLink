import { Wrench, Home, Lightbulb, PaintBucket, HardHat, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: <Wrench size={32} />,
    title: "Plumbing Services",
    description: "From leaky taps to full pipe replacements, our experts ensure quality plumbing solutions.",
  },
  {
    icon: <Lightbulb size={32} />,
    title: "Electrical Repairs",
    description: "Safe and efficient electrical installations, wiring, and repairs for your home or office.",
  },
  {
    icon: <PaintBucket size={32} />,
    title: "Painting & Renovation",
    description: "Transform your space with professional painting and home improvement services.",
  },
  {
    icon: <Home size={32} />,
    title: "Home Cleaning",
    description: "Deep cleaning, carpet cleaning, and maintenance services to keep your home spotless.",
  },
  {
    icon: <HardHat size={32} />,
    title: "Carpentry & Furniture Work",
    description: "Custom furniture, repair work, and woodwork services by skilled professionals.",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Pest Control",
    description: "Keep your home pest-free with eco-friendly and effective extermination services.",
  },
];

const Services = () => {
  return (
    <section id="services" className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          We provide a wide range of professional home services to make your life easier.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <div className="bg-blue-500 text-white p-3 rounded-full shadow-md mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Explore All Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;

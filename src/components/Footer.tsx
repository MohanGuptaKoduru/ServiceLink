import { Mail, Phone, MapPin, Clock, ChevronRight, Send } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      
      {/* Newsletter Section */}
      <div className="container mx-auto px-6 py-10 border-b border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:w-1/2">
            <h3 className="text-2xl font-bold">Stay Connected</h3>
            <p className="text-gray-400 mt-2">Subscribe to receive exclusive offers and updates directly to your inbox.</p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-r-md transition-all flex items-center font-medium">
                <Send size={18} className="mr-2" />
                Subscribe
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Company Info */}
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-3">ServiceLink</h3>
            <div className="w-16 h-1 bg-blue-600 rounded mb-6"></div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Connecting homeowners with trusted service professionals for all your home maintenance needs since 2025.
            </p>
            <p className="text-white font-bold italic text-lg">
              "Connecting You to Trusted Professionals"
            </p>
          </div>

          {/* Quick Links */}
          <FooterSection title="Quick Links" links={[
            { name: "Home", href: "/" }, 
            { name: "Features", href: "#features" }, 
            { name: "How It Works", href: "#how-it-works" }, 
            { name: "Services", href: "#services" },
            { name: "Testimonials", href: "#testimonials" },
            { name: "Contact", href: "#contact" }
          ]} />

          {/* Contact Info */}
          <div>
            <FooterHeading title="Contact Us" />
            <ul className="space-y-4">
              <ContactItem icon={<MapPin size={18} />} text="Amrita Vishwa VidyaPeetham, Ettimadai-641112" />
              <ContactItem 
                icon={<Phone size={18} />} 
                links={[
                  { href: "tel:+918897417155", text:  "+91 8897 417 155" },
                  { href: "tel:+919390992475", text: "+91 9390 992 475" }
                ]}
              />
              <ContactItem 
                icon={<Mail size={18} />} 
                links={[
                  { href: "mailto:info@servicelink.com", text: "info@servicelink.com" },
                  { href: "mailto:support@servicelink.com", text: "support@servicelink.com" }
                ]}
              />
              <ContactItem icon={<Clock size={18} />} text="Monday-Friday: 9:00 AM - 6:00 PM"  />
            </ul>
          </div>

          {/* Cleaned Up Map Section */}
          <div>
            <FooterHeading title="Our Location" />
            <div className="rounded-lg overflow-hidden border border-gray-700 transition-all hover:border-blue-500 shadow-md">
              <iframe
                title="Amrita Vishwa Vidyapeetham Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.0300337358073!2d76.90061967506563!3d10.902715757612866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85b09fd1b9bb1%3A0x1b1294db1b2453d0!2sAmrita%20Vishwa%20Vidyapeetham%2C%20Coimbatore!5e0!3m2!1sen!2sin!4v1646727284343!5m2!1sen!2sin"
                width="100%"
                height="200"
                className="grayscale hover:grayscale-0 transition-all duration-300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} <span className="text-blue-500 font-medium">ServiceLink</span>. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <span className="text-gray-700">|</span>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🔹 Reusable Footer Section Component - ADDED BACK ✅
const FooterSection: React.FC<{ title: string; links: { name: string; href: string }[] }> = ({ title, links }) => (
  <div>
    <FooterHeading title={title} />
    <ul className="space-y-3">
      {links.map(({ name, href }) => (
        <li key={name} className="group">
          <a href={href} className="text-gray-400 hover:text-white flex items-center transition-all">
            <ChevronRight size={16} className="mr-2 text-blue-500 group-hover:translate-x-1 transform transition-transform duration-300" />
            {name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Contact Item Component
const ContactItem: React.FC<{ icon: React.ReactNode; text?: string; links?: { href: string; text: string }[] }> = ({ icon, text, links }) => (
  <li className="flex items-start group">
    <div className="bg-gray-800 p-2 rounded-md text-blue-500 mr-3 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">{icon}</div>
    <div className="text-gray-400">
      {links ? (
        links.map((link, index) => (
          <a key={index} href={link.href} className="block hover:text-white transition-colors">{link.text}</a>
        ))
      ) : (
        text && <p>{text}</p>
      )}
    </div>
  </li>
);

// Footer Heading Component
const FooterHeading: React.FC<{ title: string }> = ({ title }) => (
  <div className="mb-6">
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <div className="w-12 h-1 bg-blue-600 rounded"></div>
  </div>
);

export default Footer;

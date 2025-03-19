import rishiDeepImage from "/ghanukotarishideep1.png";
import MohanGuptaImage from "/MohanGupta.png";
const founders = [
  
    {
      name: "Mohan Gupta",
      role: "Co-Founder & CEO",
      image: MohanGuptaImage,
      bio: "Driven by innovation, Mohan Gupta has a decade of experience in transforming home services with cutting-edge technology.",
    },
    {
      name: "Rishi Deep",
      role: "Co-Founder & COO",
      image: rishiDeepImage,
      bio: "With expertise in operations, Rishi Deep ensures seamless service delivery and an unparalleled customer experience.",
    },
  ];
  
  const Founders = () => {
    return (
      <section id="founders" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Founders</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Our leadership team brings experience, innovation, and a passion for delivering top-notch home services.
          </p>
  
          {/* Founders Grid (Updated: Now Uses 2 Columns Instead of 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <div key={index} className="bg-white shadow-lg rounded-xl p-6 text-center transition hover:shadow-xl">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-blue-500"
                />
                <h3 className="text-xl font-semibold text-gray-900">{founder.name}</h3>
                <p className="text-blue-600 font-medium">{founder.role}</p>
                <p className="text-gray-600 text-sm mt-2">{founder.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Founders;
  
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  Wrench,
  Loader2,
  Star,
  User,
  Check,
  CreditCard,
  Droplets,
  PaintBucket,
  HardHat,
  Bug,
  Sparkles,
  Hammer,
  Search
} from 'lucide-react';

// Define a TypeScript interface for service data
interface Service {
  id: string;
  type: string;
  technicianId: string;
  technicianName: string;
  cost: number;
  status: 'pending' | 'completed' | 'canceled';
  customerId: string;
}

interface Technician {
  id?: string; // Optional for Firestore document ID
  name: string;
  email: string;
  phone: string;
  rating: number;
  languages: string;
  description: string;
  isAvailable: boolean;
  service: string; // Added service field
}

const CustomerServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch services from Firestore
  const fetchServices = async () => {
    try {
      const servicesQuery = query(collection(db, 'services'));
      const querySnapshot = await getDocs(servicesQuery);
      const servicesData: Service[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Service),
      }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Fetch technicians based on the selected service and availability
  const fetchTechnicians = async (serviceType: string) => {
    setIsLoading(true);
    try {
      const techniciansQuery = query(
        collection(db, 'technicians'),
        where('service', '==', serviceType),
        where('isAvailable', '==', true)
      );
      const querySnapshot = await getDocs(techniciansQuery);
      const techniciansData: Technician[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Technician),
      }));
      techniciansData.sort((a, b) => b.rating - a.rating);
      setTechnicians(techniciansData);
      setSelectedService(serviceType);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map services to their respective icons
  const serviceIcons = {
    Plumbing: Droplets, // Water-related services
    'Electrical services': Sparkles, // Electrical services
    'Painting & Renovation': PaintBucket, // Painting services
    'Home Cleaning': Sparkles, // Cleaning services
    'Carpentry & Furniture Work': Hammer, // Carpentry services
    'Pest Control': Bug, // Pest control services
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-16 bg-gray-800 h-full flex flex-col items-center py-4">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
          <ArrowLeft className="h-8 w-8 text-white" />
        </Button>
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/customer-dashboard')}>
          <Home className="h-8 w-8 text-white" />
        </Button>
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/customer-dashboard/services')}>
          <Wrench className="h-8 w-8 text-white" />
        </Button>
        <Button 
    variant="ghost" 
    className="mb-4" 
    onClick={() => navigate('/search')}
  >
    <Search className="h-8 w-8 text-white" />
  </Button>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/customer-dashboard/payments')}
        >
          <CreditCard className="h-8 w-8 text-white" /> {/* Payments Icon */}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-grow min-h-0 bg-gray-50 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Services</h1>

          {/* Available Services Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Available Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(serviceIcons).map(([service, IconComponent]) => (
                <div
                  key={service}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => fetchTechnicians(service)}
                >
                  <IconComponent className="h-6 w-6 text-blue-600 mb-2" /> {/* Dynamic Icon */}
                  <h3 className="font-medium text-gray-900">{service}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            selectedService && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Technicians Available for {selectedService}</h2>
                {technicians.length > 0 ? (
                  <div className="space-y-4">
                    {technicians.map((technician) => (
                      <div key={technician.id} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                              <User className="h-5 w-5 text-blue-600" />
                              {technician.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">Languages: {technician.languages}</p>
                            <p className="text-sm text-gray-500 mt-1">Description: {technician.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium text-gray-700">{technician.rating}</span>
                            </div>
                            <Button
                              onClick={() => navigate(`/customer-dashboard/book-technician/${technician.id}`)}
                              className="flex items-center gap-2"
                            >
                              <Check className="h-4 w-4" />
                              Book
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No available technicians found for {selectedService}</p>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerServicesPage;
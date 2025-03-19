import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Home, Wrench, CreditCard, Star, Phone, Mail, Globe, User, Check,Search } from 'lucide-react'; // Added icons
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the Technician interface
interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  languages: string;
  description: string;
  isAvailable: boolean;
  service: string;
  technicianaddress: string;
}

// Define the Customer interface
interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

const BookTechnicianPage = () => {
  const { technicianId } = useParams(); // Get technicianId from URL params
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null); // State for customer data
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();

  // Fetch technician details
  useEffect(() => {
    const fetchTechnician = async () => {
      if (technicianId) {
        try {
          const technicianDoc = await getDoc(doc(db, 'technicians', technicianId));
          if (technicianDoc.exists()) {
            setTechnician({ id: technicianDoc.id, ...technicianDoc.data() } as Technician);
          } else {
            console.error('Technician not found');
          }
        } catch (error) {
          console.error('Error fetching technician:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchTechnician();
  }, [technicianId]);

  // Fetch customer details
  useEffect(() => {
    const fetchCustomer = async () => {
      const customerId = auth.currentUser?.uid; // Get the current user's ID
      if (customerId) {
        try {
          const customerDoc = await getDoc(doc(db, 'customers', customerId));
          if (customerDoc.exists()) {
            setCustomer({ id: customerDoc.id, ...customerDoc.data() } as Customer);
          } else {
            console.error('Customer not found');
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
        }
      }
    };
    fetchCustomer();
  }, []);

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!technicianId || !technician || !customer) return;

    setIsBooking(true);
    try {
      const customerId = auth.currentUser?.uid; // Get the current user's ID
      if (!customerId) {
        throw new Error('Customer not authenticated');
      }

      const bookingData = {
        technicianId: technician.id,
        technicianName: technician.name,
        customerId: customerId, // Use the actual customer ID
        customerName: customer.name, // Add customer name
        customerPhone: customer.phone, // Add customer phone
        customerAddress: customer.address, // Add customer address
        service: technician.service,
        status: 'pending',
        createdAt: new Date().toISOString(),
        technicianphone: technician.phone,
        technicianaddress: technician.technicianaddress,
        rating: 0,
      };

      const bookingRef = doc(collection(db, 'bookings'));
      await setDoc(bookingRef, bookingData);

      toast.success('Booking confirmed successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      navigate('/customer-dashboard', { state: { bookingSuccess: true, bookingData } });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to confirm booking. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Technician not found
  if (!technician) {
    return <p className="p-6">Technician not found.</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-16 bg-gray-800 h-full flex flex-col items-center py-4">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
          <ArrowLeft className="h-8 w-8 text-white" />
        </Button>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/customer-dashboard')}
        >
          <Home className="h-8 w-8 text-white" />
        </Button>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/customer-dashboard/services')}
        >
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
          <CreditCard className="h-8 w-8 text-white" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-grow min-h-0 bg-gray-50 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <ToastContainer />
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Book {technician.name}</h1>

          {/* Technician Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="h-6 w-6 text-blue-600" />
                <p className="text-lg font-medium text-gray-900">{technician.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <Star className="h-6 w-6 text-yellow-500" />
                <p className="text-gray-700">
                  <strong>Rating:</strong> {technician.rating}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-blue-600" />
                <p className="text-gray-700">
                  <strong>Email:</strong> {technician.email}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-blue-600" />
                <p className="text-gray-700">
                  <strong>Phone:</strong> {technician.phone}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Globe className="h-6 w-6 text-blue-600" />
                <p className="text-gray-700">
                  <strong>Languages:</strong> {technician.languages}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Wrench className="h-6 w-6 text-blue-600" />
                <p className="text-gray-700">
                  <strong>Service:</strong> {technician.service}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Check className="h-6 w-6 text-blue-600" />
                <p className="text-gray-700">
                  <strong>Availability:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      technician.isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {technician.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Booking Confirmation Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to book {technician.name} for {technician.service}?
            </p>
            <Button
              onClick={handleConfirmBooking}
              disabled={isBooking || !technician.isAvailable}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isBooking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Confirm Booking'
              )}
            </Button>
            {!technician.isAvailable && (
              <p className="text-red-500 mt-4">
                This technician is currently unavailable for booking.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTechnicianPage;
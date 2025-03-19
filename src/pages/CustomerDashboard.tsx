import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Clock, Wrench, Receipt, User as UserIcon, CreditCard,Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface Booking {
  id: string;
  technicianId: string;
  technicianName: string;
  technicianphone?: string; // Ensure this field is included
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  service: string;
  status: 'pending' | 'completed' | 'canceled';
  createdAt: string;
  amount: number;
  rating?:number;
}

const CustomerDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, City, Country',
  });
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
const [rating, setRating] = useState(0);
const [bookingForRating, setBookingForRating] = useState<Booking | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchBookings(user.uid);
        fetchCustomerData(user.uid);
      } else {
        toast({
          title: "Authentication required",
          description: "Please login to access the dashboard",
          variant: "destructive",
        });
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate, toast]);

  // Fetch bookings for the logged-in customer
  const fetchBookings = async (userId: string) => {
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('customerId', '==', userId) // Filter by the current customer's ID
      );
      const querySnapshot = await getDocs(bookingsQuery);
      const bookingsData: Booking[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Booking),
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Fetch customer data
  const fetchCustomerData = async (userId: string) => {
    try {
      const customerDoc = await getDoc(doc(db, 'customers', userId));
      if (customerDoc.exists()) {
        setCustomer(customerDoc.data() as Customer);
      } else {
        console.log('No customer data found. Creating new document...');
        await setDoc(doc(db, 'customers', userId), customer);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  // Refresh bookings when the location state changes
  useEffect(() => {
    if (location.state?.refresh) {
      const userId = auth.currentUser?.uid;
      if (userId) {
        fetchBookings(userId);
      }
    }
  }, [location.state]);

  // Save customer profile to Firestore
  const handleProfileSave = async () => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'customers', user.uid), customer, { merge: true });
      setShowProfilePopup(false);
      console.log('Customer profile saved successfully!');
    } catch (error) {
      console.error('Error saving customer profile:', error);
    }
  };

  // Handle "View Details" button click
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };
  const handleGiveRating = (booking: Booking) => {
    setBookingForRating(booking);
    setIsRatingModalOpen(true);
  };

  const handleConfirmRating = async () => {
    if (!bookingForRating || !user) return;
  
    try {
      await setDoc(doc(db, 'bookings', bookingForRating.id), {
        ...bookingForRating,
        rating: rating,
      }, { merge: true });
  
      setIsRatingModalOpen(false);
      setRating(0);
      setBookingForRating(null);
  
      toast({
        title: "Rating submitted",
        description: "Your rating has been successfully submitted.",
        variant: "default",
      });
  
      // Refresh bookings to reflect the updated rating
      fetchBookings(user.uid);
    } catch (error) {
      console.error('Error updating rating:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your rating.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="flex h-screen">
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
      <div className="flex-grow min-h-0 bg-gray-50 p-6 overflow-auto">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" onClick={() => setShowProfilePopup(true)}>
            <UserIcon className="h-6 w-6 text-gray-700" />
          </Button>
        </div>

        {/* Customer Profile Popup */}
        {showProfilePopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Edit Customer Profile</h3>
                <button 
                  onClick={() => setShowProfilePopup(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={customer.name} 
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })} 
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={customer.email} 
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })} 
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="text" 
                    placeholder="Phone" 
                    value={customer.phone} 
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} 
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea 
                    placeholder="Address" 
                    value={customer.address} 
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })} 
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                    rows={2}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowProfilePopup(false)}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleProfileSave}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Home className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter(booking => booking.status === 'pending').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Technicians Hired</CardTitle>
                <Wrench className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(bookings.map(booking => booking.technicianId)).size}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <Receipt className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{bookings.reduce((acc, booking) => acc + (booking.amount || 0), 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Service History</h2>
              {bookings.length > 0 ? (
                <div className="divide-y">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{booking.service}</h3>
                          <p className="text-sm text-gray-500">{booking.technicianName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">Status: {booking.status}</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                          <Button
                            variant="outline"
                            onClick={() => handleViewDetails(booking)}
                          >
                            View Details
                          </Button>
                          
                          {/* Conditionally render the "Give Rating" button */}
                          {!booking.rating && (
                          <Button
                            variant="outline"
                            onClick={() => handleGiveRating(booking)}
                          >
                            Give Rating
                          </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No bookings found</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Give Rating</DialogTitle>
    </DialogHeader>
    {bookingForRating && (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">
            Technician Name: {bookingForRating.technicianName}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
          <input 
            type="number" 
            min="1" 
            max="5" 
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))} 
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
          />
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsRatingModalOpen(false)}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmRating}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Confirm
          </Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

      {/* Booking Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Booking ID: {selectedBooking.id}</h3>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Technician Name: {selectedBooking.technicianName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Technician Phone: {selectedBooking.technicianphone || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Booking Date: {new Date(selectedBooking.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Amount to be Paid: ₹{selectedBooking.amount || 'Not specified'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;
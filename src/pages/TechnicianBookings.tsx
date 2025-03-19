import { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, User, BookOpen, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AzureMap from "@/components/AzureMap";

interface Booking {
  id: string;
  userName: string;
  userContact: string;
  status: string;
  serviceType: string;
  bookingDate: string;
  amount?: number;
  technicianId: string;
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
  paymentRequested?: boolean;
  technicianaddress: string;
}

const TechnicianBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [technicianaddress, setTechnicianAddress] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchBookings(user.uid);
      } else {
        console.error('Technician not authenticated');
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchBookings = async (technicianId: string) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('technicianId', '==', technicianId));
      const querySnapshot = await getDocs(q);

      const fetchedBookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      console.log('Fetched Bookings:', fetchedBookings);
      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Error fetching bookings: ', error);
    }
  };

  const handleCompleteJob = async (bookingId: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'completed' });

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'completed' } : booking
        )
      );

      console.log('Job marked as completed successfully!');
    } catch (error) {
      console.error('Error completing job:', error);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleAskPayment = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedBookingId || !paymentAmount) return;

    try {
      const bookingRef = doc(db, 'bookings', selectedBookingId);
      await updateDoc(bookingRef, {
        amount: paymentAmount,
        paymentRequested: true,
      });

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === selectedBookingId
            ? { ...booking, amount: paymentAmount, paymentRequested: true }
            : booking
        )
      );

      console.log('Payment request sent successfully!');
      setIsPaymentModalOpen(false);
      setPaymentAmount(null);
      setSelectedBookingId(null);
    } catch (error) {
      console.error('Error updating booking with payment:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentAmount(null);
    setSelectedBookingId(null);
  };

  const handleViewDistance = (booking: Booking) => {
    setTechnicianAddress(booking.technicianaddress || '');
    setCustomerAddress(booking.customerAddress || '');
    setIsMapModalOpen(true);
  };

  const getTotalBookings = () => bookings.length;
  const getPendingBookings = () => bookings.filter((booking) => booking.status === 'pending').length;
  const getCompletedBookings = () => bookings.filter((booking) => booking.status === 'completed').length;
  const getTotalEarnings = () => bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-16 bg-gray-800 h-full flex flex-col items-center py-4">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
          <ArrowLeft className="h-8 w-8 text-white" />
        </Button>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/technician-dashboard')}
        >
          <Home className="h-8 w-8 text-white" />
        </Button>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/technician-dashboard/technician-bookings')}
        >
          <BookOpen className="h-8 w-8 text-white" />
        </Button>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/order-history')}
        >
          <CheckCircle className="h-8 w-8 text-white" />
        </Button>
      </div>
      <div className="flex-grow min-h-0 bg-gray-50 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalBookings()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getPendingBookings()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Bookings</CardTitle>
                <CheckCircle className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCompletedBookings()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <XCircle className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{getTotalEarnings()}</div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-500">No bookings found.</p>
              ) : (
                <div className="divide-y">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{booking.serviceType}</h3>
                          <p className="text-sm text-gray-500">
                            Customer: {booking.customerName} • Contact: {booking.customerPhone}
                          </p>
                          {booking.bookingDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              Booked for: {new Date(booking.bookingDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          {booking.amount && (
                            <span className="text-sm font-medium">₹{booking.amount}</span>
                          )}
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
                          <Button
                            variant="outline"
                            onClick={() => handleViewDistance(booking)}
                          >
                            View Distance
                          </Button>
                          {booking.status === 'pending' && !booking.paymentRequested && (
                            <Button
                              variant="outline"
                              onClick={() => handleAskPayment(booking.id)}
                            >
                              Ask Payment
                            </Button>
                          )}
                          {booking.status === 'pending' && (
                            <Button
                              variant="outline"
                              onClick={() => handleCompleteJob(booking.id)}
                            >
                              Complete Job
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Details of the selected booking.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Booking ID: {selectedBooking.id}</h3>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Customer Name: {selectedBooking.customerName || 'No name provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Address: {selectedBooking.customerAddress || 'No address provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Phone Number: {selectedBooking.customerPhone || 'No phone number provided'}
                </p>
              </div>
              {selectedBooking.amount && (
                <div>
                  <p className="text-sm text-gray-500">Amount: ₹{selectedBooking.amount}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={handleClosePaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ask Payment</DialogTitle>
            <DialogDescription>
              Enter the amount to request payment from the customer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleClosePaymentModal}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Modal */}
      <Dialog open={isMapModalOpen} onOpenChange={() => setIsMapModalOpen(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>View Distance</DialogTitle>
            <DialogDescription>
              View the distance between the technician and customer locations.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[500px] w-full">
            <AzureMap
              technicianaddress={technicianaddress}
              customerAddress={customerAddress}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicianBookings;
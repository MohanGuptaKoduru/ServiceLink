import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, CheckCircle,ArrowLeft,Home,Wrench,BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Booking {
  id: string;
  userName: string;
  userContact: string;
  status: string;
  serviceType: string;
  bookingDate: string;
  amount?: number;
  technicianId: string;
}

const OrderHistory = () => {
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCompletedBookings(user.uid);
      } else {
        console.error('User not authenticated');
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchCompletedBookings = async (technicianId: string) => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("technicianId", "==", technicianId), where("status", "==", "completed"));
      const querySnapshot = await getDocs(q);

      const fetchedBookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];

      setCompletedBookings(fetchedBookings);
    } catch (error) {
      console.error("Error fetching completed bookings: ", error);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Completed Bookings</h2>
              {completedBookings.length === 0 ? (
                <p className="text-gray-500">No completed bookings found.</p>
              ) : (
                <div className="divide-y">
                  {completedBookings.map((booking) => (
                    <div key={booking.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{booking.serviceType}</h3>
                          <p className="text-sm text-gray-500">
                            Customer: {booking.userName} • Contact: {booking.userContact}
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
                          <span className={`px-3 py-1 rounded-full text-sm bg-green-100 text-green-800`}>
                            {booking.status}
                          </span>
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
    </div>
  );
};

export default OrderHistory;
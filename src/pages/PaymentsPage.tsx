import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc,getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, XCircle, ArrowLeft, Home, Wrench,Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Payment {
  id: string;
  technicianId: string;
  technicianName: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'completed';
  bookingId: string;
  createdAt: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const customerId = auth.currentUser?.uid;
      if (!customerId) {
        throw new Error('Customer not authenticated');
      }

      const paymentsRef = collection(db, 'payments');
      const q = query(paymentsRef, where('customerId', '==', customerId));
      const querySnapshot = await getDocs(q);

      const fetchedPayments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];

      setPayments(fetchedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleMakePayment = async (paymentId: string) => {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      const paymentSnapshot = await getDoc(paymentRef);

      if (paymentSnapshot.exists()) {
        const paymentData = paymentSnapshot.data() as Payment;

        // Update payment status to 'completed'
        await updateDoc(paymentRef, { status: 'completed' });

        // Update the corresponding booking in the 'bookings' collection
        const bookingRef = doc(db, 'bookings', paymentData.bookingId);
        await updateDoc(bookingRef, { paymentStatus: 'completed' });

        // Update local state
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.id === paymentId ? { ...payment, status: 'completed' } : payment
          )
        );

        console.log('Payment confirmed successfully!');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  const handleConfirmPayment = async () => {
    if (selectedPaymentId) {
      await handleMakePayment(selectedPaymentId);
      setIsConfirmationOpen(false);
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
    onClick={() => navigate('/customer-dashboard/search')}
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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Payments</h1>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>
              {payments.length === 0 ? (
                <p className="text-gray-500">No pending payments found.</p>
              ) : (
                <div className="divide-y">
                  {payments.map((payment) => (
                    <div key={payment.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Payment to {payment.technicianName}</h3>
                          <p className="text-sm text-gray-500">Amount: ₹{payment.amount}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                          {payment.status === 'pending' && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedPaymentId(payment.id);
                                setIsConfirmationOpen(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Make Payment
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

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to make this payment?</p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsConfirmationOpen(false)}
            >
              No
            </Button>
            <Button
              onClick={handleConfirmPayment}
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
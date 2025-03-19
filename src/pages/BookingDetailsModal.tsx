import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

const BookingDetailsModal = ({ isOpen, onClose, booking }: BookingDetailsModalProps) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
          <div>
            <p className="text-sm text-gray-500">
              Address: {booking.customerAddress || 'No address provided'}
            </p>
          </div>
          {booking.amount && (
            <div>
              <p className="text-sm text-gray-500">Amount: ₹{booking.amount}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
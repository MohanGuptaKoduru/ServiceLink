import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Wrench, Star, Calendar, Home, BookOpen, CheckCircle, User as UserIcon } from 'lucide-react';

// Define Job type
interface Job {
  id: string;
  title: string;
  customerName: string;
  status: 'pending' | 'completed' | 'canceled';
  createdAt: string; // Use Date if needed
  rating?: number;
  languages: string;
  description: string;
  service: string; // Added service field
  technicianaddress: string;
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
  technicianaddress: string;
  specialties:string;
}

const TechnicianDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [technician, setTechnician] = useState<Technician>({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    rating: 4.5,
    languages: "Telugu,English,Hindi",
    description: "I am proficient in Electric works",
    isAvailable: true,
    service: "Electric",
    technicianaddress: "charminar,hyderabad",
    specialties:"AC repair,Coolers,Geysers",
  });
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchJobs(user.uid);
        fetchTechnicianData(user.uid); // Pass user.uid to fetchTechnicianData
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchJobs = async (userId: string) => {
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('technicianId', '==', userId) // Filter by the technician's ID
      );
      const querySnapshot = await getDocs(bookingsQuery);
      const jobsData: Job[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.service || 'Unknown', // Use the service as the title
          customerName: data.customerName || 'Unknown',
          status: data.status as 'pending' | 'completed' | 'canceled',
          createdAt: data.createdAt || new Date().toISOString(),
          rating: data.rating || 0, // Fetch the rating from the booking
          languages: data.languages || '', // Add if needed
          description: data.description || '', // Add if needed
          service: data.service || '', // Fetch the service
          technicianaddress: data.technicianaddress || 'Unknown', // Fetch the technician's address
        };
      });
      setJobs(jobsData);
  
      // Calculate the average rating
      const completedJobs = jobsData.filter(job => job.status === 'completed');
      const totalRating = completedJobs.reduce((sum, job) => sum + (job.rating || 0), 0);
      const averageRating = completedJobs.length > 0 ? parseFloat((totalRating / completedJobs.length).toFixed(1)) : 0;
  
      // Update the technician's document with the new average rating
      await updateDoc(doc(db, 'technicians', userId), {
        rating: averageRating // Convert string to number
      });
  
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter(job => job.status === 'pending').length;
  const jobsThisMonth = jobs.filter(job => {
    const jobDate = new Date(job.createdAt);
    const now = new Date();
    return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
  }).length;

  const fetchTechnicianData = async (userId: string) => {
    try {
      const technicianDoc = await getDoc(doc(db, 'technicians', userId)); // Use userId
      if (technicianDoc.exists()) {
        setTechnician(technicianDoc.data() as Technician);
      } else {
        console.log('No technician data found. Creating new document...');
        await setDoc(doc(db, 'technicians', userId), technician); // Use userId
      }
    } catch (error) {
      console.error('Error fetching technician data:', error);
    }
  };

  const handleProfileSave = async () => {
    if (!user) return; // Ensure user is available

    try {
      await setDoc(doc(db, 'technicians', user.uid), technician, { merge: true }); // Use user.uid
      setShowProfilePopup(false);
      console.log('Technician profile saved successfully!');
    } catch (error) {
      console.error('Error saving technician profile:', error);
    }
  };

  const toggleAvailability = async () => {
    if (!user) return; // Ensure user is available

    try {
      const updatedAvailability = !technician.isAvailable;
      const updatedTechnician = { ...technician, isAvailable: updatedAvailability };
      setTechnician(updatedTechnician);

      await updateDoc(doc(db, 'technicians', user.uid), { isAvailable: updatedAvailability }); // Use user.uid
      console.log('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const calculateAverageRating = () => {
    const completedJobs = jobs.filter(job => job.status === 'completed');
    if (completedJobs.length === 0) return 0;
    const totalRating = completedJobs.reduce((sum, job) => sum + (job.rating || 0), 0);
    return (totalRating / completedJobs.length).toFixed(1);
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
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={toggleAvailability}
            className={`flex items-center gap-2 ${technician.isAvailable ? 'text-green-600' : 'text-gray-500'}`}
          >
            <CheckCircle className="h-6 w-6" />
            <span>{technician.isAvailable ? 'Available' : 'Unavailable'}</span>
          </Button>
          <Button variant="ghost" onClick={() => setShowProfilePopup(true)}>
            <UserIcon className="h-6 w-6 text-gray-700" />
          </Button>
        </div>
        {showProfilePopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Edit Technician Profile</h3>
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
                    value={technician.name}
                    onChange={(e) => setTechnician({ ...technician, name: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={technician.email}
                    onChange={(e) => setTechnician({ ...technician, email: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="Phone"
                    value={technician.phone}
                    onChange={(e) => setTechnician({ ...technician, phone: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages Known</label>
                  <input
                    type="text"
                    placeholder="Languages Known"
                    value={technician.languages}
                    onChange={(e) => setTechnician({ ...technician, languages: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Description"
                    value={technician.description}
                    onChange={(e) => setTechnician({ ...technician, description: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={2}
                  />
                </div>
                <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <input
            type="text"
            placeholder="Rating"
            value={calculateAverageRating()}
            readOnly // Make the field read-only
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                  <textarea
                    placeholder="specialties"
                    value={technician.specialties}
                    onChange={(e) => setTechnician({ ...technician, specialties: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technician Address</label>
                  <textarea
                    placeholder="Technician Address"
                    value={technician.technicianaddress}
                    onChange={(e) => setTechnician({ ...technician, technicianaddress: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <select
                    value={technician.service}
                    onChange={(e) => setTechnician({ ...technician, service: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select a service</option>
                    {['Plumbing', 'Electrical services', 'Painting & Renovation', 'Home Cleaning', 'Carpentry & Furniture Work', 'Pest Control'].map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Technician Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Wrench className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalJobs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pendingJobs}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateAverageRating()}</div> {/* Dynamic rating */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobsThisMonth}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
              {jobs.length > 0 ? (
                <div className="divide-y">
                  {jobs.map((job) => (
                    <div key={job.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-gray-500">{job.customerName}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            job.status === 'completed' ? 'bg-green-100 text-green-800' :
                            job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No jobs found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
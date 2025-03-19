import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";

// Import Components
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Founders from "@/components/Founders";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

// Import Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import TechnicianDashboard from "./pages/TechnicialDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import TechnicianBookings from "./pages/TechnicianBookings";
import CustomerServicesPage from "./pages/CustomerServicesPage";
import BookTechnicianPage from "./pages/BookTechnicianPage";
import PaymentsPage from "./pages/PaymentsPage";
import OrderHistory from "./pages/OrderHistory";
 // <-- New SearchPage import
import SearchPage from "./pages/hello"

const queryClient = new QueryClient();

// Layout component to conditionally render Navbar or "Back to Home" button
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Define where the Navbar should be completely removed
  const hideEverything =
    ["/technician-dashboard", "/technician-dashboard/technician-bookings", "/customer-dashboard/services", "/customer-dashboard","/search", "/order-history","/customer-dashboard/payments"].some((path) =>
      location.pathname.startsWith(path)
    ) || location.pathname.startsWith("/customer-dashboard/book-technician");

  // Define where only the Navbar is hidden, but "Back to Home" button should appear
  const showBackButton = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideEverything && (
        <>
          {showBackButton ? (
            <div className="absolute top-4 left-4 z-50">
              <Link
                to="/"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                ← Back to Home
              </Link>
            </div>
          ) : (
            <Navbar />
          )}
        </>
      )}
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* ✅ Home Page */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Services />
                  <Founders />
                  <Features />
                  <HowItWorks />
                  <Testimonials />
                  <CallToAction />
                  <Footer />
                  <Chatbot />
                </>
              }
            />

            {/* ✅ Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ✅ Dashboards (NO Navbar, NO Back Button) */}
            <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/technician-dashboard/technician-bookings" element={<TechnicianBookings />} />
            <Route path="/customer-dashboard/services" element={<CustomerServicesPage />} />
            <Route path="/customer-dashboard/book-technician/:technicianId" element={<BookTechnicianPage />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/customer-dashboard/payments" element={<PaymentsPage />} />
            
            {/* ✅ Search Page */}
            <Route path="/search" element={<SearchPage />} />
            

            {/* ✅ Catch-All for Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
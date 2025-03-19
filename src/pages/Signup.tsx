import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import "./auth.css";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Wrench, 
  Chrome, 
  Sparkles, 
  Hammer, 
  PaintBucket, 
  Lightbulb, 
  Settings 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firebaseAuth, firestoreOperations } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ 
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    terms?: string;
    role?: string;
  }>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
      terms?: string;
      role?: string;
    } = {};
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must be at least 8 characters with at least one number and one special character';
    }

    if (phone && !phoneRegex.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Save user data to Firestore
        await firestoreOperations.saveUserData(user.uid, {
          name,
          email,
          phone,
          role,
        });

        // Send verification email
        await sendEmailVerification(user);

        toast({
          title: "Account created successfully",
          description: "A verification email has been sent to your email address. Please check your inbox and verify your email before logging in.",
        });

        navigate('/login');
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      let errorMessage = "An error occurred during signup";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!role) {
      setErrors({ ...errors, role: 'Please select a role' });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await firebaseAuth.signInWithGoogle();
      const user = result.user;

      if (user) {
        const existingRole = await firestoreOperations.getUserRole(user.uid);
        if (existingRole && existingRole !== role) {
          throw new Error(`An account already exists with role ${existingRole}. Please use that account.`);
        } else if (!existingRole) {
          await firestoreOperations.saveUserData(user.uid, {
            name: user.displayName || 'Google User',
            email: user.email || '',
            role: role,
            phone: user.phoneNumber || null,
          });
        }

        toast({
          title: "Signup successful",
          description: `Welcome to ServiceLink as a ${role}!`,
        });

        navigate(role === 'technician' ? '/technician-dashboard' : '/customer-dashboard');
      }
    } catch (error: unknown) {
      console.error('Google Sign-In Error:', error);
      let errorMessage = "Could not authenticate with Google";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Google Sign-Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-background flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="service-icons-container">
        <Wrench className="floating-icon text-blue-600 w-12 h-12" style={{ top: '15%', left: '10%', opacity: '0.7' }} />
        <Hammer className="floating-icon text-blue-500 w-14 h-14" style={{ top: '25%', right: '15%', opacity: '0.8' }} />
        <PaintBucket className="floating-icon text-blue-400 w-12 h-12" style={{ bottom: '30%', left: '20%', opacity: '0.7' }} />
        <Lightbulb className="floating-icon text-blue-300 w-10 h-10" style={{ bottom: '20%', right: '25%', opacity: '0.8' }} />
        <Settings className="floating-icon text-blue-700 w-16 h-16" style={{ top: '40%', left: '30%', opacity: '0.6' }} />
        <Sparkles className="floating-icon text-blue-400 w-10 h-10" style={{ top: '10%', right: '30%', opacity: '0.8' }} />
      </div>
      
      <div className="w-full max-w-3xl auth-card rounded-2xl p-6 relative z-10 hover-scale service-card-bg">
        <div className="mb-5 text-center fade-in">
          <div className="flex justify-center items-center mb-2">
            <Sparkles className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold blue-gradient-brand shine-effect">ServiceLink</h1>
          </div>
          <p className="mt-1 text-lg text-gray-600">Join the Future of Home Services</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="fade-in-delay-1">
              <label htmlFor="name" className="block text-base font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={`block w-full pl-10 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="fade-in-delay-1">
              <label htmlFor="email" className="block text-base font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full pl-10 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="fade-in-delay-2">
              <label htmlFor="password" className="block text-base font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`block w-full pl-10 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Min 8 chars with number and special char.
              </p>
            </div>

            <div className="fade-in-delay-2">
              <label htmlFor="phone" className="block text-base font-medium text-gray-700">Phone Number (Optional)</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={`block w-full pl-10 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div className="fade-in-delay-2">
            <label htmlFor="role" className="block text-base font-medium text-gray-700">I am a</label>
            <div className="mt-1 flex space-x-6">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center py-2 px-4 border rounded-md shadow-sm text-base font-medium transition-all ${role === 'customer' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setRole('customer')}
              >
                <User className="h-5 w-5 mr-2" />
                Customer
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center py-2 px-4 border rounded-md shadow-sm text-base font-medium transition-all ${role === 'technician' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setRole('technician')}
              >
                <Wrench className="h-5 w-5 mr-2" />
                Technician
              </button>
            </div>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          <div className="flex items-center fade-in-delay-3">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded transition-all"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
          {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in-delay-3">
            <Button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" /> Sign Up
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-all"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5 text-red-600" />
              <span className="ml-2">Sign up with Google</span>
            </Button>
          </div>
        </form>
        
        <div className="mt-4 text-center fade-in-delay-3">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline transition-all">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

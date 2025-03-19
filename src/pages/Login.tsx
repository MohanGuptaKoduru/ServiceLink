import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Chrome, 
  Sparkles, 
  Wrench, 
  Hammer, 
  PaintBucket, 
  Lightbulb 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, firebaseAuth, firestoreOperations } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        const role = await firestoreOperations.getUserRole(user.uid);
        if (!role) {
          throw new Error('User role not found. Please contact support.');
        }
        toast({
          title: "Login successful",
          description: `Welcome back as a ${role}!`,
        });
        navigate(role === 'technician' ? '/technician-dashboard' : '/customer-dashboard');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      let errorMessage = "Invalid email or password";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (error: unknown) {
      console.error('Forgot Password error:', error);
      let errorMessage = "Could not send reset email.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await firebaseAuth.signInWithGoogle();
      const user = result.user;
      if (user) {
        const role = await firestoreOperations.getUserRole(user.uid);
        if (!role) {
          throw new Error("No role found for this account. Please sign up first.");
        }
        toast({
          title: "Login successful",
          description: `Welcome back as a ${role}!`,
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
        title: "Google Sign-In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-background flex flex-col justify-center items-center px-4 relative">
      <div className="service-icons-container">
        <Wrench className="floating-icon text-blue-400 w-12 h-12" style={{ top: '15%', left: '10%' }} />
        <Hammer className="floating-icon text-indigo-500 w-10 h-10" style={{ top: '25%', right: '15%' }} />
        <PaintBucket className="floating-icon text-purple-400 w-8 h-8" style={{ bottom: '30%', left: '20%' }} />
        <Lightbulb className="floating-icon text-yellow-400 w-10 h-10" style={{ bottom: '20%', right: '25%' }} />
      </div>
      
      <div className="w-full max-w-md auth-card rounded-2xl p-8 relative z-10 hover-scale service-card-bg">
        <div className="mb-6 text-center fade-in">
          <div className="flex justify-center items-center mb-3">
            <Sparkles className="h-7 w-7 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold blue-gradient-brand shine-effect">ServiceLink</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">Access Your Trusted Home Services</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="fade-in-delay-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
          
          {/* Password Field */}
          <div className="fade-in-delay-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`block w-full pl-10 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all`}
                placeholder="Enter your password"
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
          </div>
          
          <div className="flex items-center justify-between fade-in-delay-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded transition-all"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              className="text-sm text-blue-600 hover:underline focus:outline-none transition-all"
            >
              Forgot your password?
            </button>
          </div>
          
          <div className="fade-in-delay-3">
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
                  Logging in...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" /> Login
                </>
              )}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 fade-in-delay-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5 text-red-600" />
              <span className="ml-2">Continue with Google</span>
            </Button>
          </div>
        </div>
        
        <div className="mt-6 text-center fade-in-delay-3">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:underline transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

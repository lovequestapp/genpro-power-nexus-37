import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(identifier, password);
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full opacity-50 -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gray-200 rounded-full opacity-60 translate-x-24 translate-y-24"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200/60 shadow-2xl rounded-3xl p-8 space-y-8">
          <div className="flex justify-center">
            <Logo />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="identifier"
                type="text"
                autoComplete="email"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="h-12 text-base px-4 bg-white/70 border-2 border-gray-200/80 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-shadow duration-300 shadow-sm focus:shadow-md"
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base px-4 bg-white/70 border-2 border-gray-200/80 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-shadow duration-300 shadow-sm focus:shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-base font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-300/80 transition-all duration-300 transform hover:-translate-y-0.5" 
              size="lg" 
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-sm space-y-2">
            <Link to="/forgot-password" className="font-medium text-gray-600 hover:text-orange-600">
              Forgot password?
            </Link>
          </div>
        </div>
        
        <footer className="text-center text-xs text-gray-400 mt-8">
          <p>Developed by Cardinal Consulting for HOU GEN PROS.</p>
          <p>Licensed to and owned by HOU GEN PROS.</p>
        </footer>
      </motion.div>
    </div>
  );
} 
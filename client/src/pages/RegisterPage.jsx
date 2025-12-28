import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, UserPlus, Lock, User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userRegister } from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await userRegister(
        formData.username,
        formData.email,
        formData.password
      );
      
      if (response && response.success) {
        setAuth(response.user, response.token);
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Register error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex mb-4"
            >
              <div className="p-4 bg-gradient-forest rounded-full text-white shadow-lg">
                <Coffee size={32} />
              </div>
            </motion.div>
            <h1 className="text-3xl font-serif font-bold bg-gradient-coffee bg-clip-text text-transparent mb-2">
              Join BrewVibe
            </h1>
            <p className="text-coffee-600/70">Create your account to save favorites</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-coffee-600">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-600/40" size={20} />
                <input
                  type="text"
                  required
                  minLength={3}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-coffee-900/10 focus:border-forest-700/50 rounded-xl outline-none transition-all placeholder:text-coffee-800/40 text-coffee-900"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-coffee-600">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-600/40" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-coffee-900/10 focus:border-forest-700/50 rounded-xl outline-none transition-all placeholder:text-coffee-800/40 text-coffee-900"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-coffee-600">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-600/40" size={20} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-coffee-900/10 focus:border-forest-700/50 rounded-xl outline-none transition-all placeholder:text-coffee-800/40 text-coffee-900"
                  placeholder="Create a password (min 6 characters)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-coffee-600">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-600/40" size={20} />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-coffee-900/10 focus:border-forest-700/50 rounded-xl outline-none transition-all placeholder:text-coffee-800/40 text-coffee-900"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-coffee-600/70">
              Already have an account?{' '}
              <Link to="/login" className="text-forest-800 hover:text-forest-900 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
            <Link to="/" className="block text-sm text-coffee-600/70 hover:text-coffee-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, LogIn, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      
      if (response && response.success) {
        setAuth(response.user, response.token);
        navigate('/admin');
      } else {
        setError('Login failed. Invalid response from server.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
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
              BrewVibe Admin
            </h1>
            <p className="text-coffee-600/70">Sign in to access admin panel</p>
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-coffee-600">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-600/40" size={20} />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-coffee-900/10 focus:border-forest-700/50 rounded-xl outline-none transition-all placeholder:text-coffee-800/40 text-coffee-900"
                  placeholder="Enter your username or email"
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-coffee-900/10 focus:border-forest-700/50 rounded-xl outline-none transition-all placeholder:text-coffee-800/40 text-coffee-900"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-coffee-600/70 hover:text-coffee-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Default Credentials Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-coffee-600/60">
            Default: admin / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;


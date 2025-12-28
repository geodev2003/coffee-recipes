import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, LogOut, Edit2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        setFormData({
          username: response.user.username,
          email: response.user.email
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await updateUserProfile(formData.username, formData.email);
      if (response.success) {
        updateUser(response.user);
        setSuccess('Profile updated successfully!');
        setEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-coffee-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 pt-8">
        <div className="max-w-3xl mx-auto px-6">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-coffee bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <p className="text-coffee-600/70">Manage your account settings</p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-forest-700/10 border border-forest-700/20 rounded-xl text-forest-800">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                {error}
              </div>
            )}

            {!editing ? (
              /* View Mode */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-forest rounded-full text-white">
                      <User size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-coffee-900">
                        {user?.username}
                      </h2>
                      <p className="text-coffee-600/70">{user?.email}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditing(true)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </motion.button>
                </div>

                <div className="pt-6 border-t border-coffee-900/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="text-coffee-600/60" size={20} />
                    <div>
                      <p className="text-sm text-coffee-600/60">Username</p>
                      <p className="font-semibold text-coffee-900">{formData.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-coffee-600/60" size={20} />
                    <div>
                      <p className="text-sm text-coffee-600/60">Email</p>
                      <p className="font-semibold text-coffee-900">{formData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-coffee-900/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="btn-secondary text-red-600 hover:bg-red-50 w-full flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </motion.button>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-bold text-coffee-900">Edit Profile</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      fetchProfile();
                      setError('');
                    }}
                    className="p-2 hover:bg-coffee-900/5 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-coffee-800">
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
                      className="search-input pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-coffee-800">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-600/40" size={20} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="search-input pl-12"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center gap-2 flex-1"
                  >
                    <Save size={20} />
                    Save Changes
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      fetchProfile();
                      setError('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;


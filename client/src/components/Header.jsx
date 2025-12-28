import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, Menu, X, User, Heart, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/coffee', label: 'Coffee' },
        { path: '/tea', label: 'Tea' },
        { path: '/mocktail', label: 'Mocktail' },
        { path: '/about', label: 'About Us' },
        { path: '/admin', label: 'Admin' },
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    // Close user menu when clicking outside
    React.useEffect(() => {
        if (!userMenuOpen) return;
        
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-menu-container')) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userMenuOpen]);

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-coffee-900/10 shadow-soft">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Brand */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-forest rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative p-2.5 bg-gradient-forest rounded-full text-white shadow-lg">
                                <Coffee size={28} />
                            </div>
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold bg-gradient-coffee bg-clip-text text-transparent">
                                BrewVibe
                            </h1>
                            <p className="text-xs text-espresso-800/60 font-medium -mt-1">
                                Premium Beverages
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.filter(item => item.path !== '/admin' || isAdmin).map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                    isActive(item.path)
                                        ? 'text-forest-800 bg-forest-800/10'
                                        : 'text-espresso-800 hover:text-forest-800 hover:bg-forest-800/5'
                                }`}
                            >
                                {item.label}
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-forest-800/10 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                        
                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative ml-2 user-menu-container">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-espresso-800 hover:bg-forest-800/5 transition-all"
                                >
                                    <User size={18} />
                                    {user?.username}
                                    <ChevronDown size={16} className={userMenuOpen ? 'rotate-180' : ''} />
                                </button>
                                
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 glass-card p-2 shadow-card z-50"
                                        >
                                            <Link
                                                to="/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-forest-800/5 transition-colors text-coffee-900"
                                            >
                                                <User size={18} />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-forest-800/5 transition-colors text-coffee-900"
                                            >
                                                <Heart size={18} />
                                                Wishlist
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-forest-800/5 transition-colors text-coffee-900"
                                                >
                                                    <Coffee size={18} />
                                                    Admin
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setUserMenuOpen(false);
                                                    navigate('/');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-red-600 text-left"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2.5 rounded-xl font-semibold text-sm text-espresso-800 hover:bg-forest-800/5 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2.5 rounded-xl font-semibold text-sm btn-primary"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-espresso-800 hover:bg-espresso-900/5 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden mt-4 overflow-hidden"
                        >
                            <div className="flex flex-col gap-2 pb-4">
                                {navItems.filter(item => item.path !== '/admin' || isAdmin).map((item, index) => (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`block px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                                                isActive(item.path)
                                                    ? 'text-forest-800 bg-forest-800/10'
                                                    : 'text-espresso-800 hover:bg-forest-800/5'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                
                                {/* Mobile User Menu */}
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-5 py-3 rounded-xl font-semibold text-sm text-espresso-800 hover:bg-forest-800/5"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/wishlist"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-5 py-3 rounded-xl font-semibold text-sm text-espresso-800 hover:bg-forest-800/5"
                                        >
                                            Wishlist
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                                navigate('/');
                                            }}
                                            className="block w-full text-left px-5 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-5 py-3 rounded-xl font-semibold text-sm text-espresso-800 hover:bg-forest-800/5"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-5 py-3 rounded-xl font-semibold text-sm bg-forest-800 text-white"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;


import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Mail, Github, Facebook, Instagram, Twitter, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        recipes: [
            { label: 'Coffee', path: '/coffee' },
            { label: 'Tea', path: '/tea' },
            { label: 'Mocktail', path: '/mocktail' },
            { label: 'All Recipes', path: '/' },
        ],
        about: [
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/about#contact' },
            { label: 'Privacy Policy', path: '/about#privacy' },
            { label: 'Terms of Service', path: '/about#terms' },
        ],
        account: [
            { label: 'Login', path: '/login' },
            { label: 'Register', path: '/register' },
            { label: 'Profile', path: '/profile' },
            { label: 'Wishlist', path: '/wishlist' },
        ],
    };

    const socialLinks = [
        { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
        { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
        { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
        { icon: <Github size={20} />, href: '#', label: 'GitHub' },
    ];

    return (
        <footer className="bg-gradient-to-b from-cream-50 to-white border-t border-coffee-900/10 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/" className="flex items-center gap-3 mb-4 group">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-forest rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative p-2 bg-gradient-forest rounded-full text-white shadow-lg">
                                    <Coffee size={24} />
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-serif font-bold bg-gradient-coffee bg-clip-text text-transparent">
                                    BrewVibe
                                </h3>
                                <p className="text-xs text-espresso-800/60 font-medium -mt-1">
                                    Premium Beverages
                                </p>
                            </div>
                        </Link>
                        <p className="text-sm text-espresso-800/70 mb-4 leading-relaxed">
                            Discover curated premium coffee, tea, and beverage recipes crafted for the modern connoisseur.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-espresso-800/60">
                            <Mail size={16} />
                            <a href="mailto:contact@brewvibe.com" className="hover:text-forest-800 transition-colors">
                                contact@brewvibe.com
                            </a>
                        </div>
                    </motion.div>

                    {/* Recipes Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="text-lg font-serif font-bold text-espresso-900 mb-4">Recipes</h4>
                        <ul className="space-y-2">
                            {footerLinks.recipes.map((link, index) => (
                                <motion.li
                                    key={link.path}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                >
                                    <Link
                                        to={link.path}
                                        className="text-sm text-espresso-800/70 hover:text-forest-800 transition-colors inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* About Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="text-lg font-serif font-bold text-espresso-900 mb-4">About</h4>
                        <ul className="space-y-2">
                            {footerLinks.about.map((link, index) => (
                                <motion.li
                                    key={link.path}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                >
                                    <Link
                                        to={link.path}
                                        className="text-sm text-espresso-800/70 hover:text-forest-800 transition-colors inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Account Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h4 className="text-lg font-serif font-bold text-espresso-900 mb-4">Account</h4>
                        <ul className="space-y-2">
                            {footerLinks.account.map((link, index) => (
                                <motion.li
                                    key={link.path}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                >
                                    <Link
                                        to={link.path}
                                        className="text-sm text-espresso-800/70 hover:text-forest-800 transition-colors inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Social Links & Copyright */}
                <div className="pt-8 border-t border-coffee-900/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-espresso-800/60 hover:text-forest-800 hover:bg-forest-800/5 rounded-lg transition-colors"
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 }}
                            className="text-sm text-espresso-800/60 flex items-center gap-2"
                        >
                            © {currentYear} BrewVibe. Made with{' '}
                            <Heart size={14} className="text-red-500 fill-current" />{' '}
                            for beverage lovers
                        </motion.p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


import React from 'react';
import { Coffee, Heart, Award, Users, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage = () => {
    const features = [
        {
            icon: <Coffee size={32} />,
            title: 'Premium Recipes',
            description: 'Curated collection of the finest beverage recipes from around the world',
        },
        {
            icon: <Award size={32} />,
            title: 'Expert Curation',
            description: 'Each recipe is carefully selected and tested by our team of experts',
        },
        {
            icon: <Users size={32} />,
            title: 'Community Driven',
            description: 'Join a community of beverage enthusiasts sharing their passion',
        },
        {
            icon: <Target size={32} />,
            title: 'For Everyone',
            description: 'From beginners to connoisseurs, find recipes that suit your skill level',
        },
    ];

    const values = [
        {
            title: 'Quality',
            description: 'We believe in only showcasing the highest quality recipes and ingredients',
        },
        {
            title: 'Innovation',
            description: 'Constantly exploring new flavors and techniques to elevate your experience',
        },
        {
            title: 'Sustainability',
            description: 'Committed to promoting sustainable practices in beverage preparation',
        },
        {
            title: 'Passion',
            description: 'Driven by our love for exceptional beverages and sharing that joy',
        },
    ];

    return (
        <div className="min-h-screen pb-20 pt-8">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-20 px-6"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center mb-8"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-forest rounded-full blur-2xl opacity-30" />
                        <div className="relative p-6 bg-gradient-forest rounded-full text-white shadow-2xl">
                            <Coffee size={48} />
                        </div>
                    </div>
                </motion.div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 bg-gradient-coffee bg-clip-text text-transparent">
                    About BrewVibe
                </h1>
                <p className="text-xl md:text-2xl text-espresso-800/70 max-w-3xl mx-auto leading-relaxed">
                    Your destination for discovering and sharing premium coffee, tea, and beverage recipes
                </p>
            </motion.section>

            {/* Story Section */}
            <section className="max-w-5xl mx-auto px-6 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 md:p-12"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-espresso-900">
                        Our Story
                    </h2>
                    <div className="space-y-4 text-lg text-espresso-800/80 leading-relaxed">
                        <p>
                            BrewVibe was born from a simple idea: to create a space where beverage enthusiasts 
                            could discover, share, and perfect their craft. Whether you're a coffee aficionado, 
                            a tea connoisseur, or someone who loves exploring refreshing mocktails, we've got 
                            something special for you.
                        </p>
                        <p>
                            Our mission is to make premium beverage recipes accessible to everyone. We believe 
                            that creating the perfect cup of coffee or tea should be an enjoyable journey, not 
                            a complicated process. That's why we curate our collection with both beginners and 
                            experts in mind.
                        </p>
                        <p>
                            Every recipe in our collection is carefully selected, tested, and presented with 
                            clear instructions, beautiful imagery, and helpful tips to ensure your success. 
                            We're constantly expanding our library to bring you the latest trends and timeless 
                            classics from around the world.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-6 mb-20">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-espresso-900"
                >
                    What We Offer
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glass-card p-6 text-center"
                        >
                            <div className="inline-flex p-4 bg-gradient-forest rounded-full text-white mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-3 text-espresso-900">
                                {feature.title}
                            </h3>
                            <p className="text-espresso-800/70 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Values Section */}
            <section className="max-w-5xl mx-auto px-6 mb-20">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-espresso-900"
                >
                    Our Values
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                            className="glass-card p-6"
                        >
                            <h3 className="text-2xl font-serif font-bold mb-3 text-forest-800">
                                {value.title}
                            </h3>
                            <p className="text-espresso-800/70 leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="max-w-4xl mx-auto px-6 text-center"
            >
                <div className="glass-card p-12 bg-gradient-warm">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="inline-flex mb-6"
                    >
                        <Sparkles size={48} className="text-gold-500" />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-espresso-900">
                        Join Our Community
                    </h2>
                    <p className="text-xl text-espresso-800/70 mb-8 max-w-2xl mx-auto">
                        Start your journey today and discover the perfect beverage for every moment
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 text-forest-800 font-semibold"
                    >
                        <Heart size={20} className="fill-current text-red-500" />
                        <span>Made with passion for beverage lovers</span>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default AboutPage;


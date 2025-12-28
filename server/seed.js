const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
require('dotenv').config();

const recipes = [
    {
        title: "Classic Cappuccino",
        slug: "classic-cappuccino",
        description: "A perfect balance of espresso, steamed milk, and foam. The classic Italian breakfast drink.",
        ingredients: [
            { name: "Espresso Coffee", amount: "18", unit: "g" },
            { name: "Whole Milk", amount: "150", unit: "ml" },
            { name: "Cocoa Powder", amount: "optional", unit: "" }
        ],
        instructions: [
            "Brew a double shot of espresso.",
            "Steam the milk until it has a silky microfoam.",
            "Pour the steamed milk over the espresso, holding back the foam with a spoon, then top with foam."
        ],
        prepTime: 10,
        difficulty: "Medium",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80",
        calories: 120,
        category: "Coffee",
        rating: 4.8,
        reviewsCount: 124
    },
    {
        title: "Japanese Matcha Latte",
        slug: "japanese-matcha-latte",
        description: "Smooth, creamy, and earthy matcha green tea latte. High in antioxidants.",
        ingredients: [
            { name: "Matcha Powder", amount: "1", unit: "tsp" },
            { name: "Almond Milk", amount: "200", unit: "ml" },
            { name: "Honey", amount: "1", unit: "tbsp" },
            { name: "Hot Water", amount: "2", unit: "tbsp" }
        ],
        instructions: [
            "Sift matcha powder into a bowl.",
            "Add hot water and whisk vigorously with a bamboo whisk until frothy.",
            "Heat almond milk and pour over the matcha base.",
            "Stir in honey to taste."
        ],
        prepTime: 5,
        difficulty: "Medium",
        image: "https://images.unsplash.com/photo-1515825838458-f2a94b2010e7?auto=format&fit=crop&q=80",
        calories: 80,
        category: "Tea",
        rating: 4.9,
        reviewsCount: 89
    },
    {
        title: "Berry Sparkler Mocktail",
        slug: "berry-sparkler-mocktail",
        description: "Refreshing mixed berry mocktail with mint and lime. Perfect for summer afternoons.",
        ingredients: [
            { name: "Mixed Berries", amount: "1/2", unit: "cup" },
            { name: "Mint Leaves", amount: "5", unit: "leaves" },
            { name: "Lime Juice", amount: "1", unit: "tbsp" },
            { name: "Sparkling Water", amount: "150", unit: "ml" },
            { name: "Ice", amount: "as needed", unit: "" }
        ],
        instructions: [
            "Muddle berries and mint in a glass.",
            "Add ice and lime juice.",
            "Top with sparkling water and stir gently.",
            "Garnish with fresh mint and berries."
        ],
        prepTime: 5,
        difficulty: "Easy",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80",
        calories: 45,
        category: "Mocktail",
        rating: 4.7,
        reviewsCount: 67
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brewvibe')
    .then(async () => {
        console.log('Connected to MongoDB');
        await Recipe.deleteMany({});
        console.log('Cleared existing recipes');
        await Recipe.insertMany(recipes);
        console.log('Seeded recipes successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

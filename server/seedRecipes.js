require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

const recipes = [
  // Coffee Recipes (10)
  {
    title: "Classic Espresso",
    slug: "classic-espresso",
    description: "The foundation of all coffee drinks. Rich, bold, and full-bodied espresso shot.",
    ingredients: [
      { name: "Espresso Coffee Beans", amount: "18", unit: "g" },
      { name: "Water", amount: "30", unit: "ml" }
    ],
    instructions: [
      "Grind coffee beans to fine consistency",
      "Tamp the coffee grounds evenly in portafilter",
      "Extract espresso for 25-30 seconds",
      "Serve immediately in preheated cup"
    ],
    prepTime: 5,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800",
    calories: 5,
    category: "Coffee",
    rating: 4.8,
    reviewsCount: 245
  },
  {
    title: "Cappuccino",
    slug: "cappuccino",
    description: "Perfect balance of espresso, steamed milk, and velvety foam. The classic Italian breakfast drink.",
    ingredients: [
      { name: "Espresso", amount: "1", unit: "shot" },
      { name: "Whole Milk", amount: "150", unit: "ml" },
      { name: "Cocoa Powder", amount: "optional", unit: "" }
    ],
    instructions: [
      "Brew a double shot of espresso",
      "Steam milk until it reaches 65°C with microfoam",
      "Pour steamed milk over espresso, holding back foam",
      "Top with foam and dust with cocoa powder if desired"
    ],
    prepTime: 10,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=800",
    calories: 120,
    category: "Coffee",
    rating: 4.9,
    reviewsCount: 312
  },
  {
    title: "Flat White",
    slug: "flat-white",
    description: "Australian favorite with double espresso and velvety microfoam milk.",
    ingredients: [
      { name: "Double Espresso", amount: "2", unit: "shots" },
      { name: "Whole Milk", amount: "120", unit: "ml" }
    ],
    instructions: [
      "Pull double shot of espresso",
      "Steam milk to create microfoam (not too frothy)",
      "Pour milk in circular motion over espresso",
      "Create latte art if desired"
    ],
    prepTime: 8,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800",
    calories: 110,
    category: "Coffee",
    rating: 4.7,
    reviewsCount: 189
  },
  {
    title: "Americano",
    slug: "americano",
    description: "Espresso diluted with hot water for a smooth, less intense coffee experience.",
    ingredients: [
      { name: "Espresso", amount: "1-2", unit: "shots" },
      { name: "Hot Water", amount: "150-200", unit: "ml" }
    ],
    instructions: [
      "Brew espresso shot(s)",
      "Heat water to 90-95°C",
      "Pour hot water over espresso",
      "Stir gently and serve"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800",
    calories: 10,
    category: "Coffee",
    rating: 4.5,
    reviewsCount: 156
  },
  {
    title: "Mocha",
    slug: "mocha",
    description: "Chocolate and coffee combined in perfect harmony. A sweet treat for coffee lovers.",
    ingredients: [
      { name: "Espresso", amount: "1", unit: "shot" },
      { name: "Chocolate Syrup", amount: "2", unit: "tbsp" },
      { name: "Steamed Milk", amount: "150", unit: "ml" },
      { name: "Whipped Cream", amount: "optional", unit: "" }
    ],
    instructions: [
      "Brew espresso shot",
      "Add chocolate syrup to cup and stir with espresso",
      "Steam milk and pour over chocolate espresso",
      "Top with whipped cream and chocolate shavings"
    ],
    prepTime: 8,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=800",
    calories: 250,
    category: "Coffee",
    rating: 4.6,
    reviewsCount: 278
  },
  {
    title: "Cold Brew",
    slug: "cold-brew",
    description: "Smooth, less acidic coffee brewed cold for 12-24 hours. Perfect for hot days.",
    ingredients: [
      { name: "Coarse Ground Coffee", amount: "100", unit: "g" },
      { name: "Cold Water", amount: "1", unit: "liter" },
      { name: "Ice", amount: "as needed", unit: "" }
    ],
    instructions: [
      "Combine coarse coffee grounds with cold water",
      "Stir gently to ensure all grounds are saturated",
      "Cover and steep in refrigerator for 12-24 hours",
      "Strain through fine mesh or coffee filter",
      "Serve over ice, diluted with water or milk to taste"
    ],
    prepTime: 1440,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800",
    calories: 5,
    category: "Coffee",
    rating: 4.8,
    reviewsCount: 201
  },
  {
    title: "Cortado",
    slug: "cortado",
    description: "Spanish-style coffee with equal parts espresso and warm milk. Balanced and smooth.",
    ingredients: [
      { name: "Espresso", amount: "1", unit: "shot" },
      { name: "Warm Milk", amount: "30", unit: "ml" }
    ],
    instructions: [
      "Pull espresso shot into small glass",
      "Heat milk to 60°C (do not froth)",
      "Pour warm milk over espresso",
      "Serve immediately"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800",
    calories: 45,
    category: "Coffee",
    rating: 4.7,
    reviewsCount: 134
  },
  {
    title: "Affogato",
    slug: "affogato",
    description: "Italian dessert coffee. Hot espresso poured over vanilla ice cream.",
    ingredients: [
      { name: "Vanilla Ice Cream", amount: "2", unit: "scoops" },
      { name: "Espresso", amount: "1", unit: "shot" }
    ],
    instructions: [
      "Place 2 scoops of vanilla ice cream in a glass",
      "Brew fresh espresso shot",
      "Pour hot espresso over ice cream",
      "Serve immediately with spoon"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1577486957921-1e65e9b8b0b1?auto=format&fit=crop&q=80&w=800",
    calories: 180,
    category: "Coffee",
    rating: 4.9,
    reviewsCount: 167
  },
  {
    title: "Turkish Coffee",
    slug: "turkish-coffee",
    description: "Traditional method of brewing unfiltered coffee. Rich, strong, and aromatic.",
    ingredients: [
      { name: "Turkish Coffee Grounds", amount: "2", unit: "tsp" },
      { name: "Water", amount: "60", unit: "ml" },
      { name: "Sugar", amount: "1", unit: "tsp" }
    ],
    instructions: [
      "Add coffee, water, and sugar to cezve (Turkish pot)",
      "Heat slowly over low flame, stirring until sugar dissolves",
      "Remove from heat when foam rises",
      "Return to heat and repeat 2-3 times",
      "Pour into cup, including grounds"
    ],
    prepTime: 10,
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800",
    calories: 15,
    category: "Coffee",
    rating: 4.6,
    reviewsCount: 98
  },
  {
    title: "Vietnamese Iced Coffee",
    slug: "vietnamese-iced-coffee",
    description: "Strong coffee with sweetened condensed milk over ice. A Vietnamese classic.",
    ingredients: [
      { name: "Vietnamese Coffee", amount: "2", unit: "tbsp" },
      { name: "Sweetened Condensed Milk", amount: "2", unit: "tbsp" },
      { name: "Ice", amount: "as needed", unit: "" },
      { name: "Hot Water", amount: "100", unit: "ml" }
    ],
    instructions: [
      "Add condensed milk to glass",
      "Brew coffee using Vietnamese phin filter",
      "Pour hot coffee over condensed milk",
      "Stir until milk is dissolved",
      "Add ice and serve"
    ],
    prepTime: 8,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800",
    calories: 150,
    category: "Coffee",
    rating: 4.8,
    reviewsCount: 223
  },

  // Tea Recipes (10)
  {
    title: "Japanese Matcha Latte",
    slug: "japanese-matcha-latte",
    description: "Smooth, creamy, and earthy matcha green tea latte. High in antioxidants and calming.",
    ingredients: [
      { name: "Matcha Powder", amount: "1", unit: "tsp" },
      { name: "Almond Milk", amount: "200", unit: "ml" },
      { name: "Honey", amount: "1", unit: "tbsp" },
      { name: "Hot Water", amount: "2", unit: "tbsp" }
    ],
    instructions: [
      "Sift matcha powder into a bowl",
      "Add hot water and whisk vigorously with bamboo whisk until frothy",
      "Heat almond milk to 70°C",
      "Pour matcha into cup, then add warm milk",
      "Stir in honey to taste"
    ],
    prepTime: 5,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1515825838458-f2a94b2010e7?auto=format&fit=crop&q=80&w=800",
    calories: 80,
    category: "Tea",
    rating: 4.9,
    reviewsCount: 289
  },
  {
    title: "Earl Grey Tea",
    slug: "earl-grey-tea",
    description: "Classic black tea flavored with bergamot oil. Elegant and aromatic.",
    ingredients: [
      { name: "Earl Grey Tea Leaves", amount: "1", unit: "tsp" },
      { name: "Hot Water", amount: "200", unit: "ml" },
      { name: "Lemon", amount: "optional", unit: "slice" },
      { name: "Honey", amount: "optional", unit: "" }
    ],
    instructions: [
      "Heat water to 95°C",
      "Add tea leaves to teapot",
      "Pour hot water over leaves",
      "Steep for 3-5 minutes",
      "Strain and serve with lemon or honey if desired"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    calories: 2,
    category: "Tea",
    rating: 4.7,
    reviewsCount: 198
  },
  {
    title: "Chai Latte",
    slug: "chai-latte",
    description: "Spiced Indian tea with milk. Warming blend of cinnamon, cardamom, and ginger.",
    ingredients: [
      { name: "Black Tea", amount: "2", unit: "tsp" },
      { name: "Whole Milk", amount: "200", unit: "ml" },
      { name: "Cardamom", amount: "3", unit: "pods" },
      { name: "Cinnamon Stick", amount: "1", unit: "" },
      { name: "Ginger", amount: "1", unit: "slice" },
      { name: "Honey", amount: "1", unit: "tbsp" }
    ],
    instructions: [
      "Crush cardamom pods and add to pot with tea, cinnamon, and ginger",
      "Add water and bring to boil",
      "Simmer for 5 minutes",
      "Add milk and heat until hot",
      "Strain and sweeten with honey",
      "Serve hot"
    ],
    prepTime: 10,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
    calories: 120,
    category: "Tea",
    rating: 4.8,
    reviewsCount: 256
  },
  {
    title: "Jasmine Green Tea",
    slug: "jasmine-green-tea",
    description: "Delicate green tea scented with jasmine flowers. Light, floral, and refreshing.",
    ingredients: [
      { name: "Jasmine Green Tea", amount: "1", unit: "tsp" },
      { name: "Hot Water", amount: "200", unit: "ml" }
    ],
    instructions: [
      "Heat water to 80°C (not boiling)",
      "Add tea leaves to cup or teapot",
      "Pour water over leaves",
      "Steep for 2-3 minutes",
      "Remove leaves and enjoy"
    ],
    prepTime: 3,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    calories: 2,
    category: "Tea",
    rating: 4.6,
    reviewsCount: 145
  },
  {
    title: "English Breakfast Tea",
    slug: "english-breakfast-tea",
    description: "Robust black tea blend perfect for mornings. Traditionally served with milk.",
    ingredients: [
      { name: "English Breakfast Tea", amount: "1", unit: "tsp" },
      { name: "Hot Water", amount: "200", unit: "ml" },
      { name: "Milk", amount: "2", unit: "tbsp" },
      { name: "Sugar", amount: "optional", unit: "" }
    ],
    instructions: [
      "Boil water to 100°C",
      "Add tea to teapot",
      "Pour boiling water over tea",
      "Steep for 4-5 minutes",
      "Add milk and sugar to taste",
      "Serve hot"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    calories: 25,
    category: "Tea",
    rating: 4.5,
    reviewsCount: 167
  },
  {
    title: "Peppermint Tea",
    slug: "peppermint-tea",
    description: "Refreshing herbal tea perfect for digestion. Naturally caffeine-free.",
    ingredients: [
      { name: "Fresh Peppermint Leaves", amount: "10", unit: "leaves" },
      { name: "Hot Water", amount: "200", unit: "ml" },
      { name: "Honey", amount: "optional", unit: "" }
    ],
    instructions: [
      "Boil water",
      "Place fresh mint leaves in cup",
      "Pour hot water over leaves",
      "Steep for 5-7 minutes",
      "Remove leaves and add honey if desired",
      "Enjoy hot or iced"
    ],
    prepTime: 7,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    calories: 2,
    category: "Tea",
    rating: 4.7,
    reviewsCount: 134
  },
  {
    title: "Oolong Tea",
    slug: "oolong-tea",
    description: "Semi-oxidized tea with complex flavors. Between green and black tea.",
    ingredients: [
      { name: "Oolong Tea Leaves", amount: "1", unit: "tsp" },
      { name: "Hot Water", amount: "200", unit: "ml" }
    ],
    instructions: [
      "Heat water to 85-90°C",
      "Rinse tea leaves with hot water (first infusion)",
      "Discard first infusion",
      "Add fresh hot water and steep for 3-4 minutes",
      "Serve and enjoy multiple infusions"
    ],
    prepTime: 5,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    calories: 2,
    category: "Tea",
    rating: 4.6,
    reviewsCount: 112
  },
  {
    title: "Rooibos Tea",
    slug: "rooibos-tea",
    description: "South African red bush tea. Naturally sweet, caffeine-free, and rich in antioxidants.",
    ingredients: [
      { name: "Rooibos Tea", amount: "1", unit: "tsp" },
      { name: "Hot Water", amount: "200", unit: "ml" },
      { name: "Lemon", amount: "optional", unit: "slice" }
    ],
    instructions: [
      "Boil water",
      "Add rooibos to teapot",
      "Pour boiling water over tea",
      "Steep for 5-7 minutes",
      "Strain and serve with lemon if desired"
    ],
    prepTime: 7,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    calories: 2,
    category: "Tea",
    rating: 4.5,
    reviewsCount: 98
  },
  {
    title: "Thai Iced Tea",
    slug: "thai-iced-tea",
    description: "Sweet, creamy, and vibrant orange tea. A refreshing Thai classic.",
    ingredients: [
      { name: "Thai Tea Mix", amount: "2", unit: "tbsp" },
      { name: "Water", amount: "200", unit: "ml" },
      { name: "Sweetened Condensed Milk", amount: "2", unit: "tbsp" },
      { name: "Evaporated Milk", amount: "1", unit: "tbsp" },
      { name: "Ice", amount: "as needed", unit: "" }
    ],
    instructions: [
      "Steep Thai tea in hot water for 5 minutes",
      "Strain and let cool",
      "Fill glass with ice",
      "Pour tea over ice",
      "Add condensed milk and stir",
      "Top with evaporated milk"
    ],
    prepTime: 10,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    calories: 180,
    category: "Tea",
    rating: 4.8,
    reviewsCount: 201
  },
  {
    title: "Chamomile Tea",
    slug: "chamomile-tea",
    description: "Gentle, floral herbal tea known for its calming properties. Perfect before bedtime.",
    ingredients: [
      { name: "Chamomile Flowers", amount: "1", unit: "tbsp" },
      { name: "Hot Water", amount: "200", unit: "ml" },
      { name: "Honey", amount: "optional", unit: "" }
    ],
    instructions: [
      "Boil water",
      "Place chamomile flowers in teapot or infuser",
      "Pour hot water over flowers",
      "Steep for 5-10 minutes",
      "Strain and add honey if desired",
      "Enjoy warm"
    ],
    prepTime: 10,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    calories: 2,
    category: "Tea",
    rating: 4.7,
    reviewsCount: 178
  },

  // Mocktail Recipes (10)
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
      "Muddle berries and mint in a glass",
      "Add ice and lime juice",
      "Top with sparkling water",
      "Stir gently",
      "Garnish with fresh mint and berries"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    calories: 45,
    category: "Mocktail",
    rating: 4.7,
    reviewsCount: 167
  },
  {
    title: "Virgin Mojito",
    slug: "virgin-mojito",
    description: "Classic mojito without alcohol. Fresh mint, lime, and sparkling water.",
    ingredients: [
      { name: "Fresh Mint Leaves", amount: "10", unit: "leaves" },
      { name: "Lime", amount: "1/2", unit: "" },
      { name: "Simple Syrup", amount: "2", unit: "tbsp" },
      { name: "Sparkling Water", amount: "150", unit: "ml" },
      { name: "Ice", amount: "as needed", unit: "" }
    ],
    instructions: [
      "Muddle mint leaves with lime juice in glass",
      "Add simple syrup",
      "Fill glass with ice",
      "Top with sparkling water",
      "Stir gently and garnish with mint"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800",
    calories: 60,
    category: "Mocktail",
    rating: 4.8,
    reviewsCount: 234
  },
  {
    title: "Tropical Sunrise",
    slug: "tropical-sunrise",
    description: "Vibrant layers of orange, pineapple, and grenadine. Beautiful and delicious.",
    ingredients: [
      { name: "Orange Juice", amount: "100", unit: "ml" },
      { name: "Pineapple Juice", amount: "50", unit: "ml" },
      { name: "Grenadine", amount: "1", unit: "tbsp" },
      { name: "Ice", amount: "as needed", unit: "" },
      { name: "Orange Slice", amount: "1", unit: "" }
    ],
    instructions: [
      "Fill glass with ice",
      "Pour grenadine first",
      "Slowly add pineapple juice",
      "Top with orange juice to create layers",
      "Garnish with orange slice"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    calories: 120,
    category: "Mocktail",
    rating: 4.6,
    reviewsCount: 189
  },
  {
    title: "Cucumber Mint Cooler",
    slug: "cucumber-mint-cooler",
    description: "Cooling and refreshing. Perfect for hot summer days.",
    ingredients: [
      { name: "Cucumber", amount: "1/2", unit: "" },
      { name: "Fresh Mint", amount: "8", unit: "leaves" },
      { name: "Lime Juice", amount: "1", unit: "tbsp" },
      { name: "Simple Syrup", amount: "1", unit: "tbsp" },
      { name: "Sparkling Water", amount: "150", unit: "ml" },
      { name: "Ice", amount: "as needed", unit: "" }
    ],
    instructions: [
      "Slice cucumber and muddle with mint",
      "Add lime juice and simple syrup",
      "Fill with ice",
      "Top with sparkling water",
      "Garnish with cucumber slice and mint"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    calories: 35,
    category: "Mocktail",
    rating: 4.7,
    reviewsCount: 156
  },
  {
    title: "Strawberry Lemonade",
    slug: "strawberry-lemonade",
    description: "Fresh strawberries blended with tangy lemonade. Sweet and refreshing.",
    ingredients: [
      { name: "Fresh Strawberries", amount: "5", unit: "" },
      { name: "Lemon Juice", amount: "2", unit: "tbsp" },
      { name: "Simple Syrup", amount: "2", unit: "tbsp" },
      { name: "Water", amount: "150", unit: "ml" },
      { name: "Ice", amount: "as needed", unit: "" }
    ],
    instructions: [
      "Blend strawberries until smooth",
      "Strain through fine mesh",
      "Mix with lemon juice and simple syrup",
      "Add water and stir",
      "Serve over ice with strawberry garnish"
    ],
    prepTime: 8,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    calories: 90,
    category: "Mocktail",
    rating: 4.8,
    reviewsCount: 201
  },
  {
    title: "Ginger Fizz",
    slug: "ginger-fizz",
    description: "Spicy ginger with citrus and bubbles. Energizing and refreshing.",
    ingredients: [
      { name: "Fresh Ginger", amount: "1", unit: "inch" },
      { name: "Lemon Juice", amount: "2", unit: "tbsp" },
      { name: "Honey", amount: "1", unit: "tbsp" },
      { name: "Sparkling Water", amount: "150", unit: "ml" },
      { name: "Ice", amount: "as needed", unit: "" }
    ],
    instructions: [
      "Grate or muddle fresh ginger",
      "Mix with lemon juice and honey",
      "Strain if desired",
      "Add ice to glass",
      "Top with sparkling water",
      "Garnish with lemon slice"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    calories: 50,
    category: "Mocktail",
    rating: 4.6,
    reviewsCount: 134
  },
  {
    title: "Watermelon Refresher",
    slug: "watermelon-refresher",
    description: "Juicy watermelon blended with lime. Perfect summer drink.",
    ingredients: [
      { name: "Fresh Watermelon", amount: "1", unit: "cup" },
      { name: "Lime Juice", amount: "1", unit: "tbsp" },
      { name: "Simple Syrup", amount: "1", unit: "tbsp" },
      { name: "Sparkling Water", amount: "100", unit: "ml" },
      { name: "Ice", amount: "as needed", unit: "" }
    ],
    instructions: [
      "Blend watermelon until smooth",
      "Strain through fine mesh",
      "Mix with lime juice and simple syrup",
      "Fill glass with ice",
      "Pour watermelon mixture over ice",
      "Top with sparkling water",
      "Garnish with watermelon wedge"
    ],
    prepTime: 8,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    calories: 70,
    category: "Mocktail",
    rating: 4.9,
    reviewsCount: 223
  },
  {
    title: "Pineapple Coconut Delight",
    slug: "pineapple-coconut-delight",
    description: "Tropical paradise in a glass. Creamy coconut with sweet pineapple.",
    ingredients: [
      { name: "Pineapple Juice", amount: "100", unit: "ml" },
      { name: "Coconut Cream", amount: "2", unit: "tbsp" },
      { name: "Lime Juice", amount: "1", unit: "tbsp" },
      { name: "Simple Syrup", amount: "1", unit: "tbsp" },
      { name: "Ice", amount: "as needed", unit: "" }
    ],
    instructions: [
      "Blend all ingredients with ice",
      "Pour into glass",
      "Garnish with pineapple wedge and cherry",
      "Serve immediately"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    calories: 140,
    category: "Mocktail",
    rating: 4.7,
    reviewsCount: 178
  },
  {
    title: "Cranberry Spritzer",
    slug: "cranberry-spritzer",
    description: "Tart cranberry with sparkling water. Light and refreshing.",
    ingredients: [
      { name: "Cranberry Juice", amount: "100", unit: "ml" },
      { name: "Lime Juice", amount: "1", unit: "tbsp" },
      { name: "Simple Syrup", amount: "1", unit: "tbsp" },
      { name: "Sparkling Water", amount: "100", unit: "ml" },
      { name: "Ice", amount: "as needed", unit: "" },
      { name: "Lime Wedge", amount: "1", unit: "" }
    ],
    instructions: [
      "Fill glass with ice",
      "Mix cranberry juice, lime juice, and simple syrup",
      "Pour over ice",
      "Top with sparkling water",
      "Garnish with lime wedge",
      "Stir gently before serving"
    ],
    prepTime: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    calories: 80,
    category: "Mocktail",
    rating: 4.5,
    reviewsCount: 145
  },
  {
    title: "Mango Lassi",
    slug: "mango-lassi",
    description: "Creamy Indian yogurt drink with sweet mango. Thick, smooth, and satisfying.",
    ingredients: [
      { name: "Ripe Mango", amount: "1", unit: "" },
      { name: "Plain Yogurt", amount: "200", unit: "ml" },
      { name: "Milk", amount: "50", unit: "ml" },
      { name: "Honey", amount: "2", unit: "tbsp" },
      { name: "Cardamom", amount: "1/4", unit: "tsp" },
      { name: "Ice", amount: "optional", unit: "" }
    ],
    instructions: [
      "Peel and dice mango",
      "Blend mango with yogurt, milk, and honey",
      "Add cardamom and blend until smooth",
      "Strain if desired for smoother texture",
      "Serve chilled with ice if desired",
      "Garnish with mango slice"
    ],
    prepTime: 8,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    calories: 200,
    category: "Mocktail",
    rating: 4.8,
    reviewsCount: 267
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brewvibe')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing recipes (optional - comment out if you want to keep existing)
    // await Recipe.deleteMany({});
    // console.log('Cleared existing recipes');
    
    // Insert recipes
    await Recipe.insertMany(recipes);
    console.log(`\n✅ Successfully seeded ${recipes.length} recipes!`);
    console.log(`   - Coffee: ${recipes.filter(r => r.category === 'Coffee').length} recipes`);
    console.log(`   - Tea: ${recipes.filter(r => r.category === 'Tea').length} recipes`);
    console.log(`   - Mocktail: ${recipes.filter(r => r.category === 'Mocktail').length} recipes`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding recipes:', err);
    process.exit(1);
  });


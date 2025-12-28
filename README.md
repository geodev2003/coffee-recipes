# BrewVibe - Coffee & Beverage Recipe Web Application

A full-stack MERN (MongoDB, Express, React, Node.js) web application for discovering and sharing premium coffee, tea, and mocktail recipes.

## 📚 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Hướng dẫn deploy chi tiết lên server production
- **[Quick Deployment Guide](./DEPLOYMENT_QUICK_START.md)** - Hướng dẫn deploy nhanh (tóm tắt)

## 📁 Project Structure

```
coffee-recipes/
├── server/                          # Backend (Node.js/Express)
│   ├── config/                      # Configuration files
│   ├── controllers/                 # Route controllers
│   │   └── recipeController.js     # Recipe CRUD operations
│   ├── models/                      # Mongoose models
│   │   └── Recipe.js               # Recipe schema
│   ├── routes/                      # API routes
│   │   └── recipeRoutes.js         # Recipe endpoints
│   ├── seed.js                      # Database seeding script
│   ├── server.js                   # Express server entry point
│   ├── package.json                # Server dependencies
│   └── .env                        # Environment variables (create this)
│
├── client/                          # Frontend (React/Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── Header.jsx         # Navigation header
│   │   │   └── RecipeCard.jsx     # Recipe card component
│   │   ├── pages/                  # Page components
│   │   │   ├── HomePage.jsx       # Home page
│   │   │   ├── CoffeePage.jsx     # Coffee recipes page
│   │   │   ├── TeaPage.jsx        # Tea recipes page
│   │   │   ├── MocktailPage.jsx   # Mocktail recipes page
│   │   │   ├── AboutPage.jsx      # About us page
│   │   │   └── AdminPage.jsx      # Admin dashboard
│   │   ├── services/               # API services
│   │   │   └── api.js             # Axios API client
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles (Tailwind)
│   ├── index.html                 # HTML template
│   ├── package.json               # Client dependencies
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── postcss.config.js          # PostCSS configuration
│   └── vite.config.js             # Vite configuration
│
└── README.md                       # This file
```

## 🎨 Color Palette

- **Cream**: `#FDFCF0` - Background color
- **Coffee**: `#4B3621` - Primary text/accents
- **Forest Green**: `#7CB342` - Primary buttons/links
- **Gold**: `#FFC107` - Accent color

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation & Setup

#### 1. Clone/Navigate to Project
```bash
cd coffee-recipes
```

#### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
# Copy this content into server/.env:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/brewvibe
# (or use MongoDB Atlas connection string)

# Start development server (with nodemon)
npm run dev

# Or start production server
npm start
```

#### 3. Frontend Setup

```bash
# Open a new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 4. Seed Database (Optional)

```bash
# In server directory, run seed script
cd server
node seed.js
```

### Running Both Servers

You need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173 (or next available port)
```

## 📦 Dependencies

### Server Dependencies (server/package.json)

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "mongoose": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
```

### Client Dependencies (client/package.json)

```json
{
  "dependencies": {
    "axios": "^1.7.9",
    "framer-motion": "^11.15.0",
    "lucide-react": "^0.468.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.1.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.23",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.19",
    "vite": "^7.2.4"
  }
}
```

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api/v1/recipes`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/recipes` | Get all recipes (with optional `?search=term&category=Coffee`) |
| GET | `/api/v1/recipes/:id` | Get single recipe by ID |
| POST | `/api/v1/recipes` | Create new recipe |
| PUT | `/api/v1/recipes/:id` | Update recipe |
| DELETE | `/api/v1/recipes/:id` | Delete recipe |

## 📝 Recipe Schema

```javascript
{
  title: String (required),
  slug: String (required, unique, auto-generated from title),
  description: String (required),
  ingredients: [{
    name: String (required),
    amount: String (required),
    unit: String (optional)
  }],
  instructions: [String] (required),
  prepTime: Number (required, in minutes),
  difficulty: String (enum: 'Easy', 'Medium', 'Hard'),
  image: String (URL),
  category: String (enum: 'Coffee', 'Tea', 'Mocktail', required),
  calories: Number (optional),
  rating: Number (default: 0),
  reviewsCount: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📱 Features

- ✅ Browse recipes by category (Coffee, Tea, Mocktail)
- ✅ Search recipes by name
- ✅ Recipe details with ingredients and instructions
- ✅ Admin panel for CRUD operations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI with smooth animations
- ✅ Glass morphism effects
- ✅ Dark/light theme support ready

## 🔧 Development Scripts

### Server
```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start production server
```

### Client
```bash
npm run dev    # Start Vite dev server
npm run build  # Build for production
npm run preview # Preview production build
```

## 📄 License

ISC

## 👤 Author

BrewVibe Development Team

---

**Note**: Make sure MongoDB is running before starting the backend server. For MongoDB Atlas, update the connection string in `server/.env`.


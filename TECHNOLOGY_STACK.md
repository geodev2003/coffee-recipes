# 📚 Technology Stack & Implementation Guide

## 🛠️ Công Nghệ & Framework

### **Frontend (Client)**

#### Core Framework & Libraries
- **React 19.2.0** - UI framework chính
- **React DOM 19.2.0** - React rendering cho web
- **React Router DOM 7.1.3** - Client-side routing và navigation

#### Build Tools & Development
- **Vite 7.2.4** - Build tool và dev server (thay thế Create React App)
  - Fast HMR (Hot Module Replacement)
  - Optimized production builds
  - ES modules support
- **@vitejs/plugin-react 5.1.1** - Vite plugin cho React

#### Styling & UI
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
  - Custom color palette (coffee, cream, forest, espresso, caramel, gold)
  - Custom fonts (Inter, Playfair Display)
  - Custom animations và keyframes
  - Responsive design utilities
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.23** - Automatic vendor prefixes

#### Animation & Interactions
- **Framer Motion 11.15.0** - Animation library cho React
  - Page transitions
  - Component animations
  - Gesture handling

#### Icons & UI Components
- **Lucide React 0.468.0** - Icon library (modern, customizable icons)

#### HTTP Client
- **Axios 1.7.9** - HTTP client cho API calls
  - Request/Response interceptors
  - Automatic token injection
  - Error handling

#### Code Quality
- **ESLint 9.39.1** - JavaScript/React linter
- **@eslint/js 9.39.1** - ESLint core rules
- **eslint-plugin-react-hooks 7.0.1** - React Hooks linting rules
- **eslint-plugin-react-refresh 0.4.24** - React Fast Refresh support

#### TypeScript Support (Dev)
- **@types/react 19.2.5** - TypeScript definitions cho React
- **@types/react-dom 19.2.3** - TypeScript definitions cho React DOM

---

### **Backend (Server)**

#### Core Framework
- **Express 5.2.1** - Web framework cho Node.js
  - RESTful API
  - Middleware support
  - Route handling

#### Database
- **Mongoose 9.0.2** - MongoDB ODM (Object Document Mapper)
  - Schema definition
  - Data validation
  - Query building
  - Middleware hooks

#### Authentication & Security
- **jsonwebtoken 9.0.3** - JWT (JSON Web Tokens) cho authentication
- **bcryptjs 2.4.3** - Password hashing (bcrypt implementation)
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware

#### File Upload
- **Multer 2.0.2** - Middleware cho handling multipart/form-data
  - Disk storage
  - File filtering
  - Size limits

#### Environment & Configuration
- **dotenv 17.2.3** - Environment variables management

#### Development Tools
- **Nodemon 3.1.11** - Auto-restart server during development

---

### **Deployment & Infrastructure**

#### Hosting
- **Vercel** - Frontend hosting và serverless functions
- **Railway** - Backend API hosting (alternative)

#### Configuration
- **vercel.json** - Vercel deployment configuration
  - Rewrites cho API routing
  - Build configurations

---

## 🖼️ Xử Lý Hình Ảnh

### **Backend (Server-side)**

#### 1. **Multer Configuration** (`server/controllers/uploadController.js`)

```javascript
// Storage: Disk Storage
- Lưu trữ file vào thư mục `server/uploads/`
- Tự động tạo thư mục nếu chưa tồn tại

// File Naming
- Format: `{originalname}-{timestamp}-{random}.{ext}`
- Ví dụ: `coffee-1766921199374-921940366.jpg`
- Đảm bảo unique filename

// File Filtering
- Chỉ chấp nhận: JPEG, JPG, PNG, GIF, WebP
- Kiểm tra cả extension và MIME type
- Từ chối các file không phải image

// Size Limits
- Maximum: 5MB per file
- Multiple files: Tối đa 10 images mỗi lần upload
```

#### 2. **Upload Endpoints**

- **POST `/api/v1/upload/single`** - Upload 1 hình ảnh
  - Input: `image` (FormData field)
  - Output: `{ success, url, filename }`
  
- **POST `/api/v1/upload/multiple`** - Upload nhiều hình ảnh
  - Input: `images[]` (FormData array)
  - Output: `{ success, files: [{ url, filename }] }`

#### 3. **Static File Serving**

```javascript
// Express static middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Truy cập: http://domain.com/uploads/filename.jpg
```

#### 4. **Security**

- **Authentication Required**: Chỉ admin mới có thể upload
- **File Type Validation**: Kiểm tra extension và MIME type
- **Size Limitation**: Giới hạn 5MB/file
- **Unique Filenames**: Tránh file name conflicts

---

### **Frontend (Client-side)**

#### 1. **ImageUpload Component** (`client/src/components/ImageUpload.jsx`)

**Features:**
- **Drag & Drop**: Kéo thả file để upload
- **Click to Upload**: Click để chọn file từ máy tính
- **Multiple Upload**: Hỗ trợ upload nhiều ảnh (tối đa 10)
- **Preview**: Xem trước ảnh trước khi submit
- **Remove**: Xóa ảnh khỏi danh sách
- **Progress Indicator**: Hiển thị trạng thái uploading

**Implementation:**
```javascript
// Upload Flow:
1. User chọn file(s) → handleFileSelect()
2. Tạo FormData với file(s)
3. Gọi API: uploadImage() hoặc uploadImages()
4. Nhận URL từ server
5. Cập nhật preview và state
6. Gửi URL về parent component qua onChange()
```

**URL Handling:**
```javascript
// Tự động detect environment
const baseUrl = window.location.origin.includes('localhost') 
    ? 'http://localhost:5000'  // Development
    : window.location.origin;    // Production

const fullUrl = baseUrl + response.url;
```

#### 2. **Image Display**

- **Recipe Images**: Hỗ trợ cả `image` (single) và `images[]` (array)
- **Image Gallery**: Component hiển thị nhiều ảnh với navigation
- **Responsive**: Tự động resize theo screen size
- **Lazy Loading**: Tối ưu performance

#### 3. **Image Storage Format**

```javascript
// Recipe Model
{
  image: String,        // Single image (backward compatibility)
  images: [String]      // Array of image URLs
}

// URL Format
- Local: http://localhost:5000/uploads/filename.jpg
- Production: https://domain.com/uploads/filename.jpg
```

---

## 📝 Xử Lý Văn Bản

### **Backend (Server-side)**

#### 1. **Request Body Parsing**

```javascript
// Express Middleware
app.use(express.json({ limit: '10mb' }));        // JSON parsing
app.use(express.urlencoded({ extended: true })); // URL-encoded parsing

// Limit: 10MB cho JSON payloads
// Hỗ trợ cả JSON và form-urlencoded
```

#### 2. **Mongoose Schema - Text Fields**

**Recipe Model:**
```javascript
{
  title: String,              // Required, auto-generate slug
  description: String,        // Required
  instructions: [String],     // Array of strings (step-by-step)
  slug: String,               // Auto-generated từ title
}

// Slug Generation:
- Tự động tạo từ title
- Lowercase
- Replace special chars với '-'
- Remove leading/trailing dashes
```

**Comment Model:**
```javascript
{
  content: String,            // Required, trim, maxlength: 1000
  username: String,          // Required
  replies: [{
    content: String,         // Required, trim, maxlength: 500
    username: String
  }]
}
```

**User Model:**
```javascript
{
  username: String,          // Required, unique, trim, minlength: 3
  email: String,             // Required, unique, lowercase, trim
  password: String           // Required, minlength: 6, auto-hashed
}
```

#### 3. **Text Processing & Validation**

**Slug Generation:**
```javascript
// Pre-save hook trong Recipe model
recipeSchema.pre('save', function() {
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric với '-'
    .replace(/(^-|-$)/g, '');      // Remove leading/trailing dashes
});
```

**Password Hashing:**
```javascript
// Pre-save hook trong User model
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});
```

**Text Sanitization:**
```javascript
// Trim whitespace
- Username: trim()
- Email: lowercase, trim()
- Comment content: trim(), maxlength validation
```

#### 4. **Search & Filtering**

```javascript
// Recipe Search
- Full-text search trên title và description
- Case-insensitive (regex với 'i' flag)
- Category filtering
- Difficulty filtering

// User Search
- Search by username hoặc email
- Case-insensitive
- Role filtering
- Status filtering
```

---

### **Frontend (Client-side)**

#### 1. **Text Input Handling**

**Form Inputs:**
```javascript
// Controlled Components
- useState() để quản lý form state
- onChange handlers để update state
- Validation trước khi submit
```

**Text Areas:**
```javascript
// Multi-line Text
- Ingredients: Format "name|amount|unit" (one per line)
- Instructions: Array of strings (one per line)
- Comments: Plain text với maxlength validation
```

#### 2. **Text Display**

**Typography:**
```css
/* Tailwind CSS Classes */
- font-serif: Playfair Display (headings)
- font-sans: Inter (body text)
- text-coffee-900: Dark brown (headings)
- text-coffee-600: Medium brown (body)
- line-clamp-2: Truncate text với ellipsis
```

**Text Formatting:**
```javascript
// Recipe Display
- Title: Large, bold, serif font
- Description: Medium, regular, truncated với line-clamp
- Instructions: Numbered list
- Ingredients: Formatted table với name, amount, unit
```

#### 3. **Text Processing**

**Ingredient Parsing:**
```javascript
// Format: "name|amount|unit"
const parseIngredient = (line) => {
  if (line.includes('|')) {
    const [name, amount, unit] = line.split('|').map(s => s.trim());
    return { name, amount: amount || '1', unit: unit || '' };
  }
  return { name: line.trim(), amount: '1', unit: '' };
};
```

**Instruction Parsing:**
```javascript
// Multi-line text → Array
const instructions = formData.instructions
  .split('\n')
  .filter(i => i.trim());
```

#### 4. **Text Validation**

**Client-side:**
```javascript
// Required fields
- Title, Description, PrepTime, Ingredients, Instructions

// Format validation
- Email: email format
- Username: min 3 characters
- Password: min 6 characters
- Comment: max 1000 characters
```

**Server-side:**
```javascript
// Mongoose validators
- Required fields
- Min/Max length
- Enum values (category, difficulty, role)
- Unique constraints (username, email)
```

---

## 🔐 Authentication & Authorization

### **JWT-based Authentication**
- Token generation với `jsonwebtoken`
- Token expiration: 7 days
- Middleware: `protect` cho authenticated routes
- Middleware: `adminOnly` cho admin-only routes

### **Password Security**
- Bcrypt hashing với salt rounds: 10
- Auto-hash trước khi save
- Compare method để verify password

---

## 📦 Data Storage

### **MongoDB Collections**
- **Users**: User accounts, authentication
- **Recipes**: Recipe data với images, ingredients, instructions
- **Comments**: User comments và ratings
- **Wishlist**: User saved recipes
- **Statistics**: View tracking, visitor analytics

### **File Storage**
- **Local Storage**: `server/uploads/` directory
- **Static Serving**: Express static middleware
- **File URLs**: `/uploads/{filename}`

---

## 🚀 Development Workflow

### **Frontend**
```bash
npm run dev      # Vite dev server (HMR)
npm run build    # Production build
npm run preview  # Preview production build
```

### **Backend**
```bash
npm run dev      # Nodemon (auto-restart)
npm start        # Production server
```

---

## 📊 Performance Optimizations

### **Frontend**
- Vite build optimization
- Code splitting
- Lazy loading images
- React component memoization

### **Backend**
- MongoDB indexing
- Query optimization
- Pagination cho large datasets
- File size limits

---

## 🔧 Environment Variables

### **Required Variables**
```env
MONGODB_URI=          # MongoDB connection string
JWT_SECRET=           # Secret key cho JWT
PORT=                 # Server port (default: 5000)
CORS_ORIGIN=          # Allowed CORS origin
NODE_ENV=             # Environment (development/production)
```

---

## 📝 Summary

**Frontend Stack:**
- React + Vite + Tailwind CSS + Framer Motion
- Modern, fast, responsive UI

**Backend Stack:**
- Express + MongoDB + Mongoose
- RESTful API với JWT authentication

**Image Handling:**
- Multer cho upload
- Disk storage
- Static file serving
- Client-side preview và management

**Text Handling:**
- Mongoose schemas với validation
- Auto-slug generation
- Search và filtering
- Client-side parsing và formatting


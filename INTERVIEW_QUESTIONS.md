# 🎤 Câu Hỏi Phỏng Vấn - Coffee Recipes Project

## 📋 Mục Lục
1. [Câu Hỏi Tổng Quan về Dự Án](#tổng-quan)
2. [Câu Hỏi về Frontend (React)](#frontend)
3. [Câu Hỏi về Backend (Node.js/Express)](#backend)
4. [Câu Hỏi về Database (MongoDB)](#database)
5. [Câu Hỏi về Authentication & Security](#security)
6. [Câu Hỏi về Performance & Optimization](#performance)
7. [Câu Hỏi về Architecture & Design Patterns](#architecture)
8. [Câu Hỏi về Testing & Debugging](#testing)
9. [Câu Hỏi về Deployment & DevOps](#deployment)
10. [Câu Hỏi Thực Hành (Code Challenge)](#code-challenge)

---

## 📌 Tổng Quan về Dự Án

### **Q1: Hãy giới thiệu về dự án Coffee Recipes của bạn?**

**Gợi ý trả lời:**
- Đây là một ứng dụng web full-stack để quản lý và chia sẻ công thức pha chế cà phê, trà và mocktail
- **Frontend**: React 19 với Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js với Express, MongoDB với Mongoose
- **Tính năng chính**:
  - Quản lý recipes (CRUD)
  - Authentication với JWT
  - Upload và quản lý hình ảnh
  - Hệ thống comments và ratings
  - Wishlist cho users
  - Admin dashboard với statistics
  - Pagination và search/filter

### **Q2: Tại sao bạn chọn React và Express cho dự án này?**

**Gợi ý trả lời:**
- **React**: Component-based, reusable, ecosystem lớn, phù hợp cho UI phức tạp
- **Express**: Lightweight, flexible, middleware support tốt, phù hợp cho RESTful API
- **MongoDB**: Schema linh hoạt, phù hợp cho dữ liệu recipes (nested objects, arrays)
- **Vite**: Build tool nhanh, HMR tốt, bundle size nhỏ hơn Webpack

### **Q3: Dự án này có những thách thức gì và bạn đã giải quyết như thế nào?**

**Gợi ý trả lời:**
- **Challenge 1**: Upload nhiều hình ảnh
  - **Solution**: Sử dụng Multer với array upload, validate file type và size, generate unique filenames
  
- **Challenge 2**: Pagination với filters phức tạp
  - **Solution**: Tính toán skip/limit, build dynamic MongoDB queries, return pagination metadata
  
- **Challenge 3**: Authentication và authorization
  - **Solution**: JWT tokens, middleware protect và adminOnly, token refresh
  
- **Challenge 4**: Performance với large datasets
  - **Solution**: MongoDB indexing, pagination, lazy loading images

---

## ⚛️ Frontend (React)

### **Q4: Bạn đã sử dụng Context API như thế nào trong dự án?**

**Gợi ý trả lời:**
- Tạo `AuthContext` để quản lý authentication state globally
- Tạo `ToastContext` để hiển thị notifications
- Sử dụng `useContext` hook để access state từ bất kỳ component nào
- Tránh prop drilling, code cleaner

**Ví dụ:**
```javascript
// AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Login, logout, checkAuth functions
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### **Q5: Bạn đã xử lý state management như thế nào?**

**Gợi ý trả lời:**
- **Local State**: `useState` cho component-specific state (form inputs, UI state)
- **Global State**: Context API cho authentication và notifications
- **Server State**: Axios với interceptors, không dùng Redux (overkill cho dự án này)
- **Form State**: Controlled components với useState

### **Q6: Bạn đã optimize performance như thế nào?**

**Gợi ý trả lời:**
- **Code Splitting**: React.lazy() cho route-based splitting
- **Image Lazy Loading**: `loading="lazy"` attribute
- **Memoization**: React.memo() cho expensive components (nếu cần)
- **Pagination**: Chỉ load data cần thiết, không load all at once
- **Vite Build**: Tree shaking, minification tự động

### **Q7: Bạn đã xử lý errors như thế nào trong React?**

**Gợi ý trả lời:**
- **Error Boundaries**: Component để catch errors trong component tree
- **Try-catch**: Trong async functions (API calls)
- **Axios Interceptors**: Tự động handle 401 errors, redirect to login
- **Toast Notifications**: Hiển thị error messages cho users
- **Fallback UI**: Loading states, empty states

**Ví dụ:**
```javascript
// ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### **Q8: Bạn đã implement routing như thế nào?**

**Gợi ý trả lời:**
- Sử dụng React Router DOM v7
- **Public Routes**: Home, Recipes, About
- **Protected Routes**: Admin Dashboard (require authentication)
- **Route Guards**: ProtectedRoute component check authentication
- **Dynamic Routes**: `/recipe/:id` cho recipe details

**Ví dụ:**
```javascript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/recipe/:id" element={<RecipeDetailPage />} />
  <Route path="/admin" element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  } />
</Routes>
```

---

## 🚀 Backend (Node.js/Express)

### **Q9: Bạn đã tổ chức code backend như thế nào?**

**Gợi ý trả lời:**
- **MVC Pattern**:
  - **Models**: Mongoose schemas (User, Recipe, Comment, etc.)
  - **Views**: Không có (API only)
  - **Controllers**: Business logic (recipeController, authController, etc.)
  - **Routes**: API endpoints (recipeRoutes, authRoutes, etc.)
  - **Middleware**: Authentication, validation, error handling

**Cấu trúc:**
```
server/
├── models/          # Mongoose schemas
├── controllers/     # Business logic
├── routes/          # API routes
├── middleware/      # Auth, validation
└── server.js        # Entry point
```

### **Q10: Bạn đã implement middleware như thế nào?**

**Gợi ý trả lời:**
- **Authentication Middleware** (`protect`): Verify JWT token, attach user to request
- **Authorization Middleware** (`adminOnly`): Check user role
- **CORS Middleware**: Handle cross-origin requests
- **Error Handling Middleware**: Centralized error handling
- **Body Parser Middleware**: Parse JSON và form data

**Ví dụ:**
```javascript
// Middleware chain
router.post('/recipes', 
  protect,        // 1. Check authentication
  adminOnly,      // 2. Check admin role
  validateRecipe, // 3. Validate input
  createRecipe    // 4. Controller
);
```

### **Q11: Bạn đã xử lý file upload như thế nào?**

**Gợi ý trả lời:**
- **Multer**: Middleware cho multipart/form-data
- **Storage**: Disk storage (có thể upgrade lên cloud storage)
- **Validation**: File type (images only), file size (max 5MB)
- **Filename**: Generate unique filename với timestamp và random number
- **Security**: Admin-only upload, validate MIME type

**Ví dụ:**
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.originalname}-${uniqueSuffix}`);
  }
});
```

### **Q12: Bạn đã implement pagination như thế nào?**

**Gợi ý trả lời:**
- **Query Parameters**: `page` và `limit`
- **Calculate Skip**: `skip = (page - 1) * limit`
- **MongoDB**: `.skip(skip).limit(limit)`
- **Total Count**: `countDocuments()` để tính total pages
- **Response**: Return data + pagination metadata

**Ví dụ:**
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 12;
const skip = (page - 1) * limit;

const total = await Recipe.countDocuments(query);
const recipes = await Recipe.find(query)
  .skip(skip)
  .limit(limit);

res.json({
  recipes,
  pagination: {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalRecipes: total
  }
});
```

### **Q13: Bạn đã xử lý errors như thế nào trong Express?**

**Gợi ý trả lời:**
- **Try-catch**: Trong async controllers
- **Error Middleware**: Centralized error handler
- **HTTP Status Codes**: 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
- **Error Messages**: User-friendly messages, không expose sensitive info
- **Logging**: Console.error cho debugging

**Ví dụ:**
```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});
```

---

## 🗄️ Database (MongoDB)

### **Q14: Tại sao bạn chọn MongoDB thay vì SQL database?**

**Gợi ý trả lời:**
- **Schema Flexibility**: Recipes có nested objects (ingredients), arrays (instructions, images)
- **NoSQL**: Phù hợp cho dữ liệu không có cấu trúc cố định
- **Scalability**: Dễ scale horizontally
- **JSON-like**: Dễ làm việc với JavaScript/Node.js
- **Mongoose ODM**: Validation, middleware, hooks

### **Q15: Bạn đã design database schema như thế nào?**

**Gợi ý trả lời:**
- **Users Collection**: username, email, password (hashed), role, isActive
- **Recipes Collection**: title, description, ingredients (array of objects), instructions (array), images (array)
- **Comments Collection**: recipeId, userId, content, rating, likes, replies
- **Wishlist Collection**: userId, recipeId (compound index)
- **Statistics Collection**: views, visitors tracking

**Ví dụ:**
```javascript
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{
    name: String,
    amount: String,
    unit: String
  }],
  instructions: [String],
  images: [String]
});
```

### **Q16: Bạn đã sử dụng indexes như thế nào?**

**Gợi ý trả lời:**
- **Single Field Index**: `recipeId` trong Comments (frequent queries)
- **Compound Index**: `{ userId: 1, recipeId: 1 }` trong Wishlist (unique constraint)
- **Text Index**: Có thể thêm cho full-text search trên title/description
- **Performance**: Indexes tăng tốc queries từ O(n) → O(log n)

**Ví dụ:**
```javascript
// Single field index
commentSchema.index({ recipeId: 1 });

// Compound index
wishlistSchema.index({ userId: 1, recipeId: 1 }, { unique: true });
```

### **Q17: Bạn đã sử dụng Mongoose hooks như thế nào?**

**Gợi ý trả lời:**
- **Pre-save Hook**: 
  - Hash password trước khi save user
  - Generate slug từ title trước khi save recipe
- **Post-save Hook**: Có thể dùng cho logging, notifications
- **Pre-validate Hook**: Custom validation logic

**Ví dụ:**
```javascript
// Pre-save hook: Hash password
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Pre-save hook: Generate slug
recipeSchema.pre('save', function() {
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
});
```

---

## 🔐 Authentication & Security

### **Q18: Bạn đã implement authentication như thế nào?**

**Gợi ý trả lời:**
- **JWT (JSON Web Tokens)**: Stateless authentication
- **Token Generation**: Khi login thành công, generate token với userId
- **Token Storage**: localStorage (có thể dùng httpOnly cookies cho security hơn)
- **Token Verification**: Middleware `protect` verify token mỗi request
- **Token Expiration**: 7 days

**Flow:**
```
1. User login → Server verify credentials
2. Server generate JWT token
3. Client store token in localStorage
4. Client send token với mọi request (Authorization header)
5. Server verify token → Attach user to request
```

### **Q19: Bạn đã bảo mật password như thế nào?**

**Gợi ý trả lời:**
- **Bcrypt Hashing**: Hash password với bcrypt (10 rounds)
- **Pre-save Hook**: Tự động hash trước khi save
- **Never Store Plain Text**: Password luôn được hash trong database
- **Compare Method**: `bcrypt.compare()` để verify password

**Ví dụ:**
```javascript
// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Verify password
const isValid = await bcrypt.compare(candidatePassword, hashedPassword);
```

### **Q20: Bạn đã implement authorization như thế nào?**

**Gợi ý trả lời:**
- **Role-based**: Admin và User roles
- **Middleware Chain**: `protect` → `adminOnly`
- **Route Protection**: Admin routes require admin role
- **Self-protection**: Admin không thể change/delete chính mình

**Ví dụ:**
```javascript
// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};
```

### **Q21: Bạn đã xử lý CORS như thế nào?**

**Gợi ý trả lời:**
- **CORS Middleware**: Cho phép requests từ specific origins
- **Allowed Origins**: Development (localhost:5173) và production domain
- **Credentials**: Support cookies/credentials
- **Security**: Restrict origins trong production

**Ví dụ:**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      process.env.CORS_ORIGIN
    ];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
```

---

## ⚡ Performance & Optimization

### **Q22: Bạn đã optimize performance như thế nào?**

**Gợi ý trả lời:**
- **Backend**:
  - MongoDB indexes cho frequent queries
  - Pagination để giảm data transfer
  - Select specific fields (`.select('-password')`)
  - Connection pooling
  
- **Frontend**:
  - Code splitting với React.lazy()
  - Image lazy loading
  - Pagination (không load all data)
  - Vite build optimization

### **Q23: Bạn đã xử lý large datasets như thế nào?**

**Gợi ý trả lời:**
- **Pagination**: Chỉ load data cần thiết (12 items/page)
- **Indexes**: Tăng tốc queries
- **Selective Fields**: Chỉ select fields cần thiết
- **Caching**: Có thể thêm Redis cho frequently accessed data

### **Q24: Bạn đã optimize images như thế nào?**

**Gợi ý trả lời:**
- **Lazy Loading**: `loading="lazy"` attribute
- **File Size Limit**: Max 5MB per file
- **Multiple Formats**: Support JPEG, PNG, GIF, WebP
- **Future**: Có thể thêm image compression, CDN

---

## 🏗️ Architecture & Design Patterns

### **Q25: Bạn đã sử dụng design patterns nào?**

**Gợi ý trả lời:**
- **MVC Pattern**: Models, Views (API), Controllers
- **Middleware Pattern**: Express middleware chain
- **Singleton Pattern**: Database connection
- **Factory Pattern**: Có thể dùng cho creating different recipe types
- **Observer Pattern**: Context API (React)

### **Q26: Bạn đã tổ chức API như thế nào?**

**Gợi ý trả lời:**
- **RESTful API**: 
  - GET `/api/v1/recipes` - List recipes
  - GET `/api/v1/recipes/:id` - Get recipe
  - POST `/api/v1/recipes` - Create recipe
  - PUT `/api/v1/recipes/:id` - Update recipe
  - DELETE `/api/v1/recipes/:id` - Delete recipe
  
- **Versioning**: `/api/v1/` prefix
- **Resource-based URLs**: Clear, semantic
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE

### **Q27: Bạn đã xử lý validation như thế nào?**

**Gợi ý trả lời:**
- **Mongoose Schema Validation**: Required fields, types, enums
- **Custom Validation**: Trong controllers (check duplicate, format)
- **Client-side Validation**: Form validation trước khi submit
- **Error Messages**: User-friendly error messages

---

## 🧪 Testing & Debugging

### **Q28: Bạn đã test dự án như thế nào?**

**Gợi ý trả lời:**
- **Manual Testing**: Test các features chính
- **Postman**: Test API endpoints
- **Browser DevTools**: Debug frontend
- **Console Logging**: Debug backend
- **Future**: Có thể thêm unit tests (Jest), integration tests

### **Q29: Bạn đã debug như thế nào khi gặp lỗi?**

**Gợi ý trả lời:**
- **Console.log**: Debug values, flow
- **Browser DevTools**: Network tab, Console, React DevTools
- **Error Messages**: Check error responses từ API
- **MongoDB Compass**: Check database data
- **Step-by-step**: Break down problem, test từng phần

---

## 🚀 Deployment & DevOps

### **Q30: Bạn đã deploy dự án như thế nào?**

**Gợi ý trả lời:**
- **Frontend**: Vercel (static hosting)
- **Backend**: Railway hoặc Vercel serverless functions
- **Database**: MongoDB Atlas (cloud)
- **Environment Variables**: Config trong hosting platform
- **Build Process**: Vite build cho frontend, Node.js cho backend

### **Q31: Bạn đã xử lý environment variables như thế nào?**

**Gợi ý trả lời:**
- **dotenv**: Load từ `.env` file
- **Variables**: MONGODB_URI, JWT_SECRET, CORS_ORIGIN, PORT
- **Security**: Không commit `.env` file, use hosting platform secrets
- **Different Environments**: Development, Production

### **Q32: Bạn đã monitor và log như thế nào?**

**Gợi ý trả lời:**
- **Console Logging**: Basic logging
- **Error Logging**: Console.error cho errors
- **Future**: Có thể thêm Winston, Sentry cho production monitoring

---

## 💻 Code Challenge

### **Q33: Hãy viết function để parse ingredients từ text?**

**Gợi ý trả lời:**
```javascript
function parseIngredients(text) {
  return text
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const trimmed = line.trim();
      if (trimmed.includes('|')) {
        const [name, amount, unit] = trimmed.split('|').map(s => s.trim());
        return {
          name: name || '',
          amount: amount || '1',
          unit: unit || ''
        };
      }
      return {
        name: trimmed,
        amount: '1',
        unit: ''
      };
    })
    .filter(ing => ing.name);
}
```

### **Q34: Hãy viết middleware để check authentication?**

**Gợi ý trả lời:**
```javascript
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### **Q35: Hãy viết function để implement pagination?**

**Gợi ý trả lời:**
```javascript
async function getPaginatedData(Model, query, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const total = await Model.countDocuments(query);
  
  const data = await Model.find(query)
    .skip(skip)
    .limit(limit);
  
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  };
}
```

---

## 🎯 Câu Hỏi Mở Rộng

### **Q36: Bạn sẽ cải thiện dự án này như thế nào?**

**Gợi ý trả lời:**
- **Testing**: Thêm unit tests, integration tests
- **Performance**: 
  - Redis caching
  - CDN cho images
  - Database query optimization
- **Features**:
  - Real-time notifications (WebSocket)
  - Advanced search với Elasticsearch
  - Social features (follow, share)
- **Security**:
  - Rate limiting
  - Input sanitization
  - HTTPS only
- **Monitoring**: 
  - Error tracking (Sentry)
  - Performance monitoring
  - Analytics

### **Q37: Bạn đã học được gì từ dự án này?**

**Gợi ý trả lời:**
- Full-stack development workflow
- RESTful API design
- Authentication và authorization
- File upload handling
- Database design và optimization
- Error handling và debugging
- Deployment và DevOps basics
- Performance optimization techniques

### **Q38: Thách thức lớn nhất bạn gặp phải là gì?**

**Gợi ý trả lời:**
- **Challenge**: Upload nhiều images và quản lý state
- **Solution**: Sử dụng Multer, FormData, và proper state management
- **Learning**: Hiểu về file handling, async operations, error handling

---

## 📝 Tips cho Phỏng Vấn

### **Trước Phỏng Vấn:**
1. ✅ Review lại code của bạn
2. ✅ Chuẩn bị demo project
3. ✅ Hiểu rõ từng phần của dự án
4. ✅ Practice giải thích technical concepts
5. ✅ Chuẩn bị questions để hỏi interviewer

### **Trong Phỏng Vấn:**
1. ✅ Giải thích rõ ràng, có structure
2. ✅ Đưa ra ví dụ cụ thể từ code
3. ✅ Thừa nhận limitations và cách cải thiện
4. ✅ Show enthusiasm và willingness to learn
5. ✅ Ask clarifying questions nếu không hiểu

### **Các Điểm Nhấn:**
- ✅ Clean code và organization
- ✅ Security best practices
- ✅ Performance optimization
- ✅ Error handling
- ✅ Scalability considerations

---

## 🎓 Kết Luận

Dự án này thể hiện:
- ✅ Full-stack development skills
- ✅ Understanding of modern web technologies
- ✅ Problem-solving abilities
- ✅ Best practices implementation
- ✅ Willingness to learn and improve

**Good luck với phỏng vấn! 🚀**


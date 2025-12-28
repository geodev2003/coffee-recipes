# 🏗️ Kiến Trúc Hệ Thống & Implementation Guide

## 📐 Kiến Trúc Hệ Thống

### **Mô Hình Kiến Trúc: Client-Server với RESTful API**

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Frontend)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React UI   │  │  React Router│  │   Axios      │     │
│  │  Components  │  │   Navigation  │  │  HTTP Client │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Context    │  │   Services   │  │   Utils      │     │
│  │  (Auth,Toast)│  │    (API)     │  │  (Helpers)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ RESTful API
                            │
┌─────────────────────────────────────────────────────────────┐
│                        SERVER (Backend)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Express    │  │  Middleware  │  │   Routes     │     │
│  │   Framework  │  │  (Auth,CORS)  │  │  (REST API)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │    Models    │  │  Middleware  │     │
│  │  (Business   │  │  (Mongoose   │  │  (JWT,Auth)  │     │
│  │   Logic)     │  │   Schemas)   │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            │
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Users      │  │   Recipes    │  │  Comments    │     │
│  │  Collection  │  │  Collection  │  │  Collection  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Wishlist    │  │ Statistics   │                        │
│  │  Collection  │  │  Collection   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### **Luồng Đi Của Dữ Liệu (Data Flow)**

#### **1. Luồng Đăng Nhập (Authentication Flow)**

```
User Input (Login Form)
    │
    ▼
[Client: LoginPage.jsx]
    │
    │ POST /api/v1/auth/login
    │ { username, password }
    │
    ▼
[Server: authController.js]
    │
    │ 1. Validate input
    │ 2. Find user in database
    │ 3. Compare password (bcrypt)
    │ 4. Generate JWT token
    │
    ▼
[Response: { token, user }]
    │
    ▼
[Client: AuthContext.jsx]
    │
    │ 1. Store token in localStorage
    │ 2. Store user info
    │ 3. Set auth state
    │
    ▼
[Protected Routes: AdminPage, etc.]
```

#### **2. Luồng Tạo Recipe (Create Recipe Flow)**

```
Admin Input (Recipe Form)
    │
    │ 1. Fill form data
    │ 2. Upload images (optional)
    │ 3. Parse ingredients
    │ 4. Parse instructions
    │
    ▼
[Client: AdminPage.jsx]
    │
    │ POST /api/v1/recipes
    │ {
    │   title, description, category,
    │   ingredients: [{name, amount, unit}],
    │   instructions: [String],
    │   images: [String]
    │ }
    │
    ▼
[Server: recipeRoutes.js]
    │
    │ Middleware: protect → adminOnly
    │
    ▼
[Server: recipeController.js]
    │
    │ 1. Validate required fields
    │ 2. Validate ingredients array
    │ 3. Validate instructions array
    │ 4. Prepare recipe data
    │
    ▼
[Server: Recipe Model]
    │
    │ Pre-save hook:
    │ - Generate slug from title
    │
    ▼
[MongoDB: Recipes Collection]
    │
    │ Save document
    │
    ▼
[Response: Saved Recipe]
    │
    ▼
[Client: Update UI, Refresh list]
```

#### **3. Luồng Lấy Danh Sách Recipes (Get Recipes Flow)**

```
User Action (Load Page / Change Filter)
    │
    ▼
[Client: HomePage.jsx]
    │
    │ GET /api/v1/recipes?page=1&limit=12&category=Coffee
    │
    ▼
[Server: recipeRoutes.js]
    │
    │ (No authentication required)
    │
    ▼
[Server: recipeController.js]
    │
    │ 1. Parse query parameters
    │ 2. Build MongoDB query
    │ 3. Apply filters (search, category, etc.)
    │ 4. Calculate pagination (skip, limit)
    │ 5. Execute query with sort
    │ 6. Count total documents
    │
    ▼
[MongoDB: Recipes Collection]
    │
    │ Query with indexes:
    │ - category index
    │ - title index (for search)
    │
    ▼
[Response: { recipes: [], pagination: {} }]
    │
    ▼
[Client: Display recipes, Update pagination]
```

#### **4. Luồng Upload Hình Ảnh (Image Upload Flow)**

```
User Action (Select Image)
    │
    ▼
[Client: ImageUpload.jsx]
    │
    │ 1. Create FormData
    │ 2. Append file(s)
    │
    │ POST /api/v1/upload/multiple
    │ Content-Type: multipart/form-data
    │ Authorization: Bearer {token}
    │
    ▼
[Server: uploadRoutes.js]
    │
    │ Middleware: protect → adminOnly → uploadMultiple
    │
    ▼
[Multer Middleware]
    │
    │ 1. Validate file type (images only)
    │ 2. Check file size (max 5MB)
    │ 3. Generate unique filename
    │ 4. Save to server/uploads/
    │
    ▼
[Server: uploadController.js]
    │
    │ Return file URLs
    │
    ▼
[Response: { success, files: [{url, filename}] }]
    │
    ▼
[Client: Update preview, Store URLs]
```

---

## 🔐 JWT (JSON Web Token) - Cách Tạo & Sử Dụng

### **1. Tạo JWT Token**

**File: `server/middleware/auth.js`**

```javascript
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
exports.generateToken = (userId) => {
  return jwt.sign(
    { userId },           // Payload: data to encode
    JWT_SECRET,           // Secret key: để sign token
    { expiresIn: '7d' }   // Options: token expires sau 7 ngày
  );
};
```

**Cách Sử Dụng:**

```javascript
// Trong authController.js (khi login thành công)
const token = generateToken(user._id);

res.status(200).json({
  success: true,
  token,  // Gửi token về client
  user: {
    id: user._id,
    username: user.username,
    email: user.email
  }
});
```

**Cấu Trúc JWT Token:**

```
Header.Payload.Signature

Header: {
  "alg": "HS256",  // Algorithm: HMAC SHA256
  "typ": "JWT"     // Type: JSON Web Token
}

Payload: {
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1234567890,  // Issued at
  "exp": 1234567890   // Expires at (7 days later)
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```

### **2. Verify JWT Token (Middleware)**

```javascript
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token từ Authorization header
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      // Format: "Bearer {token}"
    }

    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized, no token provided' 
      });
    }

    try {
      // 2. Verify token với secret key
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // 3. Lấy user từ database dựa trên userId trong token
      req.user = await User.findById(decoded.userId).select('-password');
      
      // 4. Kiểm tra user tồn tại và active
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ 
          message: 'User not found or inactive' 
        });
      }

      // 5. Pass control đến next middleware/controller
      next();
    } catch (error) {
      return res.status(401).json({ 
        message: 'Not authorized, token failed' 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

### **3. Client-Side: Gửi Token với Request**

**File: `client/src/services/api.js`**

```javascript
// Axios interceptor: Tự động thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // Lấy từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

## 🔒 Mã Hóa Mật Khẩu (Password Hashing)

### **1. Pre-save Hook trong User Model**

**File: `server/models/User.js`**

```javascript
const bcrypt = require('bcryptjs');

// Pre-save hook: Tự động hash password trước khi save
userSchema.pre('save', async function() {
  // Chỉ hash nếu password được modify (tạo mới hoặc update)
  if (!this.isModified('password')) {
    return; // Skip nếu password không thay đổi
  }
  
  try {
    // 1. Generate salt (random string để tăng độ bảo mật)
    const salt = await bcrypt.genSalt(10); // 10 rounds
    
    // 2. Hash password với salt
    this.password = await bcrypt.hash(this.password, salt);
    
    // 3. Lưu hashed password vào database
  } catch (error) {
    throw error;
  }
});
```

**Luồng Xử Lý:**

```
User Input: "password123"
    │
    ▼
[Pre-save Hook Triggered]
    │
    │ 1. Check: isModified('password')? → Yes
    │ 2. Generate salt: bcrypt.genSalt(10)
    │    → Salt: "$2a$10$N9qo8uLOickgx2ZMRZoMye"
    │
    ▼
[Hash Password]
    │
    │ bcrypt.hash("password123", salt)
    │
    ▼
[Hashed Password]
    │
    │ "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
    │
    ▼
[Save to Database]
    │
    │ User document:
    │ {
    │   username: "john",
    │   email: "john@example.com",
    │   password: "$2a$10$N9qo8uLOickgx2ZMRZoMye..." // Hashed
    │ }
```

### **2. So Sánh Mật Khẩu (Password Verification)**

```javascript
// Method trong User model
userSchema.methods.comparePassword = async function(candidatePassword) {
  // candidatePassword: password người dùng nhập vào
  // this.password: hashed password trong database
  
  return await bcrypt.compare(candidatePassword, this.password);
  // Returns: true nếu match, false nếu không match
};
```

**Sử Dụng trong Login:**

```javascript
// authController.js
const user = await User.findOne({ username });

// So sánh password người dùng nhập với hashed password
const isPasswordValid = await user.comparePassword(password);

if (!isPasswordValid) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

**Bcrypt Hoạt Động Như Thế Nào:**

1. **Salt**: Random string được thêm vào password trước khi hash
   - Mỗi password có salt riêng → cùng password nhưng hash khác nhau
   - Salt được lưu trong hash string

2. **Rounds**: Số lần hash được thực hiện (10 rounds = 2^10 = 1024 iterations)
   - Càng nhiều rounds → càng an toàn nhưng chậm hơn
   - 10 rounds là balance tốt giữa security và performance

3. **Hash Format**: `$2a$10$salt22charactershashedpassword31characters`
   - `$2a$`: Bcrypt version
   - `10`: Rounds
   - `salt...`: 22 characters salt
   - `hash...`: 31 characters hash

---

## 📄 Pagination - Phân Trang

### **1. Backend Implementation**

**File: `server/controllers/recipeController.js`**

```javascript
exports.getRecipes = async (req, res) => {
  try {
    // 1. Parse query parameters
    const { 
      page = 1,      // Trang hiện tại (default: 1)
      limit = 12,   // Số items mỗi trang (default: 12)
      search,
      category,
      // ... other filters
    } = req.query;
    
    // 2. Build query object
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // 3. Calculate pagination
    const pageNum = parseInt(page);        // Convert to number
    const limitNum = parseInt(limit);      // Convert to number
    const skip = (pageNum - 1) * limitNum; // Số documents bỏ qua
    
    // Ví dụ: page=2, limit=12
    // skip = (2-1) * 12 = 12
    // → Bỏ qua 12 documents đầu, lấy từ document thứ 13
    
    // 4. Get total count (cho pagination info)
    const total = await Recipe.countDocuments(query);
    
    // 5. Execute query với pagination
    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })  // Sort by newest first
      .skip(skip)                // Skip documents
      .limit(limitNum);          // Limit số documents
    
    // 6. Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum);
    
    res.status(200).json({
      recipes,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalRecipes: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Ví Dụ Tính Toán:**

```
Total recipes: 50
Limit per page: 12

Page 1:
  skip = (1-1) * 12 = 0
  limit = 12
  → Documents 1-12

Page 2:
  skip = (2-1) * 12 = 12
  limit = 12
  → Documents 13-24

Page 3:
  skip = (3-1) * 12 = 24
  limit = 12
  → Documents 25-36

Total pages = Math.ceil(50/12) = 5 pages
```

### **2. Frontend Implementation**

**File: `client/src/pages/HomePage.jsx`**

```javascript
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState({
  currentPage: 1,
  totalPages: 1,
  totalRecipes: 0
});

const fetchRecipes = async (page = 1) => {
  try {
    const response = await getRecipes(
      search,
      category,
      filters,
      page,      // Page number
      12         // Limit per page
    );
    
    setRecipes(response.recipes);
    setPagination(response.pagination);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
};

// Handle page change
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
  fetchRecipes(newPage);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

**Pagination Component:**

```javascript
<Pagination
  currentPage={pagination.currentPage}
  totalPages={pagination.totalPages}
  onPageChange={handlePageChange}
/>
```

---

## 🖼️ Lazy Loading

### **1. Image Lazy Loading (Native Browser)**

**Cách 1: Sử dụng `loading="lazy"` attribute**

```jsx
<img
  src={recipe.image}
  alt={recipe.title}
  loading="lazy"  // Browser tự động lazy load
  className="w-full h-full object-cover"
/>
```

**Cách 2: Intersection Observer API**

```javascript
// Custom hook: useLazyImage.js
import { useState, useEffect, useRef } from 'react';

const useLazyImage = (src) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Image vào viewport → load image
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return [imageSrc, isLoaded, imgRef];
};
```

**Sử Dụng:**

```jsx
const [imageSrc, isLoaded, imgRef] = useLazyImage(recipe.image);

<img
  ref={imgRef}
  src={imageSrc || '/placeholder.jpg'}
  alt={recipe.title}
  className={isLoaded ? 'opacity-100' : 'opacity-50'}
/>
```

### **2. Component Lazy Loading (Code Splitting)**

**React.lazy() và Suspense:**

```javascript
// Lazy load component
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Sử dụng với Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Routes>
</Suspense>
```

**Lợi Ích:**
- Giảm bundle size ban đầu
- Load component chỉ khi cần
- Cải thiện performance

---

## 🧪 Hàm parseIngredient & Luồng Xử Lý

### **1. Implementation trong AdminPage**

**File: `client/src/pages/AdminPage.jsx`**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Input từ textarea (multi-line text)
  // Format: "name|amount|unit" (one per line)
  // Ví dụ:
  // "Espresso Coffee|18|g
  //  Whole Milk|150|ml
  //  Sugar|1|tsp"
  
  const ingredientsText = formData.ingredients;
  
  // 1. Split by newline để tách từng dòng
  const lines = ingredientsText.split('\n');
  // Result: ["Espresso Coffee|18|g", "Whole Milk|150|ml", "Sugar|1|tsp"]
  
  // 2. Filter: Loại bỏ dòng trống
  const nonEmptyLines = lines.filter(line => line.trim());
  // Result: ["Espresso Coffee|18|g", "Whole Milk|150|ml", "Sugar|1|tsp"]
  
  // 3. Map: Parse từng dòng thành object
  const ingredientsArray = nonEmptyLines.map(line => {
    const trimmedLine = line.trim();
    
    // Kiểm tra xem có chứa "|" không
    if (trimmedLine.includes('|')) {
      // Format: "name|amount|unit"
      const parts = trimmedLine.split('|').map(p => p.trim());
      // parts = ["Espresso Coffee", "18", "g"]
      
      return {
        name: parts[0] || '',        // "Espresso Coffee"
        amount: parts[1] || '1',     // "18" (default: "1")
        unit: parts[2] || ''         // "g" (default: "")
      };
    } else {
      // Format: chỉ có name (không có amount và unit)
      // Ví dụ: "Vanilla Extract"
      return {
        name: trimmedLine,           // "Vanilla Extract"
        amount: '1',                 // Default amount
        unit: ''                     // No unit
      };
    }
  });
  
  // 4. Filter: Loại bỏ ingredients không có name
  const validIngredients = ingredientsArray.filter(
    ing => ing.name && ing.name.trim()
  );
  
  // Final result:
  // [
  //   { name: "Espresso Coffee", amount: "18", unit: "g" },
  //   { name: "Whole Milk", amount: "150", unit: "ml" },
  //   { name: "Sugar", amount: "1", unit: "tsp" }
  // ]
  
  // 5. Validate: Phải có ít nhất 1 ingredient
  if (validIngredients.length === 0) {
    alert('Please add at least one ingredient');
    return;
  }
  
  // 6. Gửi lên server
  const recipeData = {
    title: formData.title,
    description: formData.description,
    ingredients: validIngredients,  // Array of objects
    // ... other fields
  };
  
  await createRecipe(recipeData);
};
```

### **2. Luồng Xử Lý Hoàn Chỉnh**

```
User Input (Textarea)
    │
    │ "Espresso Coffee|18|g
    │  Whole Milk|150|ml
    │  Sugar|1|tsp"
    │
    ▼
[Split by Newline]
    │
    │ ["Espresso Coffee|18|g", "Whole Milk|150|ml", "Sugar|1|tsp"]
    │
    ▼
[Filter Empty Lines]
    │
    │ ["Espresso Coffee|18|g", "Whole Milk|150|ml", "Sugar|1|tsp"]
    │
    ▼
[Parse Each Line]
    │
    │ For each line:
    │   - Check if contains "|"
    │   - If yes: split by "|" → [name, amount, unit]
    │   - If no: use whole line as name, default amount="1"
    │
    ▼
[Create Objects]
    │
    │ [
    │   { name: "Espresso Coffee", amount: "18", unit: "g" },
    │   { name: "Whole Milk", amount: "150", unit: "ml" },
    │   { name: "Sugar", amount: "1", unit: "tsp" }
    │ ]
    │
    ▼
[Validate]
    │
    │ - Check: length > 0
    │ - Check: each has name
    │
    ▼
[Send to Server]
    │
    │ POST /api/v1/recipes
    │ {
    │   ingredients: [
    │     { name: "Espresso Coffee", amount: "18", unit: "g" },
    │     ...
    │   ]
    │ }
    │
    ▼
[Server Validation]
    │
    │ - Check: is array
    │ - Check: each has name and amount
    │
    ▼
[Save to Database]
    │
    │ Recipe document:
    │ {
    │   ingredients: [
    │     { name: "Espresso Coffee", amount: "18", unit: "g" },
    │     ...
    │   ]
    │ }
```

### **3. Reverse: Format Ingredients để Edit**

```javascript
// Khi edit recipe, cần format lại từ array → text
const handleEdit = (recipe) => {
  // Input: Array of objects
  // [
  //   { name: "Espresso Coffee", amount: "18", unit: "g" },
  //   { name: "Whole Milk", amount: "150", unit: "ml" }
  // ]
  
  const ingredientsStr = recipe.ingredients
    .map(ing => {
      // Format: "name|amount|unit"
      if (ing.unit) {
        return `${ing.name}|${ing.amount}|${ing.unit}`;
      } else if (ing.amount && ing.amount !== '1') {
        return `${ing.name}|${ing.amount}`;
      } else {
        return ing.name; // Chỉ có name
      }
    })
    .join('\n'); // Join với newline
    
  // Output: "Espresso Coffee|18|g\nWhole Milk|150|ml"
  
  setFormData({
    ...formData,
    ingredients: ingredientsStr
  });
};
```

---

## 🌐 CORS Configuration

### **File: `server/server.js`**

```javascript
const cors = require('cors');

// CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    // 1. Allow requests với no origin (mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // 2. Danh sách allowed origins
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:5174',  // Alternative port
      'http://localhost:5175',  // Alternative port
      process.env.CORS_ORIGIN   // Production origin từ env
    ].filter(Boolean); // Loại bỏ undefined/null
    
    // 3. Kiểm tra origin có trong danh sách không
    if (allowedOrigins.indexOf(origin) !== -1) {
      // Origin được phép
      callback(null, true);
    } else if (process.env.NODE_ENV !== 'production') {
      // Development: Allow all origins
      callback(null, true);
    } else {
      // Production: Reject unknown origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true  // Cho phép gửi cookies/credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));
```

**CORS Headers được Gửi:**

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Luồng CORS Request:**

```
Browser (Client)
    │
    │ GET /api/v1/recipes
    │ Origin: http://localhost:5173
    │
    ▼
[Preflight Request (OPTIONS)]
    │
    │ OPTIONS /api/v1/recipes
    │ Origin: http://localhost:5173
    │
    ▼
[Server: CORS Middleware]
    │
    │ 1. Check origin trong allowedOrigins
    │ 2. Return CORS headers
    │
    ▼
[Browser: Check Response]
    │
    │ Access-Control-Allow-Origin: http://localhost:5173 ✓
    │
    ▼
[Actual Request (GET)]
    │
    │ GET /api/v1/recipes
    │
    ▼
[Server: Process Request]
    │
    │ Return data với CORS headers
```

---

## 📦 JSON Payload Configuration

### **File: `server/server.js`**

```javascript
// 1. JSON Parser Middleware
app.use(express.json({ 
  limit: '10mb'  // Maximum payload size: 10MB
}));

// 2. URL-encoded Parser Middleware
app.use(express.urlencoded({ 
  extended: true  // Parse nested objects
}));
```

**Giải Thích:**

1. **`express.json()`**: Parse JSON request body
   - Content-Type: `application/json`
   - Limit: 10MB (đủ cho large payloads như images base64)

2. **`express.urlencoded()`**: Parse form-urlencoded request body
   - Content-Type: `application/x-www-form-urlencoded`
   - Extended: true → hỗ trợ nested objects

**Ví Dụ Request:**

```javascript
// JSON Request
POST /api/v1/recipes
Content-Type: application/json

{
  "title": "Espresso",
  "description": "...",
  "ingredients": [...]
}

// Form-urlencoded Request
POST /api/v1/recipes
Content-Type: application/x-www-form-urlencoded

title=Espresso&description=...&ingredients=...
```

**Luồng Xử Lý:**

```
Client Request
    │
    │ POST /api/v1/recipes
    │ Content-Type: application/json
    │ Body: { "title": "...", ... }
    │
    ▼
[Express JSON Middleware]
    │
    │ 1. Check Content-Type
    │ 2. Parse JSON string → JavaScript object
    │ 3. Check size < 10MB
    │ 4. Attach to req.body
    │
    ▼
[Controller]
    │
    │ req.body = {
    │   title: "...",
    │   description: "...",
    │   ...
    │ }
    │
    ▼
[Process Request]
```

---

## 🗄️ MongoDB Indexing

### **1. Indexes trong Models**

**File: `server/models/Comment.js`**

```javascript
const commentSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
    index: true  // Single field index
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // ...
});

// Index được tạo tự động:
// { recipeId: 1 }
```

**File: `server/models/Wishlist.js`**

```javascript
const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true  // Single field index
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  }
});

// Compound index (multiple fields)
wishlistSchema.index({ userId: 1, recipeId: 1 }, { unique: true });
// Index: { userId: 1, recipeId: 1 }
// Unique: Không cho phép duplicate combination
```

### **2. Cách Indexes Hoạt Động**

**Không có Index:**

```
Query: db.recipes.find({ category: "Coffee" })

MongoDB phải:
1. Scan toàn bộ collection
2. Check từng document
3. Return matching documents

Time: O(n) - Linear scan
```

**Có Index:**

```
Query: db.recipes.find({ category: "Coffee" })

MongoDB:
1. Lookup index: { category: 1 }
2. Find matching entries (fast B-tree lookup)
3. Get document IDs
4. Fetch documents

Time: O(log n) - Logarithmic lookup
```

### **3. Index Types**

**1. Single Field Index:**
```javascript
// Index trên 1 field
{ category: 1 }  // Ascending
{ createdAt: -1 } // Descending
```

**2. Compound Index:**
```javascript
// Index trên nhiều fields
{ userId: 1, recipeId: 1 }
// Order matters! Query phải match prefix
```

**3. Text Index (Full-text search):**
```javascript
recipeSchema.index({ title: 'text', description: 'text' });

// Query
Recipe.find({ $text: { $search: 'coffee' } });
```

### **4. Index Performance**

**Ví Dụ Query với Index:**

```javascript
// Query: Find recipes by category, sorted by createdAt
Recipe.find({ category: 'Coffee' })
  .sort({ createdAt: -1 })
  .limit(10);

// Indexes được sử dụng:
// 1. { category: 1 } - Filter
// 2. { createdAt: -1 } - Sort (nếu có index)
```

**Index Strategy:**

```javascript
// Recipe Model - Suggested indexes
recipeSchema.index({ category: 1, createdAt: -1 }); // Compound
recipeSchema.index({ title: 'text' }); // Text search
recipeSchema.index({ slug: 1 }, { unique: true }); // Unique slug
```

---

## 🔧 Pre-save Hook - Cách Sử Dụng

### **1. Pre-save Hook là gì?**

**Pre-save hook** là middleware trong Mongoose được gọi tự động trước khi document được lưu vào database.

**Lifecycle:**

```
User Code: recipe.save()
    │
    ▼
[Pre-save Hook 1]
    │
    ▼
[Pre-save Hook 2]
    │
    ▼
[Validation]
    │
    ▼
[Save to Database]
```

### **2. Ví Dụ 1: Password Hashing**

**File: `server/models/User.js`**

```javascript
userSchema.pre('save', async function() {
  // 'this' = document đang được save
  
  // Chỉ hash nếu password được modify
  if (!this.isModified('password')) {
    return; // Skip hook
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // 'this.password' đã được update
  // Khi save() được gọi, hashed password sẽ được lưu
});
```

**Sử Dụng:**

```javascript
// Tạo user mới
const user = new User({
  username: 'john',
  email: 'john@example.com',
  password: 'password123' // Plain text
});

await user.save();
// Pre-save hook tự động hash password
// Database: password = "$2a$10$..."
```

### **3. Ví Dụ 2: Slug Generation**

**File: `server/models/Recipe.js`**

```javascript
recipeSchema.pre('save', function() {
  // Generate slug từ title
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()              // "Espresso Coffee" → "espresso coffee"
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric với "-"
      // "espresso coffee" → "espresso-coffee"
      .replace(/(^-|-$)/g, '');    // Remove leading/trailing dashes
    
    // Fallback nếu slug rỗng
    if (!this.slug) {
      this.slug = 'recipe-' + Date.now();
    }
  }
});
```

**Sử Dụng:**

```javascript
const recipe = new Recipe({
  title: 'Espresso Coffee',
  description: '...',
  // slug sẽ được generate tự động
});

await recipe.save();
// Pre-save hook tạo slug: "espresso-coffee"
```

### **4. Các Loại Hooks**

**1. Pre-save:**
```javascript
schema.pre('save', function() {
  // Chạy trước khi save
});
```

**2. Post-save:**
```javascript
schema.post('save', function(doc) {
  // Chạy sau khi save
  // 'doc' = document đã được save
});
```

**3. Pre-validate:**
```javascript
schema.pre('validate', function() {
  // Chạy trước khi validate
});
```

**4. Post-remove:**
```javascript
schema.post('remove', function(doc) {
  // Chạy sau khi remove
});
```

### **5. Best Practices**

**1. Async Hooks:**
```javascript
// Sử dụng async/await cho async operations
schema.pre('save', async function() {
  await someAsyncOperation();
});
```

**2. Skip khi không cần:**
```javascript
schema.pre('save', function() {
  if (!this.isModified('field')) {
    return; // Skip nếu field không thay đổi
  }
  // Process...
});
```

**3. Error Handling:**
```javascript
schema.pre('save', async function() {
  try {
    // Process...
  } catch (error) {
    throw error; // Throw để prevent save
  }
});
```

---

## 📊 Tổng Kết

### **Kiến Trúc:**
- Client-Server với RESTful API
- Separation of concerns: Routes → Controllers → Models → Database

### **JWT:**
- Generate với `jwt.sign()`
- Verify với `jwt.verify()`
- Expiration: 7 days

### **Password Hashing:**
- Pre-save hook tự động hash
- Bcrypt với 10 rounds
- Compare với `bcrypt.compare()`

### **Pagination:**
- Backend: `skip()` và `limit()`
- Frontend: State management và UI controls

### **Lazy Loading:**
- Images: `loading="lazy"` hoặc Intersection Observer
- Components: React.lazy() và Suspense

### **parseIngredient:**
- Parse text → array of objects
- Format: "name|amount|unit" per line

### **CORS:**
- Configure allowed origins
- Support credentials

### **JSON Payload:**
- `express.json({ limit: '10mb' })`
- Parse request body

### **MongoDB Indexing:**
- Single field và compound indexes
- Tăng tốc queries

### **Pre-save Hooks:**
- Tự động xử lý trước khi save
- Password hashing, slug generation


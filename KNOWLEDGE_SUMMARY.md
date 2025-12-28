# 📚 Tóm Tắt Kiến Thức - Coffee Recipes Project

## 🎯 Kiến Thức Cốt Lõi Cần Nhớ

### **1. Frontend Stack**

#### **React 19**

- **Component-based**: Tách UI thành các components tái sử dụng
- **Hooks**: `useState`, `useEffect`, `useContext`
- **Props & State**: Data flow từ parent → child
- **Virtual DOM**: React tối ưu rendering

#### **Vite**

- **Build Tool**: Thay thế Webpack, nhanh hơn
- **HMR (Hot Module Replacement)**: Update code không cần reload
- **ES Modules**: Import/export native

#### **Tailwind CSS**

- **Utility-first**: Classes như `flex`, `p-4`, `bg-blue-500`
- **Responsive**: `md:`, `lg:` prefixes
- **Customization**: Extend theme trong `tailwind.config.js`

#### **React Router**

- **Client-side Routing**: Navigation không reload page
- **Protected Routes**: Check auth trước khi render
- **Dynamic Routes**: `/recipe/:id`

---

### **2. Backend Stack**

#### **Node.js**

- **JavaScript Runtime**: Chạy JS trên server
- **Event Loop**: Non-blocking I/O
- **NPM**: Package manager

#### **Express.js**

- **Web Framework**: Tạo RESTful API
- **Middleware**: Functions chạy giữa request và response
- **Routes**: Định nghĩa endpoints

#### **MongoDB**

- **NoSQL Database**: Document-based
- **Collections**: Tương đương tables trong SQL
- **Documents**: JSON-like objects

#### **Mongoose**

- **ODM (Object Document Mapper)**: Map JS objects ↔ MongoDB documents
- **Schemas**: Định nghĩa structure
- **Models**: Classes để interact với database

---

### **3. Authentication & Security**

#### **JWT (JSON Web Token)**

- **Stateless**: Không cần lưu session trên server
- **Structure**: `Header.Payload.Signature`
- **Expiration**: Token hết hạn sau 7 days
- **Storage**: localStorage (hoặc httpOnly cookies)

#### **Bcrypt**

- **Password Hashing**: Mã hóa password một chiều
- **Salt**: Random string để tăng security
- **Rounds**: Số lần hash (10 rounds = 2^10 iterations)

#### **CORS (Cross-Origin Resource Sharing)**

- **Same-origin Policy**: Browser block cross-origin requests
- **CORS Headers**: Server cho phép specific origins
- **Preflight**: OPTIONS request trước actual request

---

### **4. Data Flow & Architecture**

#### **RESTful API**

- **GET**: Lấy data
- **POST**: Tạo mới
- **PUT**: Update toàn bộ
- **PATCH**: Update một phần
- **DELETE**: Xóa

#### **MVC Pattern**

- **Model**: Data structure (Mongoose schemas)
- **View**: Presentation (API responses)
- **Controller**: Business logic

#### **Middleware Chain**

```
Request → CORS → Body Parser → Auth → Controller → Response
```

---

## 📖 Giải Thích Thuật Ngữ

### **Frontend Terms**

#### **1. Component**

```javascript
// Component là một function/class trả về JSX
const RecipeCard = ({ recipe }) => {
  return <div>{recipe.title}</div>;
};
```

- **Reusable**: Dùng lại nhiều lần
- **Props**: Data từ parent component
- **State**: Internal data của component

#### **2. Hooks**

```javascript
// useState: Quản lý state
const [count, setCount] = useState(0);

// useEffect: Side effects (API calls, subscriptions)
useEffect(() => {
  fetchData();
}, [dependencies]);

// useContext: Access context value
const { user } = useContext(AuthContext);
```

- **Rules**: Chỉ gọi ở top level, không trong loops/conditions

#### **3. Context API**

```javascript
// Tạo context
const AuthContext = createContext();

// Provider: Wrap app, provide value
<AuthContext.Provider value={{ user, login }}>
  <App />
</AuthContext.Provider>

// Consumer: Use context
const { user } = useContext(AuthContext);
```

- **Global State**: Share data across components
- **Avoid Prop Drilling**: Không cần pass props qua nhiều levels

#### **4. Virtual DOM**

- **Concept**: JavaScript representation của real DOM
- **Diffing**: So sánh Virtual DOM cũ vs mới
- **Reconciliation**: Update chỉ phần thay đổi
- **Performance**: Nhanh hơn direct DOM manipulation

#### **5. Single Page Application (SPA)**

- **Definition**: App chỉ load 1 HTML page, navigation không reload
- **Benefits**: Faster, smoother UX
- **Routing**: React Router handle navigation

---

### **Backend Terms**

#### **1. Middleware**

```javascript
// Middleware là function có 3 params: req, res, next
const logger = (req, res, next) => {
  console.log(req.method, req.path);
  next(); // Pass to next middleware
};

app.use(logger);
```

- **Execution Order**: Chạy theo thứ tự khai báo
- **next()**: Pass control to next middleware
- **Types**: Authentication, validation, error handling

#### **2. RESTful API**

- **REST**: Representational State Transfer
- **Resources**: URLs represent resources (`/recipes`, `/users`)
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Stateless**: Mỗi request độc lập

#### **3. Async/Await**

```javascript
// Async function
const fetchData = async () => {
  try {
    const data = await fetch('/api/recipes');
    return data.json();
  } catch (error) {
    console.error(error);
  }
};
```

- **Async**: Function trả về Promise
- **Await**: Đợi Promise resolve
- **Error Handling**: Try-catch

#### **4. Promise**

```javascript
// Promise có 3 states: pending, fulfilled, rejected
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(data);
  } else {
    reject(error);
  }
});

promise
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

- **Chaining**: `.then().catch()`
- **Async/Await**: Syntactic sugar cho Promises

#### **5. Callback Hell**

```javascript
// Bad: Nested callbacks
getData((data) => {
  processData(data, (result) => {
    saveData(result, (saved) => {
      // Too nested!
    });
  });
});

// Good: Async/await
const data = await getData();
const result = await processData(data);
const saved = await saveData(result);
```

---

### **Database Terms**

#### **1. NoSQL vs SQL**

| NoSQL (MongoDB)    | SQL (MySQL, PostgreSQL) |
| ------------------ | ----------------------- |
| Document-based     | Table-based             |
| Flexible schema    | Fixed schema            |
| Horizontal scaling | Vertical scaling        |
| JSON-like          | Relational              |

#### **2. Document**

```javascript
// MongoDB document (giống JSON object)
{
  _id: ObjectId("..."),
  title: "Espresso",
  ingredients: [
    { name: "Coffee", amount: "18g" }
  ]
}
```

- **Collection**: Nhóm documents (như table)
- **Field**: Key-value pairs trong document

#### **3. Schema**

```javascript
// Mongoose schema định nghĩa structure
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  prepTime: { type: Number, required: true }
});
```

- **Validation**: Required, type, min, max
- **Defaults**: Giá trị mặc định

#### **4. Index**

```javascript
// Index tăng tốc queries
recipeSchema.index({ category: 1 });
// Query: find({ category: "Coffee" }) → Fast!
```

- **B-tree**: Data structure để search nhanh
- **Single Field**: Index trên 1 field
- **Compound**: Index trên nhiều fields

#### **5. Query**

```javascript
// Find documents
Recipe.find({ category: "Coffee" })
  .sort({ createdAt: -1 })
  .limit(10);

// Find one
Recipe.findById(id);

// Create
const recipe = new Recipe(data);
await recipe.save();
```

- **Find**: Search documents
- **Sort**: Order results
- **Limit**: Limit số results

---

### **Security Terms**

#### **1. Authentication vs Authorization**

- **Authentication**: "Who are you?" (Login)
- **Authorization**: "What can you do?" (Permissions)

#### **2. JWT Structure**

```
Header.Payload.Signature

Header: { alg: "HS256", typ: "JWT" }
Payload: { userId: "...", exp: ... }
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

#### **3. Hashing vs Encryption**

- **Hashing**: One-way (bcrypt) - không decrypt được
- **Encryption**: Two-way (AES) - có thể decrypt

#### **4. Salt**

```javascript
// Salt là random string thêm vào password trước khi hash
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);

// Cùng password, khác salt → khác hash
```

- **Purpose**: Prevent rainbow table attacks
- **Unique**: Mỗi password có salt riêng

#### **5. CORS**

```
Browser → Server: GET /api/recipes
Origin: http://localhost:5173

Server → Browser:
Access-Control-Allow-Origin: http://localhost:5173
```

- **Same Origin**: Same protocol, domain, port
- **Cross Origin**: Khác origin → cần CORS headers

---

### **Performance Terms**

#### **1. Pagination**

```javascript
// Chia data thành pages
const page = 1;
const limit = 12;
const skip = (page - 1) * limit;

const data = await Model.find()
  .skip(skip)  // Bỏ qua skip documents
  .limit(limit); // Lấy limit documents
```

- **Purpose**: Giảm data transfer, tăng performance
- **Skip**: Số documents bỏ qua
- **Limit**: Số documents lấy

#### **2. Lazy Loading**

```javascript
// Load image chỉ khi vào viewport
<img src="image.jpg" loading="lazy" />

// Load component chỉ khi cần
const AdminPage = React.lazy(() => import('./AdminPage'));
```

- **On-demand**: Load khi cần
- **Performance**: Giảm initial load time

#### **3. Code Splitting**

```javascript
// Chia code thành chunks
const AdminPage = React.lazy(() => import('./AdminPage'));

// Load chunk khi route active
<Suspense fallback={<Loading />}>
  <AdminPage />
</Suspense>
```

- **Bundle Size**: Giảm initial bundle
- **Lazy Load**: Load chunks on-demand

#### **4. Memoization**

```javascript
// Cache kết quả function
const expensiveValue = useMemo(() => {
  return heavyCalculation();
}, [dependencies]);

// Cache component
const MemoizedComponent = React.memo(Component);
```

- **Purpose**: Tránh tính toán lại không cần thiết
- **Cache**: Lưu kết quả, reuse nếu inputs không đổi

---

### **Architecture Terms**

#### **1. MVC Pattern**

```
Model: Data structure
View: Presentation (API response)
Controller: Business logic
```

- **Separation**: Tách concerns
- **Maintainability**: Dễ maintain

#### **2. Middleware Pattern**

```
Request → Middleware 1 → Middleware 2 → Controller → Response
```

- **Chain**: Nhiều middleware chạy tuần tự
- **next()**: Pass to next middleware

#### **3. RESTful**

- **Resources**: URLs là nouns (`/recipes`, `/users`)
- **Methods**: HTTP methods là verbs (GET, POST, PUT, DELETE)
- **Stateless**: Không lưu state trên server

#### **4. API Versioning**

```
/api/v1/recipes
/api/v2/recipes
```

- **Purpose**: Support multiple versions
- **Backward Compatibility**: Không break old clients

---

### **File Upload Terms**

#### **1. Multipart/Form-data**

```
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="image"; filename="photo.jpg"
Content-Type: image/jpeg

[Binary data]
--boundary--
```

- **Format**: Dùng để upload files
- **Boundary**: Separator giữa fields

#### **2. Multer**

```javascript
// Middleware để handle multipart/form-data
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), (req, res) => {
  // req.file chứa file info
});
```

- **Storage**: Disk storage hoặc memory
- **File Filter**: Validate file type, size

#### **3. FormData**

```javascript
// Client-side: Tạo FormData
const formData = new FormData();
formData.append('image', file);

// Send với axios
axios.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

---

### **Mongoose Terms**

#### **1. Pre-save Hook**

```javascript
// Chạy trước khi save
schema.pre('save', async function() {
  // 'this' = document đang được save
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
```

- **Lifecycle**: Pre-save → Validation → Save
- **Use Cases**: Hash password, generate slug

#### **2. Post-save Hook**

```javascript
// Chạy sau khi save
schema.post('save', function(doc) {
  console.log('Saved:', doc);
});
```

#### **3. Virtual Fields**

```javascript
// Field không lưu trong DB, tính toán từ fields khác
schema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
```

#### **4. Populate**

```javascript
// Thay ObjectId bằng actual document
const comment = await Comment.findById(id)
  .populate('userId', 'username email');
// userId: ObjectId → { username: "...", email: "..." }
```

---

## 🎯 Checklist Kiến Thức

### **Frontend**

- [ ] React components, props, state
- [ ] Hooks: useState, useEffect, useContext
- [ ] React Router: routing, protected routes
- [ ] Context API: global state
- [ ] Axios: HTTP requests, interceptors
- [ ] Tailwind CSS: utility classes
- [ ] Vite: build tool, HMR

### **Backend**

- [ ] Express: routes, middleware
- [ ] MongoDB: collections, documents, queries
- [ ] Mongoose: schemas, models, hooks
- [ ] JWT: token generation, verification
- [ ] Bcrypt: password hashing
- [ ] Multer: file upload
- [ ] CORS: cross-origin requests

### **Architecture**

- [ ] MVC pattern
- [ ] RESTful API design
- [ ] Middleware chain
- [ ] Error handling
- [ ] Pagination
- [ ] Authentication flow

### **Security**

- [ ] JWT authentication
- [ ] Password hashing
- [ ] CORS configuration
- [ ] Input validation
- [ ] Authorization (role-based)

### **Performance**

- [ ] MongoDB indexing
- [ ] Pagination
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Image optimization

---

## 💡 Tips Nhớ Thuật Ngữ

### **1. JWT = JSON Web Token**

- **J**: JSON format
- **W**: Web (HTTP)
- **T**: Token (authentication)

### **2. REST = Representational State Transfer**

- **R**: Resources (nouns)
- **E**: State (data)
- **S**: Transfer (HTTP)

### **3. MVC = Model-View-Controller**

- **M**: Model (data)
- **V**: View (presentation)
- **C**: Controller (logic)

### **4. SPA = Single Page Application**

- Chỉ 1 HTML page
- Navigation không reload

### **5. ODM = Object Document Mapper**

- Map JS objects ↔ MongoDB documents
- Mongoose là ODM cho MongoDB

---

## 📝 Quick Reference

### **Common Patterns**

#### **1. API Call Pattern**

```javascript
// Frontend
const fetchData = async () => {
  try {
    const response = await api.get('/recipes');
    setData(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

#### **2. Protected Route Pattern**

```javascript
// Backend
router.get('/admin', protect, adminOnly, controller);

// Frontend
<Route path="/admin" element={
  <ProtectedRoute>
    <AdminPage />
  </ProtectedRoute>
} />
```

#### **3. Pagination Pattern**

```javascript
const page = 1;
const limit = 12;
const skip = (page - 1) * limit;

const data = await Model.find()
  .skip(skip)
  .limit(limit);
```

#### **4. Error Handling Pattern**

```javascript
try {
  // Code
} catch (error) {
  if (error.name === 'ValidationError') {
    // Handle validation error
  } else {
    // Handle other errors
  }
}
```

---

## 🚀 Key Points để Nhớ

1. **React**: Component-based, hooks, virtual DOM
2. **Express**: Middleware, routes, RESTful API
3. **MongoDB**: NoSQL, documents, collections
4. **JWT**: Stateless authentication
5. **Bcrypt**: Password hashing với salt
6. **Mongoose**: ODM, schemas, hooks
7. **Pagination**: Skip và limit
8. **CORS**: Cross-origin requests
9. **Middleware**: Chain of functions
10. **MVC**: Separation of concerns

---

## ✅ Final Checklist

Trước phỏng vấn, đảm bảo bạn có thể:

- [ ] Giải thích kiến trúc tổng thể
- [ ] Giải thích authentication flow
- [ ] Giải thích data flow (request → response)
- [ ] Giải thích các thuật ngữ chính
- [ ] Viết code examples cho common patterns
- [ ] Giải thích design decisions
- [ ] Discuss trade-offs và improvements

**Good luck! 🎯**

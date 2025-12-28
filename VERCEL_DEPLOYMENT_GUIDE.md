# Hướng Dẫn Deploy Dự Án BrewVibe Lên Vercel

Hướng dẫn chi tiết để deploy dự án MERN stack lên Vercel (Frontend) và MongoDB Atlas (Database).

## Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Chuẩn Bị](#chuẩn-bị)
3. [Cấu Hình MongoDB Atlas](#cấu-hình-mongodb-atlas)
4. [Cấu Hình Backend cho Vercel](#cấu-hình-backend-cho-vercel)
5. [Deploy Frontend](#deploy-frontend)
6. [Cấu Hình Environment Variables](#cấu-hình-environment-variables)
7. [Kiểm Tra và Testing](#kiểm-tra-và-testing)
8. [Troubleshooting](#troubleshooting)

---

## Tổng Quan

Vercel là platform tốt cho:
- ✅ **Frontend (React)**: Deploy trực tiếp từ Git
- ✅ **Backend (Node.js/Express)**: Hỗ trợ Serverless Functions
- ✅ **MongoDB**: Sử dụng MongoDB Atlas (cloud database)

**Kiến trúc:**
```
Frontend (Vercel) → Backend API (Vercel Serverless) → MongoDB Atlas
```

---

## Chuẩn Bị

### 1. Tài Khoản Cần Thiết

- [ ] Tài khoản [Vercel](https://vercel.com) (miễn phí)
- [ ] Tài khoản [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (miễn phí tier)
- [ ] Repository trên GitHub/GitLab/Bitbucket

### 2. Cài Đặt Vercel CLI (Optional)

```bash
npm install -g vercel
```

---

## Cấu Hình MongoDB Atlas

### 1. Tạo MongoDB Atlas Cluster

1. Đăng ký/Đăng nhập tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo **Free Cluster** (M0 - Free tier)
3. Chọn **Cloud Provider & Region** (gần Vercel servers)
4. Đặt tên cluster và click **Create**

### 2. Tạo Database User

1. Vào **Database Access** → **Add New Database User**
2. Chọn **Password** authentication
3. Tạo username và password mạnh
4. Chọn role: **Atlas admin** (hoặc custom role với readWrite)
5. Click **Add User**

**Lưu ý**: Lưu lại username và password!

### 3. Whitelist IP Addresses

1. Vào **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0) cho development
   - **Production**: Nên whitelist chỉ Vercel IPs (xem phần sau)
3. Click **Confirm**

### 4. Lấy Connection String

1. Vào **Database** → Click **Connect**
2. Chọn **Connect your application**
3. Copy **Connection String**
   - Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority`
4. Thay `<username>`, `<password>`, và `<dbname>` (ví dụ: `brewvibe`)

**Ví dụ:**
```
mongodb+srv://brewvibe_user:your-password@cluster0.xxxxx.mongodb.net/brewvibe?retryWrites=true&w=majority
```

---

## Cấu Hình Backend Cho Vercel

### 1. Tạo Vercel Configuration

Tạo file `vercel.json` ở **root** của project:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Cấu Hình Serverless Functions

Vercel yêu cầu backend phải được cấu hình như serverless functions. Có 2 cách:

#### Option A: Giữ nguyên Express App (Khuyến nghị)

Cập nhật `server/server.js` để tương thích với Vercel:

```javascript
// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brewvibe')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const commentRoutes = require('./routes/commentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Serve static files from uploads (nếu cần)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userAuthRoutes);
app.use('/api/v1/statistics', statisticsRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('BrewVibe API is running');
});

// Export cho Vercel
module.exports = app;

// Chỉ chạy server nếu không phải Vercel environment
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
```

#### Option B: Tạo API Routes riêng (Nếu cần tối ưu)

Tạo thư mục `api/` ở root và chuyển routes thành serverless functions.

### 3. Cập Nhật Client API URL

Cập nhật `client/src/services/api.js`:

```javascript
// Detect environment
const isProduction = import.meta.env.PROD;
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

// API URL
const API_URL = isProduction || isVercel
  ? '/api/v1'  // Relative path - Vercel sẽ route đến backend
  : 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
});
```

Hoặc sử dụng environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1');
```

### 4. Cập Nhật Build Script

Cập nhật `client/package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm run build"
  }
}
```

---

## Deploy Frontend

### Cách 1: Deploy Qua Vercel Dashboard (Khuyến nghị)

1. **Đăng nhập Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Đăng nhập bằng GitHub/GitLab/Bitbucket

2. **Import Project**
   - Click **Add New Project**
   - Chọn repository của bạn
   - Click **Import**

3. **Cấu Hình Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (hoặc để trống nếu cấu hình trong vercel.json)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables** (xem phần sau)

5. **Deploy**
   - Click **Deploy**
   - Chờ build và deploy hoàn tất

### Cách 2: Deploy Qua Vercel CLI

```bash
# Login
vercel login

# Deploy
cd client
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (chọn account)
# - Link to existing project? No
# - Project name? brewvibe (hoặc tên bạn muốn)
# - Directory? ./
# - Override settings? No

# Production deploy
vercel --prod
```

---

## Cấu Hình Environment Variables

### 1. Trong Vercel Dashboard

1. Vào project → **Settings** → **Environment Variables**
2. Thêm các biến sau:

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Production, Preview, Development |
| `JWT_SECRET` | `your-secret-key` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `CORS_ORIGIN` | `https://your-domain.vercel.app` | Production |
| `PORT` | `5000` | (Optional, Vercel tự động) |

### 2. Tạo JWT Secret

```bash
# Trên máy local
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy output và dán vào `JWT_SECRET`.

### 3. Client Environment Variables

Nếu cần, thêm vào Vercel:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `/api/v1` |

**Lưu ý**: Vercel chỉ expose các biến bắt đầu với `VITE_` cho client.

---

## Cấu Hình Upload Files

Vercel Serverless Functions có giới hạn về file system. Có 2 options:

### Option A: Sử dụng Cloud Storage (Khuyến nghị)

- **Cloudinary** (miễn phí tier)
- **AWS S3**
- **Google Cloud Storage**

### Option B: Tạm thời disable upload (cho development)

Comment out upload routes hoặc sử dụng URL images thay vì upload.

---

## Kiểm Tra và Testing

### 1. Kiểm Tra Deployment

1. Vào Vercel Dashboard → **Deployments**
2. Click vào deployment mới nhất
3. Kiểm tra:
   - Build logs có lỗi không
   - Environment variables đã được set chưa
   - Domain đã được assign chưa

### 2. Test API Endpoints

```bash
# Test API
curl https://your-project.vercel.app/api/v1/recipes

# Test frontend
# Mở browser: https://your-project.vercel.app
```

### 3. Tạo Admin User

Sau khi deploy, tạo admin user:

```bash
# Option 1: Tạo script và chạy local (connect đến MongoDB Atlas)
cd server
node seedAdmin.js

# Option 2: Tạo qua MongoDB Atlas shell
# Vào MongoDB Atlas → Database → Browse Collections
# Tạo collection "users" và insert document
```

---

## Custom Domain (Optional)

### 1. Thêm Domain

1. Vào **Settings** → **Domains**
2. Thêm domain của bạn
3. Follow instructions để cấu hình DNS

### 2. Cập Nhật CORS

Cập nhật `CORS_ORIGIN` environment variable với domain mới.

### 3. Cập Nhật MongoDB Atlas Whitelist

Thêm domain/IP của Vercel vào MongoDB Atlas Network Access.

---

## Troubleshooting

### 1. Build Failed

**Lỗi**: Build timeout hoặc memory limit

**Giải pháp**:
- Tối ưu build process
- Giảm dependencies không cần thiết
- Tăng build timeout trong `vercel.json`:

```json
{
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

### 2. API Routes Not Working

**Lỗi**: 404 khi gọi API

**Giải pháp**:
- Kiểm tra `vercel.json` routes configuration
- Đảm bảo backend được export đúng cách
- Kiểm tra logs trong Vercel Dashboard

### 3. MongoDB Connection Error

**Lỗi**: Cannot connect to MongoDB

**Giải pháp**:
- Kiểm tra `MONGODB_URI` environment variable
- Kiểm tra MongoDB Atlas whitelist (cho phép 0.0.0.0/0)
- Kiểm tra username/password trong connection string

### 4. CORS Error

**Lỗi**: CORS policy blocked

**Giải pháp**:
- Cập nhật `CORS_ORIGIN` với domain chính xác
- Kiểm tra backend CORS configuration

### 5. Environment Variables Not Working

**Lỗi**: Variables không được load

**Giải pháp**:
- Đảm bảo variables được set cho đúng environment (Production/Preview/Development)
- Redeploy sau khi thêm variables mới
- Client variables phải bắt đầu với `VITE_`

---

## Best Practices

### 1. Security

- ✅ Sử dụng MongoDB Atlas với authentication
- ✅ JWT secret mạnh và unique
- ✅ Không commit `.env` files
- ✅ Whitelist IPs trong MongoDB Atlas (production)
- ✅ Sử dụng HTTPS (Vercel tự động)

### 2. Performance

- ✅ Enable caching cho static assets
- ✅ Optimize images
- ✅ Use CDN (Vercel tự động)
- ✅ Monitor function execution time

### 3. Monitoring

- ✅ Sử dụng Vercel Analytics (nếu có)
- ✅ Monitor MongoDB Atlas metrics
- ✅ Check Vercel function logs
- ✅ Set up alerts

---

## Quick Deploy Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted (0.0.0.0/0 cho dev)
- [ ] Connection string copied
- [ ] `vercel.json` created
- [ ] Backend configured for Vercel
- [ ] Client API URL updated
- [ ] Environment variables set in Vercel
- [ ] Project deployed
- [ ] Admin user created
- [ ] Tested API endpoints
- [ ] Tested frontend
- [ ] Custom domain configured (optional)

---

## Useful Commands

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel remove

# Link local project to Vercel
vercel link
```

---

## Cost Estimation

### Vercel Free Tier:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless Functions: 100GB-hours/month
- ✅ Sufficient cho small-medium projects

### MongoDB Atlas Free Tier (M0):
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Sufficient cho development và small production

**Upgrade khi cần:**
- Vercel Pro: $20/month
- MongoDB Atlas M10: ~$57/month

---

## Kết Luận

Sau khi hoàn thành các bước trên, dự án của bạn sẽ được deploy trên Vercel với:
- ✅ Frontend React được serve qua CDN
- ✅ Backend API chạy trên Serverless Functions
- ✅ Database trên MongoDB Atlas cloud
- ✅ HTTPS tự động
- ✅ Auto-deploy từ Git

Nếu gặp vấn đề, tham khảo phần Troubleshooting hoặc [Vercel Documentation](https://vercel.com/docs).


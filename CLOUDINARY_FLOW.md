# ☁️ Cloudinary Upload Flow - Complete Guide

## 📋 Flow Hoàn Chỉnh

### **1. Upload Hình Ảnh (Admin tạo/cập nhật recipe)**

```
User chọn images
    │
    ▼
[ImageUpload Component]
    │
    │ 1. User chọn file(s)
    │ 2. Tạo FormData
    │ 3. POST /api/v1/upload/multiple
    │
    ▼
[Backend: uploadController.js]
    │
    │ 1. Check Cloudinary configured?
    │ 2. If yes → Upload to Cloudinary
    │ 3. If no → Fallback to local storage
    │
    ▼
[Response: URLs]
    │
    │ Cloudinary: "https://res.cloudinary.com/..."
    │ Local: "/uploads/filename.jpg"
    │
    ▼
[ImageUpload Component]
    │
    │ 1. Store URLs in previewUrls state
    │ 2. Call onChange() với URLs (joined by '\n')
    │
    ▼
[AdminPage Component]
    │
    │ 1. formData.images = URLs string
    │ 2. User fills other fields
    │ 3. Submit form
    │
    ▼
[POST /api/v1/recipes]
    │
    │ Body: {
    │   ...recipe data,
    │   images: ["https://res.cloudinary.com/...", ...]
    │ }
    │
    ▼
[Backend: recipeController.js]
    │
    │ 1. Validate data
    │ 2. Save to MongoDB
    │ 3. Images URLs stored in database
    │
    ▼
[MongoDB]
    │
    │ Recipe document:
    │ {
    │   images: ["https://res.cloudinary.com/...", ...]
    │ }
```

### **2. Hiển Thị Hình Ảnh (User xem recipes)**

```
User visits recipe page
    │
    ▼
[GET /api/v1/recipes/:id]
    │
    ▼
[MongoDB]
    │
    │ Return recipe with images URLs
    │
    ▼
[Frontend: RecipeDetailPage]
    │
    │ 1. Get recipe from API
    │ 2. Extract images array
    │ 3. Pass to ImageGallery component
    │
    ▼
[ImageGallery Component]
    │
    │ 1. Display images from URLs
    │ 2. URLs can be:
    │    - Cloudinary: "https://res.cloudinary.com/..."
    │    - Local: "http://localhost:5000/uploads/..."
    │ 3. Both work seamlessly
```

## ✅ Đảm Bảo Flow Hoạt Động

### **Backend:**
- ✅ UploadController đã xử lý Cloudinary
- ✅ RecipeController lưu images array vào database
- ✅ Fallback về local storage nếu Cloudinary không available

### **Frontend:**
- ✅ ImageUpload component upload và trả về URLs
- ✅ AdminPage lưu URLs vào formData
- ✅ RecipeCard, RecipeDetailPage, ImageGallery hiển thị từ database

## 🔍 Kiểm Tra

1. **Upload hoạt động:**
   - Upload image → Check response URL
   - Cloudinary: `https://res.cloudinary.com/...`
   - Local: `/uploads/...`

2. **Lưu vào database:**
   - Create recipe → Check MongoDB
   - Images array có URLs đúng

3. **Hiển thị:**
   - View recipe → Images hiển thị đúng
   - URLs từ database được dùng trực tiếp


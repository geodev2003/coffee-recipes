# ☁️ Cloudinary Setup Guide

## Tổng Quan

Dự án đã được cấu hình để upload hình ảnh lên **Cloudinary** thay vì lưu local. Cloudinary cung cấp:
- ✅ CDN tự động (hình ảnh load nhanh hơn)
- ✅ Image optimization tự động
- ✅ Transformations (resize, crop, format conversion)
- ✅ Free tier tốt (25GB storage, 25GB bandwidth/month)

## 📋 Bước 1: Tạo Cloudinary Account

1. Truy cập: https://cloudinary.com/users/register/free
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

## 📋 Bước 2: Lấy Credentials

Sau khi đăng nhập vào Cloudinary Dashboard:

1. Vào **Dashboard** → **Settings** (biểu tượng bánh răng)
2. Copy các thông tin sau:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 📋 Bước 3: Cấu Hình Environment Variables

Thêm vào file `server/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Ví dụ:**
```env
CLOUDINARY_CLOUD_NAME=my-coffee-app
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## 📋 Bước 4: Cài Đặt Dependencies

```bash
cd server
npm install cloudinary
```

## 📋 Bước 5: Test Upload

1. Start server:
```bash
cd server
npm run dev
```

2. Start client:
```bash
cd client
npm run dev
```

3. Đăng nhập vào Admin Dashboard
4. Tạo recipe mới và upload hình ảnh
5. Kiểm tra Cloudinary Dashboard → **Media Library** để xem hình ảnh đã upload

## 🔧 Cấu Hình Nâng Cao

### Thay Đổi Folder Name

Trong `server/controllers/uploadController.js`:

```javascript
const result = await uploadToCloudinary(req.file.buffer, 'your-folder-name');
```

### Image Transformations

Cloudinary tự động optimize images. Bạn có thể thêm transformations:

```javascript
transformation: [
    { width: 800, height: 600, crop: 'limit' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
]
```

### Xóa Hình Ảnh

API endpoint để xóa hình ảnh:

```javascript
DELETE /api/v1/upload
Body: { public_id: "coffee-recipes/image-name" }
```

## 📝 Lưu Ý

1. **Free Tier Limits:**
   - 25GB storage
   - 25GB bandwidth/month
   - 25,000 transformations/month

2. **Security:**
   - Không commit `.env` file
   - API Secret phải được bảo mật
   - Sử dụng signed URLs cho sensitive images (nếu cần)

3. **Backup:**
   - Cloudinary tự động backup
   - Có thể export images nếu cần

## 🐛 Troubleshooting

### Lỗi: "Invalid API Key"
- Kiểm tra lại API Key và API Secret trong `.env`
- Đảm bảo không có khoảng trắng thừa

### Lỗi: "Upload failed"
- Kiểm tra kết nối internet
- Kiểm tra file size (max 5MB)
- Kiểm tra file format (chỉ JPEG, PNG, GIF, WebP)

### Hình ảnh không hiển thị
- Kiểm tra URL trong response
- URL phải là `https://res.cloudinary.com/...`
- Kiểm tra CORS settings (nếu cần)

## 📚 Tài Liệu Tham Khảo

- Cloudinary Documentation: https://cloudinary.com/documentation
- Node.js SDK: https://cloudinary.com/documentation/node_integration
- Image Transformations: https://cloudinary.com/documentation/image_transformations

## ✅ Checklist

- [ ] Đã tạo Cloudinary account
- [ ] Đã lấy Cloud Name, API Key, API Secret
- [ ] Đã thêm vào `server/.env`
- [ ] Đã cài đặt `cloudinary` package
- [ ] Đã test upload thành công
- [ ] Hình ảnh hiển thị đúng trên website


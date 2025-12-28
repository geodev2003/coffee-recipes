# 🔧 Cloudinary Troubleshooting Guide

## Lỗi 502 khi Upload Hình Ảnh

### Nguyên Nhân Có Thể:

1. **Cloudinary chưa được cấu hình**
   - Thiếu environment variables
   - Server không có credentials

2. **Lỗi khi upload lên Cloudinary**
   - Network issues
   - Invalid credentials
   - API limits exceeded

3. **Server crash**
   - Unhandled errors
   - Memory issues

## ✅ Giải Pháp

### 1. Kiểm Tra Cloudinary Configuration

**Kiểm tra `server/.env`:**
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Kiểm tra server logs khi start:**
- ✅ Nếu thấy: `✅ Cloudinary configured successfully` → OK
- ⚠️ Nếu thấy: `⚠️ Cloudinary not configured. Using local storage fallback.` → Sử dụng local storage

### 2. Fallback Mechanism

Code đã được cập nhật để tự động fallback về local storage nếu:
- Cloudinary chưa được cấu hình
- Cloudinary upload fails

**Behavior:**
- Nếu Cloudinary available → Upload lên Cloudinary
- Nếu Cloudinary fails → Tự động fallback về local storage
- URLs sẽ là:
  - Cloudinary: `https://res.cloudinary.com/...`
  - Local: `http://localhost:5000/uploads/...` hoặc `https://your-domain.com/uploads/...`

### 3. Kiểm Tra Server Logs

Khi upload, check server console:
```
✅ Cloudinary configured successfully
Upload error: [error details]
Falling back to local storage...
```

### 4. Test Upload

**Test với Cloudinary:**
1. Đảm bảo `.env` có đầy đủ credentials
2. Restart server
3. Upload image
4. Check response URL:
   - Cloudinary: `https://res.cloudinary.com/...`
   - Local: `/uploads/...`

**Test với Local Storage (fallback):**
1. Xóa hoặc comment Cloudinary credentials trong `.env`
2. Restart server
3. Upload image
4. Should work với local storage

## 🐛 Common Issues

### Issue 1: URLs vẫn là `/uploads/` thay vì Cloudinary

**Nguyên nhân:**
- Cloudinary chưa được cấu hình
- Hoặc Cloudinary upload failed và fallback về local

**Giải pháp:**
1. Check `.env` file có đầy đủ credentials
2. Check server logs khi start
3. Check server logs khi upload

### Issue 2: Lỗi 502 Bad Gateway

**Nguyên nhân:**
- Server crash khi xử lý upload
- Cloudinary API error không được handle

**Giải pháp:**
- Code đã được cập nhật với error handling tốt hơn
- Fallback mechanism sẽ tự động chuyển sang local storage

### Issue 3: Hình ảnh không hiển thị

**Nguyên nhân:**
- URL không đúng format
- CORS issues
- File không tồn tại

**Giải pháp:**
1. Check URL format:
   - Cloudinary: `https://res.cloudinary.com/...`
   - Local: `http://localhost:5000/uploads/...` (dev) hoặc `https://domain.com/uploads/...` (prod)
2. Check CORS settings
3. Check file exists trong uploads folder (nếu local)

## 📝 Checklist Debug

- [ ] Cloudinary credentials trong `.env`?
- [ ] Server logs show "Cloudinary configured"?
- [ ] Test upload và check response?
- [ ] Check server logs khi upload?
- [ ] URLs đúng format?
- [ ] Images hiển thị trong browser?

## 🔄 Migration từ Local sang Cloudinary

Nếu bạn đã có images trong local storage và muốn migrate:

1. **Option 1: Manual Upload**
   - Upload lại images qua Admin Dashboard
   - Old URLs sẽ được thay thế

2. **Option 2: Script Migration**
   - Tạo script để upload existing images lên Cloudinary
   - Update database với new URLs

## 💡 Best Practices

1. **Always use Cloudinary in production**
   - Better performance
   - CDN support
   - Image optimization

2. **Local storage for development**
   - Faster development
   - No need for Cloudinary account

3. **Environment-based configuration**
   - Production: Cloudinary
   - Development: Local (optional)

## 🚀 Quick Fix

Nếu gặp lỗi 502 ngay bây giờ:

1. **Temporary fix (use local storage):**
   - Comment hoặc xóa Cloudinary credentials trong `.env`
   - Restart server
   - Upload sẽ dùng local storage

2. **Permanent fix (configure Cloudinary):**
   - Setup Cloudinary account
   - Add credentials to `.env`
   - Restart server
   - Upload sẽ dùng Cloudinary


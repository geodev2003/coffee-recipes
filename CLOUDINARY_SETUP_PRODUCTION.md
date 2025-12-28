# ☁️ Setup Cloudinary trên Production

## 🔍 Vấn Đề Hiện Tại

URLs vẫn là local từ Vercel:
```
https://coffee-recipes-taupe.vercel.app/uploads/...
```

Thay vì Cloudinary URLs:
```
https://res.cloudinary.com/cloud-name/image/upload/...
```

## ✅ Giải Pháp

### **Bước 1: Kiểm Tra Server Logs**

Khi upload, check server logs (Railway Dashboard):
```
Upload attempt - Cloudinary configured: false
⚠️ Cloudinary not configured or not available. Using local storage.
   Missing environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
```

Nếu thấy message này → Cloudinary chưa được cấu hình.

### **Bước 2: Setup Cloudinary Account**

1. **Tạo account:**
   - Truy cập: https://cloudinary.com/users/register/free
   - Đăng ký tài khoản miễn phí
   - Xác nhận email

2. **Lấy credentials:**
   - Vào Dashboard → Settings (biểu tượng bánh răng)
   - Copy:
     - **Cloud Name**
     - **API Key**
     - **API Secret**

### **Bước 3: Cấu Hình trên Railway**

1. **Vào Railway Dashboard:**
   - Chọn project → Settings → Variables

2. **Thêm Environment Variables:**
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Redeploy:**
   - Railway sẽ tự động rebuild với environment variables mới

### **Bước 4: Verify**

1. **Check server logs khi start:**
   ```
   ✅ Cloudinary configured successfully
   ```

2. **Test upload:**
   - Upload image trong Admin Dashboard
   - Check server logs:
     ```
     Upload attempt - Cloudinary configured: true
     Attempting to upload to Cloudinary...
     ✅ Successfully uploaded to Cloudinary: https://res.cloudinary.com/...
     ```

3. **Check response:**
   - Response URL phải là: `https://res.cloudinary.com/...`
   - Không phải: `/uploads/...`

## 🐛 Troubleshooting

### **Vấn đề 1: Vẫn trả về local URLs**

**Nguyên nhân:**
- Cloudinary chưa được cấu hình
- Environment variables chưa được set
- Package chưa được cài đặt

**Giải pháp:**
1. Check Railway environment variables
2. Check server logs khi start
3. Rebuild server

### **Vấn đề 2: Cloudinary upload fails**

**Nguyên nhân:**
- Invalid credentials
- Network issues
- API limits

**Giải pháp:**
1. Verify credentials trong Railway
2. Check Cloudinary dashboard
3. Check server logs for error details

### **Vấn đề 3: URLs vẫn từ Vercel domain**

**Nguyên nhân:**
- Frontend đang construct URL từ relative path
- Upload đang được serve từ Vercel static files

**Giải pháp:**
- Đảm bảo upload requests được gửi đến Railway server
- Check `vercel.json` routing
- Check API base URL trong frontend

## 📝 Checklist

- [ ] Cloudinary account created
- [ ] Credentials copied
- [ ] Environment variables added to Railway
- [ ] Server rebuilt/redeployed
- [ ] Server logs show "Cloudinary configured successfully"
- [ ] Upload test returns Cloudinary URLs
- [ ] Images display correctly from Cloudinary

## 🎯 Kết Quả Mong Đợi

Sau khi setup đúng:
- Upload → Cloudinary URLs: `https://res.cloudinary.com/...`
- Database → Cloudinary URLs stored
- Display → Images load từ Cloudinary CDN
- Performance → Faster loading, auto optimization


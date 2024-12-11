<h1 align="center">
  <br>
  <a href="https://github.com/MinDuck404/eShop"><img src="https://github.com/MinDuck404/eShop/blob/main/logo-Photoroom.png?raw=true" alt="eShop" width="200"></a>
  <br>
  eShop
  <br>
</h1>

<h4 align="center">Một ứng dụng thương mại điện tử full-stack được xây dựng bằng MERN stack.</h4>


<p align="center">
  <a href="#key-features">Tính Năng Nổi Bật</a> •
  <a href="#how-to-use">Hướng Dẫn Sử Dụng</a> •
  <a href="#demo">Demo</a> •
  <a href="#credits">Tín Dụng</a> •
  <a href="#license">Giấy Phép</a>
</p>




## NGHIÊN CỨU VÀ XÂY DỰNG WEBSITE THƯƠNG MẠI ĐIỆN TỬ BÁN ĐỒ CÔNG NGHỆ SỬ DỤNG NODEJS

### Giới thiệu
<a id="key-features"><a/>
🎯 **Mục tiêu dự án**

Xây dựng một website thương mại điện tử chuyên bán đồ công nghệ, mang đến trải nghiệm mua sắm trực tuyến nhanh chóng, tiện lợi và bảo mật. Dự án được phát triển sử dụng Node.js làm nền tảng chính, tích hợp các công nghệ hiện đại để đảm bảo hiệu suất và tính ổn định.

🌟 **Tính năng nổi bật**

- Đăng ký, đăng nhập và quản lý thông tin cá nhân.
- Giỏ hàng, danh sách yêu thích, và quản lý đơn hàng.
- Hệ thống quản lý sản phẩm, danh mục và banner dễ dàng.
- Tìm kiếm, lọc sản phẩm, và hiển thị đánh giá từ khách hàng.
- Triển khai full-stack với React (frontend), Node.js & Express (backend), và MongoDB (database).
- Xác thực người dùng sử dụng JWT.
- Dashboard quản trị để quản lý người dùng và đơn hàng.
- Thiết kế responsive và tương thích đa nền tảng.

📢 **Nhóm thực hiện**

Nhóm 05 - Khoa Công Nghệ Thông Tin  
Học viện Hàng không Việt Nam  

#FITVAA
<a id="how-to-use">
## Hướng Dẫn Sử Dụng

Để sao chép và chạy ứng dụng này, bạn cần cài đặt [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (đi kèm [npm](http://npmjs.com)), và [MongoDB](https://www.mongodb.com/) trên máy tính của bạn. Từ dòng lệnh:

```bash
# Sao chép repository này
$ git clone https://github.com/MinDuck404/eShop

# Đi vào thư mục repository
$ cd eShop

# Cài đặt dependencies cho backend
$ cd server
$ npm install --legacy-peer-deps

# Cài đặt dependencies cho frontend
$ cd ../client
$ npm install --legacy-peer-deps

# Cài đặt dependencies cho admin
$ cd ../admin
$ npm install --legacy-peer-deps

# Tạo file biến môi trường
$ touch .env
```

Thêm các biến sau vào file `.env` trong thư mục `server`:

```
PORT=8000
CLIENT_BASE_URL=
EMAIL=
EMAIL_PASS=
CONNECTION_STRING=
cloudinary_Config_Cloud_Name=
cloudinary_Config_api_key=
cloudinary_Config_api_secret=
JSON_WEB_TOKEN_SECRET_KEY=
```

Thêm các biến sau vào file `.env` trong thư mục `client`:

```
REACT_APP_API_URL=

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
```

Sau đó, chạy ứng dụng:

```bash
# Chạy backend
$ cd server
$ npm start

# Chạy frontend
$ cd ../client
$ npm start

# Chạy admin panel
$ cd ../admin
$ npm start
```

> **Lưu ý**
> Đảm bảo rằng MongoDB đang chạy cục bộ hoặc cung cấp một connection string hợp lệ.
<a id="demo">
## Demo

Bạn có thể [xem trực tiếp tại đây](https://doancn05.name.vn/) phiên bản mới nhất của eShop đã triển khai.
<a id="credits"><a/>
## Tín Dụng

Ứng dụng này sử dụng các gói nguồn mở sau:

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/)
- [Bootstrap](https://getbootstrap.com/)


 <a id="#icense">Giấy Phép</a>
MIT

---

> [MinDuck404 GitHub](https://github.com/MinDuck404) &nbsp;&middot;&nbsp;
> [Winters2833 GitHub](https://github.com/Winters2833) &nbsp;&middot;&nbsp;
> [Huynhduc25117 GitHub](https://github.com/Huynhduc25117) &nbsp;&middot;&nbsp;


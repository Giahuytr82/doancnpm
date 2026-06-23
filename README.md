# 🏮 Hệ Thống Đặt Bàn Nhà Hàng Nhật Bản Miyabi (Miyabi Restaurant Reservation)

Chào mừng bạn đến với dự án **Hệ thống Đặt bàn Nhà hàng Nhật Bản Cao cấp Miyabi**. Đây là đồ án môn học Công nghệ phần mềm được phát triển dựa trên nền tảng **ASP.NET Core MVC (.NET 8)** và cơ sở dữ liệu **MySQL**.

---

## 🌟 Tính Năng Nổi Bật (Key Features)

### 👤 Dành cho Khách Hàng (Customer Page)
- **Đăng ký & Đăng nhập**: Quản lý tài khoản cá nhân an toàn.
- **Sơ đồ bàn tương tác thời gian thực**:
  - Tự động hiển thị danh sách các bàn trống/đã đặt dựa theo ngày và khung giờ được chọn.
  - Sơ đồ trực quan phân chia rõ ràng các khu vực: **Quầy Sushi Gỗ Hinoki (Omakase Bar)**, **Phòng VIP Tatami** (Nhỏ/Lớn), và **Sảnh Ăn Chung Hồ Koi**.
- **Quản lý đặt bàn cá nhân**: Cho phép xem lịch sử đặt bàn và tự hủy yêu cầu đặt bàn (chỉ áp dụng cho các lịch hẹn ở trạng thái *Đang xử lý*).
- **Gửi phản hồi**: Đánh giá số sao và bình luận trực tiếp bên ngoài trang chủ.

### 👑 Dành cho Quản Trị Viên (Admin Dashboard)
- **Bảng số liệu thống kê trực quan**:
  - Số lượt đặt bàn trong ngày.
  - Điểm đánh giá trung bình từ thực khách.
  - Biểu đồ tiến trình (Progress Bar) tỷ lệ khu vực được yêu thích nhất.
- **Quản lý đặt bàn**: Duyệt đặt bàn (Xác nhận/Hủy), lọc danh sách theo khu vực ẩm thực, và xóa lịch đặt bàn.
- **Quản lý phản hồi**: Kiểm duyệt hiển thị phản hồi của khách hàng ra trang chủ hoặc xóa phản hồi không hợp lệ.
- **Quản lý thực đơn (CRUD Món ăn)**: Thêm/Sửa/Xóa món ăn với chức năng tải ảnh trực tiếp từ máy tính lên máy chủ cục bộ.
- **Quản lý người dùng & Theo dõi lỗi (Bug Tracking)**: Xem danh sách thành viên và ghi nhận lỗi hệ thống phục vụ giai đoạn kiểm thử.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Backend Framework**: .NET 8.0 (ASP.NET Core MVC)
- **ORM / Database Access**: Entity Framework Core
- **Database System**: MySQL (Phiên bản 8.0 trở lên)
- **Frontend**: HTML5, Vanilla CSS (Dark Gold Luxury Theme), Javascript (Fetch API)
- **Version Control**: Git & GitHub

---

## 🚀 Hướng Dẫn Cài Đặt Và Khởi Chạy (Installation & Setup)

### 1. Yêu Cầu Hệ Thống (Prerequisites)
- Đã cài đặt **.NET 8.0 SDK** (kiểm tra bằng lệnh `dotnet --version`).
- Đã cài đặt **MySQL Server** và **MySQL Workbench**.
- Trình soạn thảo mã nguồn **Visual Studio 2022** hoặc **VS Code**.

### 2. Các Bước Cài Đặt

**Bước 1: Tải mã nguồn về máy**
```bash
git clone https://github.com/Giahuytr82/doancnpm.git
cd doancnpm
```

**Bước 2: Cấu hình kết nối cơ sở dữ liệu**
Mở tệp `Web/appsettings.json` và cập nhật thông tin tài khoản MySQL của bạn:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=3306;Database=quanly;Uid=root;Pwd=MAT_KHAU_MYSQL_CUA_BAN;"
}
```

**Bước 3: Khởi tạo database và bảng dữ liệu**
Mở terminal tại thư mục `Web/` và chạy lệnh cập nhật database:
```bash
dotnet ef database update
```

**Bước 4: Khởi chạy ứng dụng**
```bash
dotnet run
```
Sau đó, mở trình duyệt và truy cập vào địa chỉ hiển thị trên terminal (ví dụ: `https://localhost:7198`).

---

## 🔑 Tài Khoản Trải Nghiệm Mặc Định

- **Tài khoản Admin (Quản trị):**
  - **Email:** `admin123@gmail.com`
  - **Mật khẩu:** `123456`
- **Tài khoản User (Khách hàng):** Bạn có thể đăng ký tài khoản mới trực tiếp trên giao diện của website để trải nghiệm tính năng đặt bàn và xem lịch sử đặt bàn cá nhân.
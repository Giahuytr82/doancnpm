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

### 1. Chuẩn Bị Môi Trường (Prerequisites)
Bạn cần chuẩn bị các công cụ phát triển sau:
- **Visual Studio 2022 & .NET 8.0 SDK (Khuyên dùng)**:
  1. Tải [Visual Studio Community 2022](https://visualstudio.microsoft.com/downloads/) (miễn phí).
  2. Mở **Visual Studio Installer** trên máy tính.
  3. Chọn **Modify** (Chỉnh sửa) phiên bản VS 2022 của bạn.
  4. Tại tab **Workloads**, tích chọn gói **ASP.NET and web development** (Phát triển ứng dụng Web và ASP.NET). Gói này tự động cài đặt kèm .NET 8.0 SDK và Runtime.
  5. Nhấn **Modify** để bắt đầu tải về và cài đặt.
- **MySQL Server & MySQL Workbench**:
  1. Tải [MySQL Installer](https://dev.mysql.com/downloads/installer/).
  2. Cài đặt bản Community Server và thiết lập mật khẩu tài khoản `root` (Mật khẩu mặc định kết nối của dự án là `123456`).
  3. Đảm bảo service `MySQL80` đang chạy.

> *Lưu ý: Nếu phát triển bằng **VS Code** thay vì Visual Studio, bạn hãy tải và cài đặt độc lập tệp cài đặt tại [Trang chủ Microsoft .NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0).*

### 2. Các Bước Khởi Chạy Dự Án

**Bước 1: Tải mã nguồn về máy**
```bash
git clone https://github.com/Giahuytr82/doancnpm.git
cd doancnpm
```

**Bước 2: Cấu hình kết nối cơ sở dữ liệu**
Mở tệp `Web/appsettings.json` và cập nhật thông tin tài khoản MySQL của bạn nếu mật khẩu của bạn khác với `123456`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=3306;Database=quanly;Uid=root;Pwd=MAT_KHAU_MYSQL_CUA_BAN;"
}
```

**Bước 3: Khởi tạo database và bảng dữ liệu**
Mở cửa sổ Terminal tại thư mục `Web/` và chạy lệnh cập nhật database:
```bash
dotnet ef database update
```
*(Hoặc dùng công cụ Package Manager Console trong Visual Studio và gõ lệnh `Update-Database`).*

**Bước 4: Khởi chạy ứng dụng**
Chạy ứng dụng bằng cách nhấn phím **F5** trong Visual Studio, hoặc mở terminal tại thư mục `Web/` và gõ:
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
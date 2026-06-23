using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Web.Models;
using Web.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var reviews = await _context.Reviews.Where(r => r.IsVisible).OrderByDescending(r => r.CreatedAt).Take(5).ToListAsync();
            var dishes = await _context.Dishes.ToListAsync();
            ViewBag.Reviews = reviews;
            ViewBag.Dishes = dishes;
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Password == password);
            if (user != null)
            {
                // --- ANTIGRAVITY EDIT: Đặc cách Admin cho email admin123@gmail.com ---
                string userRole = user.Role;
                if (user.Email.Equals("admin123@gmail.com", StringComparison.OrdinalIgnoreCase))
                {
                    userRole = "Admin";
                }
                // -------------------------------------------------------------------

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, userRole), // Dùng ClaimTypes.Role chuẩn
                    new Claim("UserRole", userRole),      // Thêm claim phụ để chắc chắn
                    new Claim("UserId", user.Id.ToString())
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);

                if (userRole.Equals("Admin", StringComparison.OrdinalIgnoreCase))
                {
                    return RedirectToAction("AdminDashboard");
                }
                return RedirectToAction("Index");
            }

            ViewBag.Error = "Email hoặc mật khẩu không đúng.";
            return View();
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(User user)
        {
            if (ModelState.IsValid)
            {
                var existingUser = await _context.Users.AnyAsync(u => u.Email == user.Email);
                if (existingUser)
                {
                    ModelState.AddModelError("Email", "Email đã tồn tại.");
                    return View(user);
                }

                user.Role = "User";
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return RedirectToAction("Login");
            }
            return View(user);
        }

        [Authorize]
        public async Task<IActionResult> AdminDashboard()
        {
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type == "UserRole")?.Value;
            
            if (roleClaim != null && roleClaim.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                var users = await _context.Users.ToListAsync();
                var reservations = await _context.Reservations.OrderByDescending(r => r.CreatedAt).ToListAsync();
                var bugs = await _context.Bugs.OrderByDescending(b => b.CreatedAt).ToListAsync();
                var reviews = await _context.Reviews.OrderByDescending(r => r.CreatedAt).ToListAsync();
                var dishes = await _context.Dishes.ToListAsync();
                
                // --- ANTIGRAVITY EDIT: Tính toán các thông số thống kê cho Admin Dashboard ---
                var today = DateTime.Today;
                int todayBookingsCount = reservations.Count(r => r.BookingDate.Date == today);
                double avgRating = reviews.Any() ? Math.Round(reviews.Average(r => r.Rating), 1) : 0.0;
                
                int omakaseCount = reservations.Count(r => r.SeatingPreference == "Omakase Counter");
                int vipRoomCount = reservations.Count(r => r.SeatingPreference == "Private VIP Room" || r.SeatingPreference == "Small VIP Room" || r.SeatingPreference == "Large VIP Room");
                int mainDiningCount = reservations.Count(r => r.SeatingPreference == "Main Dining Room");
                
                ViewBag.Users = users;
                ViewBag.Reservations = reservations;
                ViewBag.Bugs = bugs;
                ViewBag.Reviews = reviews;
                ViewBag.Dishes = dishes;
                
                ViewBag.TodayBookingsCount = todayBookingsCount;
                ViewBag.AvgRating = avgRating;
                ViewBag.OmakaseCount = omakaseCount;
                ViewBag.VipRoomCount = vipRoomCount;
                ViewBag.MainDiningCount = mainDiningCount;
                // -----------------------------------------------------------------------------
                
                return View();
            }

            return RedirectToAction("AccessDenied");
        }

        [HttpGet]
        public async Task<IActionResult> GetOccupiedTables(string date, string time)
        {
            try
            {
                if (string.IsNullOrEmpty(date) || string.IsNullOrEmpty(time))
                {
                    return Json(new List<string>());
                }

                if (!DateTime.TryParse(date, out DateTime parsedDate))
                {
                    return Json(new List<string>());
                }

                var occupiedTables = await _context.Reservations
                    .Where(r => r.BookingDate.Date == parsedDate.Date 
                             && r.SelectedTime == time 
                             && r.Status != "Cancelled" 
                             && r.TableNumber != null 
                             && r.TableNumber != "")
                    .Select(r => r.TableNumber)
                    .ToListAsync();

                return Json(occupiedTables);
            }
            catch (Exception ex)
            {
                return Json(new List<string>());
            }
        }

        [HttpPost]
        public async Task<IActionResult> BookTable([FromBody] Reservation reservation)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Json(new { success = false, message = "Bạn cần đăng nhập để đặt bàn." });
            }

            if (reservation == null)
            {
                return Json(new { success = false, message = "Dữ liệu không hợp lệ." });
            }

            try
            {
                reservation.CreatedAt = DateTime.Now;
                reservation.Status = "Pending";
                
                // --- ANTIGRAVITY EDIT: Tự động gán UserId của tài khoản đã đăng nhập ---
                var userIdClaim = User.FindFirst("UserId")?.Value;
                if (int.TryParse(userIdClaim, out int parsedUserId))
                {
                    reservation.UserId = parsedUserId;
                }
                // --------------------------------------------------------------------
                
                // --- ANTIGRAVITY EDIT: Kiểm tra xem bàn đã bị ai khác đặt trước đó chưa ---
                if (!string.IsNullOrEmpty(reservation.TableNumber))
                {
                    var isOccupied = await _context.Reservations.AnyAsync(r => 
                        r.BookingDate.Date == reservation.BookingDate.Date 
                        && r.SelectedTime == reservation.SelectedTime 
                        && r.Status != "Cancelled" 
                        && r.TableNumber == reservation.TableNumber);
                    
                    if (isOccupied)
                    {
                        return Json(new { success = false, message = "Vị trí bàn/ghế này đã bị đặt bởi thực khách khác vào khung giờ này. Vui lòng chọn bàn/ghế khác." });
                    }
                }
                // --------------------------------------------------------------------
                
                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();
                
                return Json(new { success = true, message = "Đặt bàn thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateReservationStatus([FromBody] dynamic data)
        {
            try {
                int id = data.GetProperty("id").GetInt32();
                string status = data.GetProperty("status").GetString();
                
                var reservation = await _context.Reservations.FindAsync(id);
                if (reservation != null) {
                    reservation.Status = status;
                    await _context.SaveChangesAsync();
                    return Json(new { success = true });
                }
                return Json(new { success = false, message = "Không tìm thấy đặt bàn." });
            } catch {
                return Json(new { success = false, message = "Dữ liệu không hợp lệ." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteUser([FromBody] dynamic data)
        {
            try {
                int id = data.GetProperty("id").GetInt32();
                var user = await _context.Users.FindAsync(id);
                if (user != null) {
                    if (user.Email.Equals("admin123@gmail.com", StringComparison.OrdinalIgnoreCase)) {
                        return Json(new { success = false, message = "Không thể xóa tài khoản Admin chính." });
                    }
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                    return Json(new { success = true });
                }
                return Json(new { success = false, message = "Không tìm thấy người dùng." });
            } catch {
                return Json(new { success = false, message = "Dữ liệu không hợp lệ." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ReportBug([FromBody] Bug bug)
        {
            try {
                bug.CreatedAt = DateTime.Now;
                bug.ReportedBy = User.Identity.Name ?? "Anonymous";
                _context.Bugs.Add(bug);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            } catch {
                return Json(new { success = false, message = "Không thể ghi nhận lỗi." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateBugStatus([FromBody] dynamic data)
        {
            try {
                int id = data.GetProperty("id").GetInt32();
                string status = data.GetProperty("status").GetString();
                var bug = await _context.Bugs.FindAsync(id);
                if (bug != null) {
                    bug.Status = status;
                    await _context.SaveChangesAsync();
                    return Json(new { success = true });
                }
                return Json(new { success = false });
            } catch {
                return Json(new { success = false });
            }
        }

        [HttpGet]
        public async Task<IActionResult> HealthCheck()
        {
            try {
                // Kiểm tra kết nối database
                var canConnect = await _context.Database.CanConnectAsync();
                return Json(new { 
                    status = "Healthy", 
                    database = canConnect ? "Connected" : "Disconnected",
                    timestamp = DateTime.Now,
                    version = "1.0.0-Deployment"
                });
            } catch (Exception ex) {
                return Json(new { status = "Unhealthy", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SubmitReview([FromBody] Review review)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Json(new { success = false, message = "Bạn cần đăng nhập để gửi đánh giá." });
            }

            try {
                review.CreatedAt = DateTime.Now;
                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            } catch {
                return Json(new { success = false, message = "Không thể gửi đánh giá." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ToggleReviewVisibility([FromBody] dynamic data)
        {
            try {
                int id = data.GetProperty("id").GetInt32();
                var review = await _context.Reviews.FindAsync(id);
                if (review != null) {
                    review.IsVisible = !review.IsVisible;
                    await _context.SaveChangesAsync();
                    return Json(new { success = true });
                }
                return Json(new { success = false });
            } catch {
                return Json(new { success = false });
            }
        }

        // --- ANTIGRAVITY ADD: Action hiển thị danh sách đặt bàn cá nhân của người dùng ---
        [Authorize]
        public async Task<IActionResult> MyReservations()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                var reservations = await _context.Reservations
                    .Where(r => r.UserId == userId)
                    .OrderByDescending(r => r.CreatedAt)
                    .ToListAsync();
                return View(reservations);
            }
            return RedirectToAction("Login");
        }

        // --- ANTIGRAVITY ADD: API để người dùng tự hủy đặt bàn của mình ---
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CancelReservationByUser([FromBody] dynamic data)
        {
            try
            {
                int id = data.GetProperty("id").GetInt32();
                var userIdClaim = User.FindFirst("UserId")?.Value;
                if (!int.TryParse(userIdClaim, out int userId))
                {
                    return Json(new { success = false, message = "Bạn cần đăng nhập để thực hiện." });
                }

                var reservation = await _context.Reservations.FindAsync(id);
                if (reservation == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin đặt bàn." });
                }

                if (reservation.UserId != userId)
                {
                    return Json(new { success = false, message = "Bạn không có quyền hủy đặt bàn này." });
                }

                if (!reservation.Status.Equals("Pending", StringComparison.OrdinalIgnoreCase))
                {
                    return Json(new { success = false, message = "Chỉ có thể hủy đặt bàn ở trạng thái Đang xử lý." });
                }

                reservation.Status = "Cancelled";
                await _context.SaveChangesAsync();
                return Json(new { success = true, message = "Đã hủy đặt bàn thành công." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }
        // -----------------------------------------------------------------------------

        // --- ANTIGRAVITY ADD: Các hàm hỗ trợ kiểm tra Admin và các Action API CRUD cho món ăn ---
        private bool IsAdmin()
        {
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type == "UserRole")?.Value;
            return roleClaim != null && roleClaim.Equals("Admin", StringComparison.OrdinalIgnoreCase);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddDish([FromBody] Dish dish)
        {
            if (!IsAdmin()) return Json(new { success = false, message = "Bạn không có quyền thực hiện chức năng này." });
            if (dish == null) return Json(new { success = false, message = "Dữ liệu không hợp lệ." });
            
            try
            {
                _context.Dishes.Add(dish);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateDish([FromBody] Dish dish)
        {
            if (!IsAdmin()) return Json(new { success = false, message = "Bạn không có quyền thực hiện chức năng này." });
            if (dish == null) return Json(new { success = false, message = "Dữ liệu không hợp lệ." });
            
            try
            {
                var existing = await _context.Dishes.FindAsync(dish.Id);
                if (existing == null) return Json(new { success = false, message = "Không tìm thấy món ăn." });

                existing.Name = dish.Name;
                existing.Price = dish.Price;
                existing.Description = dish.Description;
                existing.Badge = dish.Badge;
                existing.Rating = dish.Rating;
                existing.ImageUrl = dish.ImageUrl;

                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteDish([FromBody] dynamic data)
        {
            if (!IsAdmin()) return Json(new { success = false, message = "Bạn không có quyền thực hiện chức năng này." });
            try
            {
                int id = data.GetProperty("id").GetInt32();
                var dish = await _context.Dishes.FindAsync(id);
                if (dish != null)
                {
                    _context.Dishes.Remove(dish);
                    await _context.SaveChangesAsync();
                    return Json(new { success = true });
                }
                return Json(new { success = false, message = "Không tìm thấy món ăn." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // --- ANTIGRAVITY ADD: Admin API xóa đặt bàn ---
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteReservation([FromBody] dynamic data)
        {
            if (!IsAdmin()) return Json(new { success = false, message = "Bạn không có quyền thực hiện chức năng này." });
            try
            {
                int id = data.GetProperty("id").GetInt32();
                var reservation = await _context.Reservations.FindAsync(id);
                if (reservation != null)
                {
                    _context.Reservations.Remove(reservation);
                    await _context.SaveChangesAsync();
                    return Json(new { success = true });
                }
                return Json(new { success = false, message = "Không tìm thấy đặt bàn." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // --- ANTIGRAVITY ADD: Admin API xóa phản hồi/đánh giá ---
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteReview([FromBody] dynamic data)
        {
            if (!IsAdmin()) return Json(new { success = false, message = "Bạn không có quyền thực hiện chức năng này." });
            try
            {
                int id = data.GetProperty("id").GetInt32();
                var review = await _context.Reviews.FindAsync(id);
                if (review != null)
                {
                    _context.Reviews.Remove(review);
                    await _context.SaveChangesAsync();
                    return Json(new { success = true });
                }
                return Json(new { success = false, message = "Không tìm thấy phản hồi." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UploadDishImage(IFormFile file)
        {
            if (!IsAdmin()) return Json(new { success = false, message = "Bạn không có quyền thực hiện chức năng này." });
            if (file == null || file.Length == 0) return Json(new { success = false, message = "Không nhận được tệp hình ảnh." });

            try
            {
                var uploadsFolder = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!System.IO.Directory.Exists(uploadsFolder))
                {
                    System.IO.Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + System.IO.Path.GetFileName(file.FileName);
                var filePath = System.IO.Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                return Json(new { success = true, fileName = uniqueFileName });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra khi tải ảnh lên: " + ex.Message });
            }
        }
        // -------------------------------------------------------------------------------------

        public IActionResult AccessDenied()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

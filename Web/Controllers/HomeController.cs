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
            ViewBag.Reviews = reviews;
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
                // Đặc cách Admin cho email ghuy082@gmail.com
                string userRole = user.Role;
                if (user.Email.Equals("ghuy082@gmail.com", StringComparison.OrdinalIgnoreCase))
                {
                    userRole = "Admin";
                }

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
                
                ViewBag.Users = users;
                ViewBag.Reservations = reservations;
                ViewBag.Bugs = bugs;
                ViewBag.Reviews = reviews;
                
                return View();
            }

            return RedirectToAction("AccessDenied");
        }

        [HttpPost]
        public async Task<IActionResult> BookTable([FromBody] Reservation reservation)
        {
            if (reservation == null)
            {
                return Json(new { success = false, message = "Dữ liệu không hợp lệ." });
            }

            try
            {
                reservation.CreatedAt = DateTime.Now;
                reservation.Status = "Pending";
                
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
                    if (user.Email.Equals("ghuy082@gmail.com", StringComparison.OrdinalIgnoreCase)) {
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

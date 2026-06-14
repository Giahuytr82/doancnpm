document.addEventListener("DOMContentLoaded", () => {
    // 1. Hiệu ứng cuộn thanh điều hướng (Navbar)
    const navbar = document.querySelector(".luxury-navbar");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        
        // Ẩn thanh header khi cuộn xuống, hiện lại khi cuộn lên
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add("nav-hidden");
        } else {
            navbar.classList.remove("nav-hidden");
        }
        
        // Hiệu ứng đổi kiểu khi cuộn quá 50px
        if (currentScrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
        
        lastScrollY = currentScrollY;
    });

    // 2. Trình chọn Dropdown tùy chỉnh
    const selectTriggers = document.querySelectorAll(".custom-select-trigger");
    selectTriggers.forEach(trigger => {
        trigger.addEventListener("click", function(e) {
            e.stopPropagation();
            const parent = this.parentElement;
            const menu = parent.querySelector(".dropdown-menu-custom");
            
            // Đóng các dropdown khác
            document.querySelectorAll(".dropdown-menu-custom").forEach(m => {
                if (m !== menu) m.classList.remove("active");
            });

            menu.classList.toggle("active");
        });
    });

    // Xử lý khi chọn một mục trong Dropdown
    const dropdownItems = document.querySelectorAll(".dropdown-item-custom");
    dropdownItems.forEach(item => {
        item.addEventListener("click", function() {
            const dropdown = this.closest(".guest-picker-container") || this.closest(".form-group-custom");
            const trigger = dropdown.querySelector(".custom-select-trigger");
            const hiddenInput = dropdown.querySelector("input[type='hidden']");
            
            const selectedVal = this.dataset.value;
            const selectedText = this.innerText;

            trigger.innerHTML = `${selectedText} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
            hiddenInput.value = selectedVal;
            
            this.parentElement.classList.remove("active");
        });
    });

    // Đóng dropdown khi click ra ngoài màn hình
    document.addEventListener("click", () => {
        document.querySelectorAll(".dropdown-menu-custom").forEach(m => m.classList.remove("active"));
    });

    // 3. Các nút chọn khung giờ phục vụ (Session)
    const sessionBtns = document.querySelectorAll(".session-btn");
    const selectedTimeInput = document.getElementById("SelectedTime");
    sessionBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            sessionBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            selectedTimeInput.value = this.dataset.time;
        });
    });

    // 4. Hiệu ứng cuộn hiển thị phần tử (Scroll Reveal)
    const revealElements = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add("active");
            }
        }
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Kiểm tra lần đầu khi tải trang

    // 5. Xử lý gửi biểu mẫu đặt bàn (Booking Form)
    const bookingForm = document.getElementById("bookingForm");
    const successModal = document.getElementById("successModal");
    const closeModalBtn = document.getElementById("closeModalBtn");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Xác thực thông tin đơn giản
            const name = document.getElementById("GuestName").value.trim();
            const phone = document.getElementById("GuestPhone").value.trim();
            const date = document.getElementById("BookingDate").value;
            const guests = document.getElementById("GuestCount").value;
            const time = selectedTimeInput.value;
            const area = document.getElementById("SeatingPreference").value || "Sảnh chính (Hồ Koi)";

            // --- BƯỚC 5: KIỂM THỬ (VALIDATION) ---
            if (!name || !phone || !date || !guests || !time) {
                alert("Xin vui lòng điền đầy đủ các thông tin đặt bàn.");
                return;
            }

            // 1. Kiểm tra ngày đặt bàn không được là quá khứ
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (selectedDate < today) {
                alert("Ngày đặt bàn không thể là ngày trong quá khứ.");
                return;
            }

            // 2. Kiểm tra định dạng số điện thoại (Ví dụ: 10 chữ số)
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
                alert("Số điện thoại không hợp lệ. Vui lòng nhập từ 10-11 chữ số.");
                return;
            }
            // -------------------------------------

            const bookingData = {
                GuestName: name,
                GuestPhone: phone,
                BookingDate: date,
                GuestCount: guests,
                SelectedTime: time,
                SeatingPreference: area
            };

            // Gửi dữ liệu về server
            fetch('/Home/BookTable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Điền dữ liệu vào bảng thông báo (Modal)
                    document.getElementById("modalName").innerText = name;
                    document.getElementById("modalDate").innerText = date;
                    document.getElementById("modalTime").innerText = time;
                    document.getElementById("modalGuests").innerText = guests + " khách";

                    // Hiển thị hộp thoại thông báo thành công
                    successModal.classList.add("active");

                    // Thiết lập lại biểu mẫu (Reset)
                    bookingForm.reset();
                    // Đặt lại trạng thái ban đầu của các trình chọn tùy chỉnh (UI triggers)
                    const guestTrigger = document.querySelector(".guest-picker-container .custom-select-trigger");
                    guestTrigger.innerHTML = `Chọn số khách <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
                    document.getElementById("GuestCount").value = "";
                    
                    const areaTrigger = document.querySelector(".form-group-custom:has(#SeatingPreference) .custom-select-trigger");
                    if (areaTrigger) {
                        areaTrigger.innerHTML = `Chọn khu vực... <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
                    }
                    document.getElementById("SeatingPreference").value = "";

                    sessionBtns.forEach(b => b.classList.remove("active"));
                    selectedTimeInput.value = "";
                } else {
                    alert("Có lỗi xảy ra khi đặt bàn: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Không thể kết nối tới máy chủ.");
            });
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            successModal.classList.remove("active");
        });
    }
});

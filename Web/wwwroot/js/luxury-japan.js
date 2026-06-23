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

            // --- ANTIGRAVITY EDIT: Kích hoạt tải sơ đồ bàn khi đổi Khu Vực ---
            if (hiddenInput.id === "SeatingPreference") {
                triggerMapUpdate();
            }
            // ---------------------------------------------------------------
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

            // --- ANTIGRAVITY EDIT: Kích hoạt tải sơ đồ bàn khi chọn Giờ ---
            triggerMapUpdate();
            // -------------------------------------------------------------
        });
    });

    // --- ANTIGRAVITY EDIT: Kích hoạt tải sơ đồ bàn khi chọn Ngày ---
    const bookingDateInput = document.getElementById("BookingDate");
    if (bookingDateInput) {
        bookingDateInput.addEventListener("change", triggerMapUpdate);
    }
    // ---------------------------------------------------------------

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

    // --- ANTIGRAVITY EDIT: Các hàm tải và vẽ sơ đồ vị trí bàn ghế thời gian thực ---
    function triggerMapUpdate() {
        const area = document.getElementById("SeatingPreference")?.value;
        const date = document.getElementById("BookingDate")?.value;
        const time = document.getElementById("SelectedTime")?.value;
        const container = document.getElementById("seatingMapContainer");
        const wrapper = document.getElementById("seatingMapWrapper");
        const notice = document.getElementById("tableSelectNotice");

        if (!container || !wrapper) return;

        // Nếu chưa chọn khu vực thì ẩn sơ đồ đi
        if (!area) {
            container.style.display = "none";
            return;
        }

        container.style.display = "block";

        // Nếu thiếu ngày hoặc giờ
        if (!date || !time) {
            wrapper.innerHTML = `<div class="text-center p-3 text-warning" style="font-size: 0.85rem;">Vui lòng chọn Ngày & Khung giờ phục vụ để tải sơ đồ bàn trống.</div>`;
            notice.innerText = "Cần chọn ngày và giờ để hiển thị bàn trống.";
            document.getElementById("SelectedTableNumber").value = "";
            return;
        }

        wrapper.innerHTML = `<div class="text-center p-3 text-white opacity-50" style="font-size: 0.85rem;"><span style="display:inline-block; animation: spin 1s linear infinite;">↻</span> Đang tải sơ đồ bàn trống...</div>`;
        notice.innerText = "Đang kết nối tới máy chủ...";

        fetch(`/Home/GetOccupiedTables?date=${date}&time=${time}`)
            .then(res => res.json())
            .then(occupiedTables => {
                drawSeatingMap(area, occupiedTables);
            })
            .catch(err => {
                console.error("Error loading tables:", err);
                wrapper.innerHTML = `<div class="text-center p-3 text-danger" style="font-size: 0.85rem;">Không thể tải danh sách bàn trống. Vui lòng thử lại.</div>`;
                notice.innerText = "Lỗi kết nối.";
            });
    }

    function drawSeatingMap(area, occupiedList) {
        const wrapper = document.getElementById("seatingMapWrapper");
        const notice = document.getElementById("tableSelectNotice");
        wrapper.innerHTML = "";
        
        // Reset lựa chọn cũ
        document.getElementById("SelectedTableNumber").value = "";
        notice.innerHTML = `Vui lòng chọn bàn/ghế sáng màu trên sơ đồ.`;

        if (area === "Omakase Counter") {
            let html = `
                <div class="seating-area-omakase">
                    <div class="omakase-counter-line">
                        <span class="omakase-counter-label">QUẦY BAR OMAKASE</span>
                    </div>
                    <div class="omakase-seats-grid">
            `;
            for (let i = 1; i <= 12; i++) {
                const tableId = `Omakase-${String(i).padStart(2, '0')}`;
                const isOccupied = occupiedList.includes(tableId);
                const statusClass = isOccupied ? "occupied" : "vacant";
                html += `
                    <div class="seat-item ${statusClass}" data-table="${tableId}">
                        <div class="seat-icon"></div>
                        <span class="seat-label">Ghế ${i}</span>
                    </div>
                `;
            }
            html += `</div></div>`;
            wrapper.innerHTML = html;
        } 
        else if (area === "Small VIP Room" || area === "Large VIP Room") {
            const isSmallOccupied = occupiedList.includes("VIP-Small");
            const isLargeOccupied = occupiedList.includes("VIP-Large");
            
            const isSmallChosen = area === "Small VIP Room";
            const isLargeChosen = area === "Large VIP Room";

            let html = `<div class="seating-area-vip">`;
            
            let smallStatus = isSmallOccupied ? "occupied" : "vacant";
            let smallStyle = isSmallChosen ? "" : "opacity: 0.25; cursor: not-allowed; pointer-events: none;";
            html += `
                <div class="vip-room-card ${smallStatus}" data-table="VIP-Small" style="${smallStyle}">
                    <div class="vip-room-kanji">菊</div>
                    <span class="vip-room-name">VIP Nhỏ</span>
                    <span class="vip-room-capacity">4 - 6 Khách</span>
                    ${isSmallOccupied ? '<span class="badge-status-occupied">Đã đặt</span>' : ''}
                </div>
            `;

            let largeStatus = isLargeOccupied ? "occupied" : "vacant";
            let largeStyle = isLargeChosen ? "" : "opacity: 0.25; cursor: not-allowed; pointer-events: none;";
            html += `
                <div class="vip-room-card ${largeStatus}" data-table="VIP-Large" style="${largeStyle}">
                    <div class="vip-room-kanji">松</div>
                    <span class="vip-room-name">VIP Lớn</span>
                    <span class="vip-room-capacity">8 - 12 Khách</span>
                    ${isLargeOccupied ? '<span class="badge-status-occupied">Đã đặt</span>' : ''}
                </div>
            `;

            html += `</div>`;
            wrapper.innerHTML = html;
        } 
        else if (area === "Main Dining Room") {
            const tables = [
                { id: "Table-2A", name: "Bàn Đôi A", desc: "2 khách - Sát hồ Koi" },
                { id: "Table-2B", name: "Bàn Đôi B", desc: "2 khách - Sát hồ Koi" },
                { id: "Table-2C", name: "Bàn Đôi C", desc: "2 khách - Sát hồ Koi" },
                { id: "Table-2D", name: "Bàn Đôi D", desc: "2 khách - Hướng vườn" },
                { id: "Table-4A", name: "Bàn 4A", desc: "4 khách - Sảnh chính" },
                { id: "Table-4B", name: "Bàn 4B", desc: "4 khách - Sảnh chính" },
                { id: "Table-4C", name: "Bàn 4C", desc: "4 khách - Sảnh chính" },
                { id: "Table-4D", name: "Bàn 4D", desc: "4 khách - Sảnh chính" },
                { id: "Table-LargeA", name: "Bàn Lớn A", desc: "6-8 khách - Góc thiền" },
                { id: "Table-LargeB", name: "Bàn Lớn B", desc: "6-8 khách - Góc thiền" }
            ];

            let html = `<div class="seating-area-dining">`;
            tables.forEach(t => {
                const isOccupied = occupiedList.includes(t.id);
                const statusClass = isOccupied ? "occupied" : "vacant";
                html += `
                    <div class="dining-table-card ${statusClass}" data-table="${t.id}">
                        <div class="table-visual"></div>
                        <span class="table-name">${t.name}</span>
                        <span class="table-desc">${t.desc}</span>
                        ${isOccupied ? '<span class="badge-status-occupied">Đã đặt</span>' : ''}
                    </div>
                `;
            });
            html += `</div>`;
            wrapper.innerHTML = html;
        }

        // Bắt sự kiện click chọn bàn trống
        const vacantElements = wrapper.querySelectorAll(".seat-item.vacant, .vip-room-card.vacant, .dining-table-card.vacant");
        vacantElements.forEach(el => {
            el.addEventListener("click", function() {
                wrapper.querySelectorAll(".selected").forEach(s => s.classList.remove("selected"));
                this.classList.add("selected");
                
                const tableId = this.dataset.table;
                document.getElementById("SelectedTableNumber").value = tableId;
                notice.innerHTML = `Quý khách đang chọn vị trí: <strong style="color: var(--color-gold); font-size: 0.85rem;">${tableId}</strong>`;
            });
        });
    }
    // --------------------------------------------------------------------------------

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
            const selectedTable = document.getElementById("SelectedTableNumber").value;

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

            // 3. Kiểm tra số lượng khách tương thích với khu vực phòng VIP và các sảnh khác
            if (area === "Small VIP Room") {
                if (guests === "1" || guests === "2" || guests === "3" || guests === "9+") {
                    alert("Phòng VIP Tatami Nhỏ chỉ phục vụ từ 4 đến 6 khách. Quý khách vui lòng chọn Sảnh Ăn Chung cho nhóm ít hơn hoặc Phòng VIP Tatami Lớn cho nhóm đông hơn.");
                    return;
                }
            } else if (area === "Large VIP Room") {
                if (guests === "1" || guests === "2" || guests === "3" || guests === "4") {
                    alert("Phòng VIP Tatami Lớn phục vụ nhóm từ 8 đến 12 khách. Quý khách vui lòng chọn Phòng VIP Tatami Nhỏ hoặc Sảnh Ăn Chung.");
                    return;
                }
            } else if (area === "Omakase Counter") {
                if (guests === "9+") {
                    alert("Quầy Omakase Bar giới hạn phục vụ tối đa 12 ghế đơn và không chia bàn. Quý khách đặt nhóm trên 8 người vui lòng liên hệ trực tiếp hotline để được hỗ trợ sắp xếp vị trí phù hợp.");
                    return;
                }
            } else if (area === "Main Dining Room") {
                if (guests === "9+") {
                    alert("Sảnh chính Hồ Koi có kết cấu bàn tối đa phục vụ 8 khách. Quý khách đi nhóm trên 8 người vui lòng liên hệ hotline để ghép bàn trước hoặc thực hiện đặt nhiều bàn.");
                    return;
                }
            }

            // 4. Kiểm tra xem khách đã chọn bàn trên sơ đồ chưa
            if (!selectedTable) {
                alert("Quý khách vui lòng bấm chọn vị trí bàn/ghế cụ thể trên sơ đồ vị trí ngồi.");
                return;
            }
            // -------------------------------------

            const bookingData = {
                GuestName: name,
                GuestPhone: phone,
                BookingDate: date,
                GuestCount: guests,
                SelectedTime: time,
                SeatingPreference: area,
                TableNumber: selectedTable
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
                    document.getElementById("modalTable").innerText = selectedTable;

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
                    document.getElementById("SelectedTableNumber").value = "";
                    document.getElementById("seatingMapContainer").style.display = "none";
                    document.getElementById("seatingMapWrapper").innerHTML = "";

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

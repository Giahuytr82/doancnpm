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

            // --- ANTIGRAVITY EDIT: Kích hoạt tải sơ đồ bàn khi đổi Khu Vực hoặc Số Khách ---
            if (hiddenInput.id === "SeatingPreference" || hiddenInput.id === "GuestCount") {
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
                // --- ANTIGRAVITY EDIT: Phân rã danh sách bàn/ghế bị chiếm nếu được lưu dạng phẩy ---
                const flatOccupiedList = [];
                if (Array.isArray(occupiedTables)) {
                    occupiedTables.forEach(t => {
                        if (t && t.includes(",")) {
                            t.split(",").forEach(item => {
                                if (item.trim()) flatOccupiedList.push(item.trim());
                            });
                        } else if (t) {
                            flatOccupiedList.push(t.trim());
                        }
                    });
                }
                drawSeatingMap(area, flatOccupiedList);
                // ---------------------------------------------------------------------------------
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

        const guests = document.getElementById("GuestCount")?.value;

        if (area === "Omakase Counter") {
            const isOmakaseExceeded = (guests === "9-12" || guests === "13+");
            if (isOmakaseExceeded) {
                notice.innerHTML = `<span style="color: #ff4d4d; font-weight: bold;">Cảnh báo: Quầy Omakase chỉ nhận nhóm tối đa 8 khách. Vui lòng liên hệ hotline.</span>`;
            }

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
                const isCapacityFit = !isOmakaseExceeded;
                const statusClass = isOccupied ? "occupied" : (isCapacityFit ? "vacant" : "unsuitable");
                const seatStyle = isCapacityFit ? "" : "opacity: 0.25; cursor: not-allowed; pointer-events: none;";
                html += `
                    <div class="seat-item ${statusClass}" data-table="${tableId}" style="${seatStyle}">
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
            
            const isSmallCapacityFit = (guests === "4" || guests === "5-6");
            if (isSmallChosen && !isSmallCapacityFit) {
                notice.innerHTML = `<span style="color: #ff4d4d; font-weight: bold;">Cảnh báo: Phòng VIP Nhỏ chỉ phục vụ từ 4-6 khách. Số lượng khách hiện tại không hợp lệ.</span>`;
            }
            let smallStatus = isSmallOccupied ? "occupied" : (isSmallCapacityFit ? "vacant" : "unsuitable");
            let smallStyle = (isSmallChosen && isSmallCapacityFit) ? "" : "opacity: 0.25; cursor: not-allowed; pointer-events: none;";
            let smallLabel = isSmallOccupied ? '<span class="badge-status-occupied">Đã đặt</span>' : (!isSmallCapacityFit && isSmallChosen ? '<span class="badge-status-occupied" style="background:#ffa500; font-size:0.55rem; padding: 1px 2px;">Không phù hợp</span>' : '');

            html += `
                <div class="vip-room-card ${smallStatus}" data-table="VIP-Small" style="${smallStyle}">
                    <div class="vip-room-kanji">菊</div>
                    <span class="vip-room-name">VIP Nhỏ</span>
                    <span class="vip-room-capacity">4 - 6 Khách</span>
                    ${smallLabel}
                </div>
            `;

            const isLargeCapacityFit = (guests === "7-8" || guests === "9-12");
            if (isLargeChosen && !isLargeCapacityFit) {
                notice.innerHTML = `<span style="color: #ff4d4d; font-weight: bold;">Cảnh báo: Phòng VIP Lớn phục vụ nhóm từ 8-12 khách. Số lượng khách hiện tại không hợp lệ.</span>`;
            }
            let largeStatus = isLargeOccupied ? "occupied" : (isLargeCapacityFit ? "vacant" : "unsuitable");
            let largeStyle = (isLargeChosen && isLargeCapacityFit) ? "" : "opacity: 0.25; cursor: not-allowed; pointer-events: none;";
            let largeLabel = isLargeOccupied ? '<span class="badge-status-occupied">Đã đặt</span>' : (!isLargeCapacityFit && isLargeChosen ? '<span class="badge-status-occupied" style="background:#ffa500; font-size:0.55rem; padding: 1px 2px;">Không phù hợp</span>' : '');

            html += `
                <div class="vip-room-card ${largeStatus}" data-table="VIP-Large" style="${largeStyle}">
                    <div class="vip-room-kanji">松</div>
                    <span class="vip-room-name">VIP Lớn</span>
                    <span class="vip-room-capacity">8 - 12 Khách</span>
                    ${largeLabel}
                </div>
            `;

            html += `</div>`;
            wrapper.innerHTML = html;
        } 
        else if (area === "Main Dining Room") {
            const tables = [
                { id: "Table-2A", name: "Bàn Đôi A", desc: "2 khách - Sát hồ Koi", maxCap: 2 },
                { id: "Table-2B", name: "Bàn Đôi B", desc: "2 khách - Sát hồ Koi", maxCap: 2 },
                { id: "Table-2C", name: "Bàn Đôi C", desc: "2 khách - Sát hồ Koi", maxCap: 2 },
                { id: "Table-2D", name: "Bàn Đôi D", desc: "2 khách - Hướng vườn", maxCap: 2 },
                { id: "Table-4A", name: "Bàn 4A", desc: "4 khách - Sảnh chính", maxCap: 4 },
                { id: "Table-4B", name: "Bàn 4B", desc: "4 khách - Sảnh chính", maxCap: 4 },
                { id: "Table-4C", name: "Bàn 4C", desc: "4 khách - Sảnh chính", maxCap: 4 },
                { id: "Table-4D", name: "Bàn 4D", desc: "4 khách - Sảnh chính", maxCap: 4 },
                { id: "Table-LargeA", name: "Bàn Lớn A", desc: "6-8 khách - Góc thiền", maxCap: 8 },
                { id: "Table-LargeB", name: "Bàn Lớn B", desc: "6-8 khách - Góc thiền", maxCap: 8 }
            ];

            let html = `<div class="seating-area-dining">`;
            const isDiningExceeded = (guests === "9-12" || guests === "13+");
            if (isDiningExceeded) {
                notice.innerHTML = `<span style="color: #ff4d4d; font-weight: bold;">Cảnh báo: Sảnh chính chỉ phục vụ nhóm tối đa 8 khách. Vui lòng chọn cách ghép bàn hoặc liên hệ hotline.</span>`;
            }

            tables.forEach(t => {
                const isOccupied = occupiedList.includes(t.id);
                let isCapacityFit = true;
                if (guests === "3" || guests === "4") {
                    if (t.maxCap < 4) isCapacityFit = false;
                } else if (guests === "5-6" || guests === "7-8") {
                    if (t.maxCap < 8) isCapacityFit = false;
                } else if (isDiningExceeded) {
                    isCapacityFit = false;
                }

                const statusClass = isOccupied ? "occupied" : (isCapacityFit ? "vacant" : "unsuitable");
                const cardStyle = isCapacityFit ? "" : "opacity: 0.25; cursor: not-allowed; pointer-events: none;";
                const badgeMarkup = isOccupied 
                    ? '<span class="badge-status-occupied">Đã đặt</span>' 
                    : (!isCapacityFit && !isDiningExceeded ? '<span class="badge-status-occupied" style="background:#ffa500; font-size:0.55rem; padding: 1px 2px;">Không phù hợp</span>' : '');

                html += `
                    <div class="dining-table-card ${statusClass}" data-table="${t.id}" style="${cardStyle}">
                        <div class="table-visual"></div>
                        <span class="table-name">${t.name}</span>
                        <span class="table-desc">${t.desc}</span>
                        ${badgeMarkup}
                    </div>
                `;
            });
            html += `</div>`;
            wrapper.innerHTML = html;
        }

        // Bắt sự kiện click chọn bàn trống
        if (area === "Omakase Counter") {
            const vacantSeats = wrapper.querySelectorAll(".seat-item.vacant");
            vacantSeats.forEach(el => {
                el.addEventListener("click", function() {
                    // Xác định khoảng giới hạn số ghế được chọn tương ứng với số khách
                    let min = 1, max = 1;
                    if (guests === "2") { min = 2; max = 2; }
                    else if (guests === "3") { min = 3; max = 3; }
                    else if (guests === "4") { min = 4; max = 4; }
                    else if (guests === "5-6") { min = 5; max = 6; }
                    else if (guests === "7-8") { min = 7; max = 8; }
                    else if (guests === "9-12") { min = 9; max = 12; }

                    // Nếu đã chọn rồi thì bỏ chọn (toggle)
                    if (this.classList.contains("selected")) {
                        this.classList.remove("selected");
                    } else {
                        // Nếu chưa chọn, kiểm tra xem đã đạt giới hạn tối đa chưa
                        const currentSelectedCount = wrapper.querySelectorAll(".seat-item.selected").length;
                        if (currentSelectedCount >= max) {
                            alert(`Quý khách đã chọn tối đa ${max} ghế tương ứng với số lượng khách đăng ký.`);
                            return;
                        }
                        this.classList.add("selected");
                    }

                    // Cập nhật lại danh sách ghế chọn
                    const selectedSeats = Array.from(wrapper.querySelectorAll(".seat-item.selected")).map(s => s.dataset.table);
                    document.getElementById("SelectedTableNumber").value = selectedSeats.join(", ");
                    if (selectedSeats.length > 0) {
                        notice.innerHTML = `Vị trí ghế đã chọn: <strong style="color: var(--color-gold); font-size: 0.85rem;">${selectedSeats.join(", ")}</strong> (${selectedSeats.length}/${max} ghế)`;
                    } else {
                        notice.innerHTML = `Vui lòng chọn bàn/ghế sáng màu trên sơ đồ.`;
                    }
                });
            });
        } else {
            // Các khu vực khác (VIP, Sảnh chính) giữ nguyên chọn 1 bàn duy nhất
            const vacantTables = wrapper.querySelectorAll(".vip-room-card.vacant, .dining-table-card.vacant");
            vacantTables.forEach(el => {
                el.addEventListener("click", function() {
                    wrapper.querySelectorAll(".selected").forEach(s => s.classList.remove("selected"));
                    this.classList.add("selected");
                    
                    const tableId = this.dataset.table;
                    document.getElementById("SelectedTableNumber").value = tableId;
                    notice.innerHTML = `Quý khách đang chọn vị trí: <strong style="color: var(--color-gold); font-size: 0.85rem;">${tableId}</strong>`;
                });
            });
        }
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
                if (guests !== "4" && guests !== "5-6") {
                    alert("Phòng VIP Tatami Nhỏ chỉ phục vụ từ 4 đến 6 khách. Quý khách vui lòng chọn Sảnh Ăn Chung cho nhóm ít hơn hoặc Phòng VIP Tatami Lớn cho nhóm đông hơn.");
                    return;
                }
            } else if (area === "Large VIP Room") {
                if (guests !== "7-8" && guests !== "9-12") {
                    alert("Phòng VIP Tatami Lớn phục vụ nhóm từ 8 đến 12 khách. Quý khách vui lòng chọn Phòng VIP Tatami Nhỏ hoặc Sảnh Ăn Chung.");
                    return;
                }
            } else if (area === "Omakase Counter") {
                if (guests === "9-12" || guests === "13+") {
                    alert("Quầy Omakase Bar giới hạn phục vụ tối đa 12 ghế đơn và không chia bàn. Quý khách đặt nhóm trên 8 người vui lòng liên hệ trực tiếp hotline để được hỗ trợ sắp xếp vị trí phù hợp.");
                    return;
                }
            } else if (area === "Main Dining Room") {
                if (guests === "9-12" || guests === "13+") {
                    alert("Sảnh chính Hồ Koi có kết cấu bàn tối đa phục vụ 8 khách. Quý khách đi nhóm trên 8 người vui lòng liên hệ hotline để ghép bàn trước hoặc thực hiện đặt nhiều bàn.");
                    return;
                }
            }

            // 4. Kiểm tra xem khách đã chọn bàn trên sơ đồ chưa
            if (!selectedTable) {
                alert("Quý khách vui lòng bấm chọn vị trí bàn/ghế cụ thể trên sơ đồ vị trí ngồi.");
                return;
            }

            // --- ANTIGRAVITY EDIT: Kiểm tra số lượng ghế Omakase đã chọn khớp với số khách đăng ký ---
            if (area === "Omakase Counter") {
                const selectedSeats = selectedTable.split(",").map(s => s.trim()).filter(s => s.length > 0);
                let min = 1, max = 1;
                if (guests === "2") { min = 2; max = 2; }
                else if (guests === "3") { min = 3; max = 3; }
                else if (guests === "4") { min = 4; max = 4; }
                else if (guests === "5-6") { min = 5; max = 6; }
                else if (guests === "7-8") { min = 7; max = 8; }
                else if (guests === "9-12") { min = 9; max = 12; }

                if (selectedSeats.length < min || selectedSeats.length > max) {
                    if (min === max) {
                        alert(`Quý khách đã đăng ký ${min} khách. Vui lòng chọn đúng ${min} ghế trên sơ đồ quầy Omakase (Hiện tại đã chọn: ${selectedSeats.length} ghế).`);
                    } else {
                        alert(`Quý khách đã đăng ký nhóm ${min}-${max} khách. Vui lòng chọn từ ${min} đến ${max} ghế trên sơ đồ quầy Omakase (Hiện tại đã chọn: ${selectedSeats.length} ghế).`);
                    }
                    return;
                }
            }
            // -----------------------------------------------------------------------------------------
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

// Khởi tạo bộ nhớ hệ thống
let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('sscl_projects')) || [];

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(6);
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('sscl_projects', JSON.stringify(projects));
    renderLeaderboard();
}

// HÀM XỬ LÝ NỘP HỒ SƠ SIÊU THIÊN TÀI
function submitNobel() {
    const title = document.getElementById('p-title').value.trim();
    const latex = document.getElementById('p-latex').value.trim();
    const code = document.getElementById('p-code').value.trim();
    const doi = document.getElementById('p-doi').value.trim();

    // 1. Kiểm tra định dạng cơ bản
    if (!title || !latex.includes('$') || !code.includes('runSSCL')) {
        alert("ISOA-V2026: Hồ sơ không đạt chuẩn Nobel. Hãy kiểm tra lại LaTeX hoặc Code.");
        return;
    }

    // 2. LỌC DNA Ý TƯỞNG (Chống trùng lặp tuyệt đối)
    // Nếu Code hoặc DOI đã tồn tại dưới một cái tên khác, loại ngay.
    const isDuplicate = projects.some(p => 
        (p.code === code && p.title !== title) || 
        (doi !== "" && p.doi === doi && p.title !== title)
    );

    if (isDuplicate) {
        alert("BẢN QUYỀN: Ý tưởng này đã thuộc về một Thiên tài khác. Không thể nhận hồ sơ trùng lặp!");
        return;
    }

    try {
        // 3. Thực thi Code chứng minh khả thi (Hằng số Lực F)
        const runner = new Function(code + "; return runSSCL();");
        const result = runner();

        if (result === 5794) {
            // 4. Cơ chế Versioning & Thưởng
            const existingIdx = projects.findIndex(p => p.title === title);
            let version = 1;
            let reward = 1000;

            if (existingIdx !== -1) {
                // Nếu trùng tên -> Cập nhật bản cũ thành Version cao hơn
                version = projects[existingIdx].version + 1;
                projects.splice(existingIdx, 1);
                reward = 500; 
            }

            if (doi !== "") reward += 5000; // Thưởng lớn cho DOI

            // Lưu dữ liệu nén
            const newProject = { title, doi, code, version, timestamp: new Date().toLocaleString() };
            projects.unshift(newProject);

            // 5. Tự động thanh lọc (Chỉ giữ 57 dự án tinh hoa nhất)
            if (projects.length > 57) projects.pop();

            xuBalance += reward;
            updateUI();
            alert(`XÁC THỰC THÀNH CÔNG V.${version}! Bạn nhận được ${reward} Xu Trường.`);
        } else {
            alert("LOẠI: Kết quả Code không khớp với hằng số SSCL (5794).");
        }
    } catch (e) {
        alert("LỖI THỰC THI: Code rác hoặc có lỗi cú pháp: " + e.message);
    }
}

// HIỂN THỊ BẢNG VINH DANH
function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    list.innerHTML = projects.map(p => `
        <div class="rank-item">
            <strong>Thiên Tài ${p.title} <span class="version-badge">V.${p.version}</span></strong>
            ${p.doi ? `<a href="${p.doi}" target="_blank" class="doi-tag">📄 View DOI Research</a>` : ""}
            <div style="font-size:9px; opacity:0.3; margin-top:8px;">Hồ sơ độc bản • ${p.timestamp}</div>
        </div>
    `).join('');
}

// GIAO DỊCH 1-CLICK
function instantTrade(price, item) {
    if (xuBalance >= price) {
        xuBalance -= price;
        updateUI();
        alert(`SỞ HỮU THÀNH CÔNG: ${item} đã thuộc về bạn.`);
    } else {
        alert("KHÔNG ĐỦ XU TRƯỜNG. Hãy tiếp tục cống hiến trí tuệ.");
    }
}

updateUI(); // Khởi chạy hệ thống

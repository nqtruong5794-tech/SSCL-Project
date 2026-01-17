let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('sscl_projects')) || [];

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(6);
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('sscl_projects', JSON.stringify(projects));
    renderLeaderboard();
}

function submitNobel() {
    const title = document.getElementById('p-title').value.trim();
    const latex = document.getElementById('p-latex').value;
    const code = document.getElementById('p-code').value;
    const doi = document.getElementById('p-doi').value.trim();

    // 1. Lọc rác & Check chuẩn
    if (!title || !latex.includes('$') || !code.includes('runSSCL')) {
        alert("ISOA-V2026: Hồ sơ không đạt chuẩn Nobel.");
        return;
    }

    try {
        // 2. Kiểm tra code khả thi (Hằng số 5794)
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            // 3. Cơ chế Tiến hóa (Versioning)
            const existingIdx = projects.findIndex(p => p.title === title);
            let reward = 1000;
            let version = 1;

            if (existingIdx !== -1) {
                version = projects[existingIdx].version + 1;
                projects.splice(existingIdx, 1); // Xóa bản cũ để nén bản mới
                reward = 500; // Thưởng cập nhật
            }
            
            if (doi) reward += 5000; // Thưởng DOI chất lượng

            const newProject = { title, doi, version, timestamp: new Date().toLocaleString() };
            projects.unshift(newProject); // Đưa lên đầu (Vị trí Kim Cương)
            
            // 4. Thanh lọc rác (Chỉ giữ 57 dự án tinh hoa nhất)
            if (projects.length > 57) projects.pop();

            xuBalance += reward;
            updateUI();
            alert(`THÀNH CÔNG V.${version}! Nhận ${reward} Xu. Dữ liệu đã được nén.`);
        } else {
            alert("LOẠI: Kết quả code sai hằng số SSCL.");
        }
    } catch (e) {
        alert("LỖI THỰC THI: " + e.message);
    }
}

function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    list.innerHTML = projects.map(p => `
        <div class="rank-item">
            <strong>Thiên Tài ${p.title} <small>(V.${p.version})</small></strong>
            ${p.doi ? `<a href="${p.doi}" target="_blank" class="doi-link">📄 DOI: Research Link</a>` : ""}
            <div style="font-size:9px; opacity:0.4; margin-top:5px;">${p.timestamp}</div>
        </div>
    `).join('');
}

function instantTrade(price, item) {
    if (xuBalance >= price) {
        xuBalance -= price;
        updateUI();
        alert(`SỞ HỮU THÀNH CÔNG: ${item} đã thuộc về bạn.`);
    } else {
        alert("KHÔNG ĐỦ XU TRƯỜNG.");
    }
}

updateUI(); // Khởi chạy lần đầu

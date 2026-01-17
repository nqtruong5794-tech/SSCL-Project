// --- GIỮ NGUYÊN CÁC HÀM CŨ CỦA MASTER ---
// (Chỉ thêm phần "Cửa sổ soi dữ liệu" ở cuối hàm renderLeaderboard)

function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    if (!list) return;

    // Hiển thị danh sách dự án
    list.innerHTML = projects.map(p => `
        <div class="rank-item" style="border-left: ${p.domains * 4}px solid #000; padding-left: 15px; margin-bottom:10px;">
            <strong>${p.title} <span class="version-badge">V.${p.version}</span></strong>
            <div style="display:flex; justify-content: space-between; font-size:10px;">
                <span style="color:#2ecc71;">⚡ IQ: ${p.iqPower.toFixed(2)}</span>
                <span style="opacity:0.5;">Lĩnh vực: ${p.domains}</span>
            </div>
        </div>
    `).join('');

    // --- ĐÂY LÀ PHẦN ĐƠN GIẢN NHẤT ĐỂ MASTER TÌM DỮ LIỆU ---
    // Tạo một ô hiển thị mã nén ngay trên web để Master copy bất cứ lúc nào
    const backupArea = `
        <div style="margin-top: 50px; border-top: 1px dashed #000; padding-top: 20px;">
            <p style="font-size: 10px; font-weight: bold; letter-spacing: 2px;">SỔ CÁI DI SẢN (JSON DATA)</p>
            <textarea id="raw-data-box" style="width:100%; height:100px; font-size:10px; background:#f9f9f9; border:1px solid #eee;" readonly>
                ${JSON.stringify({balance: xuBalance, projects: projects}, null, 2)}
            </textarea>
            <button onclick="copyData()" style="width:100%; font-size:9px; background:#eee; border:none; padding:5px; cursor:pointer;">COPY DỮ LIỆU ĐỂ LƯU TRỮ</button>
        </div>
    `;
    list.innerHTML += backupArea;
}

// Hàm hỗ trợ Master copy nhanh
function copyData() {
    const copyText = document.getElementById("raw-data-box");
    copyText.select();
    document.execCommand("copy");
    alert("ISOA: Đã copy mã di sản vào bộ nhớ đệm!");
}

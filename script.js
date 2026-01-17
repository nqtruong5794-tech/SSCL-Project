let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('sscl_projects')) || [];

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('sscl_projects', JSON.stringify(projects));
    renderLeaderboard();
    generateGeniuseQR(); // Tự động cập nhật QR mỗi khi có thay đổi
}

// 1. HÀM TẠO MÃ QR KIM CƯƠNG
function generateGeniuseQR() {
    const qrContainer = document.getElementById("qrcode");
    if (!qrContainer) return;
    qrContainer.innerHTML = ""; // Xóa mã cũ
    
    // Nén dữ liệu tối giản để QR không quá phức tạp
    const legacyData = {
        master: "TRUONG",
        balance: xuBalance.toFixed(4),
        projectsCount: projects.length,
        lastUpdate: new Date().toLocaleTimeString()
    };

    new QRCode(qrContainer, {
        text: JSON.stringify(legacyData),
        width: 150,
        height: 150,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

// 2. KHAI THÁC VÀNG RÒNG (Giữ nguyên)
setInterval(() => {
    let totalIQPower = 0;
    projects.forEach(p => { totalIQPower += (p.iqPower || 0.1); });
    if (totalIQPower > 0) {
        xuBalance += (totalIQPower * 0.000002);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    }
}, 3000);

// 3. HIỂN THỊ VỚI CỬA SỔ SOI DỮ LIỆU & QR
function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    if (!list) return;

    list.innerHTML = projects.map(p => `
        <div class="rank-item" style="border-left: ${p.domains * 4}px solid #000; padding-left: 15px; margin-bottom:10px;">
            <strong>${p.title} <span class="version-badge">V.${p.version}</span></strong>
            <div style="display:flex; justify-content: space-between; font-size:10px;">
                <span style="color:#2ecc71;">⚡ IQ: ${p.iqPower.toFixed(2)}</span>
                <span style="opacity:0.5;">Lĩnh vực: ${p.domains}</span>
            </div>
        </div>
    `).join('');

    // THIẾT LẬP KHU VỰC QR VÀ SỔ CÁI DƯỚI CÙNG
    const dashboard = `
        <div style="margin-top: 40px; border-top: 2px solid #000; padding-top: 20px; text-align: center;">
            <p style="font-size: 10px; font-weight: bold; letter-spacing: 3px;">MÃ QR DI SẢN (SCAN TO SAVE)</p>
            <div id="qrcode" style="display: flex; justify-content: center; margin: 20px 0;"></div>
            <textarea id="raw-data-box" style="width:100%; height:60px; font-size:9px; background:#f9f9f9; border:none;" readonly>
                ${JSON.stringify({balance: xuBalance, projects: projects})}
            </textarea>
            <button onclick="copyData()" style="width:100%; font-size:9px; background:#000; color:#fff; border:none; padding:10px; cursor:pointer; margin-top:10px;">COPY SỔ CÁI JSON</button>
        </div>
    `;
    list.innerHTML += dashboard;
}

function copyData() {
    const copyText = document.getElementById("raw-data-box");
    copyText.select();
    document.execCommand("copy");
    alert("ISOA-57: Di sản đã được sao chép!");
}

// Khởi chạy
updateUI();

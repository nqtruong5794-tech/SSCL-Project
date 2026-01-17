let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('sscl_projects')) || [];
let ownedLands = JSON.parse(localStorage.getItem('sscl_lands')) || []; // Khởi tạo kho Bìa Đỏ

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('sscl_projects', JSON.stringify(projects));
    localStorage.setItem('sscl_lands', JSON.stringify(ownedLands)); // Lưu Bìa Đỏ
    renderLeaderboard();
    renderOwnedLands(); // Hiển thị Bìa Đỏ Xịn Sò
    generateGeniuseQR(); // Cập nhật QR tổng thể
}

// HÀM QUÉT ZENODO BẢN VÁ LỖI PROXY
async function fetchFromZenodo() {
    const input = document.getElementById('p-doi').value.trim();
    if (!input) return alert("Vui lòng nhập ID hoặc Link Zenodo");

    const zenodoId = input.includes('/') ? input.split('/').pop() : input.split('.').pop();
    const proxyUrl = "https://corsproxy.io/?";
    const apiUrl = `https://zenodo.org/api/records/${zenodoId}`;

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error();
        const data = await response.json();

        document.getElementById('p-title').value = data.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ - Verified DOI: ${zenodoId}`;
        document.getElementById('p-code').value = `function runSSCL() {\n  // DNA: ${data.metadata.title}\n  return 5794;\n}`;
        
        alert(`KẾT NỐI THÀNH CÔNG!\nĐã tìm thấy công trình của Master.`);
    } catch (e) {
        console.error("Zenodo fetch error:", e);
        alert("LỖI: Không tìm thấy bài đăng hoặc Zenodo từ chối kết nối. Hãy thử dán link đầy đủ hoặc kiểm tra ID.");
    }
}

// KHAI THÁC VÀNG RÒNG THỤ ĐỘNG
setInterval(() => {
    let totalPower = 0;
    // Tính tổng IQ Power từ Project
    projects.forEach(p => totalPower += (p.iqPower || 0.1));
    // Cộng thêm Mining Power từ mỗi lô đất sở hữu
    ownedLands.forEach(() => totalPower += 0.5); // Mỗi lô đất tăng 0.5 IQ Power thụ động
    
    if (totalPower > 0) {
        xuBalance += (totalPower * 0.000002);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    }
}, 3000);

function submitNobel() {
    const title = document.getElementById('p-title').value;
    const latex = document.getElementById('p-latex').value; // Dùng để tính đa cực
    const code = document.getElementById('p-code').value;
    
    if (!title || !latex.includes('$') ||

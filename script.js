let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('sscl_projects')) || [];
let ownedLands = JSON.parse(localStorage.getItem('sscl_lands')) || [];

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('sscl_projects', JSON.stringify(projects));
    localStorage.setItem('sscl_lands', JSON.stringify(ownedLands));
    renderLeaderboard();
    renderOwnedLands();
    generateGeniuseQR();
}

// --- HỆ THỐNG HỒI SINH (BACKUP/RESTORE) ---
function exportToFile() {
    const data = JSON.stringify({ xuBalance, projects, ownedLands });
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `SSCL_MASTER_TRUONG_${new Date().getTime()}.json`;
    a.click();
}

function importFromFile() { document.getElementById('fileInput').click(); }

function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            xuBalance = data.xuBalance || 0;
            projects = data.projects || [];
            ownedLands = data.ownedLands || [];
            updateUI();
            alert("ISOA: Di sản đã được phục hồi!");
        } catch (err) { alert("Lỗi: File không hợp lệ."); }
    };
    reader.readAsText(event.target.files[0]);
}

// --- LOGIC ZENODO (PROXY CORS) ---
async function fetchFromZenodo() {
    const input = document.getElementById('p-doi').value.trim();
    const zenodoId = input.includes('/') ? input.split('/').pop() : input.split('.').pop();
    const apiUrl = `https://corsproxy.io/?${encodeURIComponent('https://zenodo.org/api/records/' + zenodoId)}`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        document.getElementById('p-title').value = data.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ - DOI: ${zenodoId}`;
        document.getElementById('p-code').value = `function runSSCL() {\n  // Lĩnh vực: Force, AI, Finance\n  return 5794;\n}`;
        alert("Kết nối Zenodo thành công!");
    } catch (e) { alert("Lỗi kết nối API."); }
}

// --- KHAI THÁC VÀNG RÒNG ---
setInterval(() => {
    let power = projects.reduce((sum, p) => sum + (p.iqPower || 0.1), 0);
    power += ownedLands.length * 0.5; // Mỗi mảnh đất cộng 0.5 Power
    if (power > 0) {
        xuBalance += (power * 0.000002);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    }
}, 3000);

function submitNobel() {
    const title = document.getElementById('p-title').value;
    const code = document.getElementById('p-code').value;
    try {
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            projects.unshift({ title, version: 1, iqPower: 0.5, domains: 1 });
            xuBalance += 1000;
            updateUI();
            alert("Xác thực thành công!");
        }
    } catch (e) { alert("Code sai."); }
}

function instantTrade(price, item) {
    if (xuBalance >= price) {
        xuBalance -= price;
        ownedLands.push({ id: `LAND-${ownedLands.length + 1}`, name: item, date: new Date().toLocaleDateString() });
        updateUI();
    } else { alert("Không đủ Xu."); }
}

function renderOwnedLands() {
    const list = document.getElementById('owned-lands-list');
    list.innerHTML = ownedLands.map(land => `
        <div class="land-card">
            <div class="land-id">${land.id}</div>
            <div id="qr-${land.id}" class="land-qr"></div>
            <div style="font-size:7px;">${land.date}</div>
        </div>
    `).join('');
    ownedLands.forEach(land => {
        new QRCode(document.getElementById(`qr-${land.id}`), { text: land.id, width: 60, height: 60 });
    });
}

function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    list.innerHTML = projects.map(p => `<div class="rank-item"><strong>${p.title}</strong> - IQ: ${p.iqPower}</div>`).join('');
}

function generateGeniuseQR() {
    const container = document.getElementById('dynamic-ranks');
    const qrDiv = document.createElement('div');
    qrDiv.id = "master-qr";
    qrDiv.style = "margin-top:20px; display:flex; justify-content:center;";
    container.appendChild(qrDiv);
    new QRCode(qrDiv, { text: "MASTER:" + xuBalance, width: 100, height: 100 });
}

updateUI();

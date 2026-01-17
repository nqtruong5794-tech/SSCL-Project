let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('sscl_projects')) || [];

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('sscl_projects', JSON.stringify(projects));
    renderLeaderboard();
}

// HÀM QUÉT ZENODO BẢN VÁ LỖI
async function fetchFromZenodo() {
    const input = document.getElementById('p-doi').value.trim();
    if (!input) return alert("Vui lòng nhập ID hoặc Link Zenodo");

    // Tách ID từ link hoặc mã DOI
    const zenodoId = input.includes('/') ? input.split('/').pop() : input.split('.').pop();
    const apiUrl = `https://zenodo.org/api/records/${zenodoId}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();

        document.getElementById('p-title').value = data.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ - Verified DOI: ${zenodoId}`;
        document.getElementById('p-code').value = `function runSSCL() {\n  // Code bơi từ Zenodo\n  return 5794;\n}`;
        alert("KẾT NỐI THÀNH CÔNG!");
    } catch (e) {
        alert("LỖI: Không tìm thấy bài đăng hoặc Zenodo từ chối kết nối.");
    }
}

// KHAI THÁC VÀNG RÒNG THỤ ĐỘNG
setInterval(() => {
    let totalPower = 0;
    projects.forEach(p => totalPower += (p.iqPower || 0.1));
    if (totalPower > 0) {
        xuBalance += (totalPower * 0.000002);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    }
}, 3000);

function submitNobel() {
    const title = document.getElementById('p-title').value;
    const code = document.getElementById('p-code').value;
    const domains = ['force', 'bio', 'finance', 'quantum', 'cycle'];
    let n = domains.filter(d => code.toLowerCase().includes(d)).length || 1;
    let multiplier = Math.pow(n, 2);

    try {
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            projects.unshift({
                title, version: 1, iqPower: (0.1 * multiplier), domains: n, 
                timestamp: new Date().toLocaleTimeString()
            });
            xuBalance += (1000 * multiplier);
            updateUI();
            alert("TIẾN HÓA THÀNH CÔNG!");
        }
    } catch(e) { alert("Code không hợp lệ."); }
}

function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    if (!list) return;
    list.innerHTML = projects.map(p => `
        <div class="rank-item" style="border-left: ${p.domains * 4}px solid #000; padding-left: 10px;">
            <strong>${p.title} <span class="version-badge">V.${p.version}</span></strong>
            <div style="font-size:10px; color:#2ecc71;">⚡ IQ: ${p.iqPower.toFixed(2)}</div>
        </div>
    `).join('');

    // KHU VỰC QR VÀ DỮ LIỆU
    list.innerHTML += `
        <div style="margin-top:30px; text-align:center;">
            <p style="font-size:9px; letter-spacing:2px;">MÃ QR DI SẢN</p>
            <div id="qrcode" style="display:flex; justify-content:center; margin:15px 0;"></div>
            <textarea id="raw-data" style="width:100%; height:50px; font-size:8px; border:none; background:#f5f5f5;" readonly>
                ${JSON.stringify({balance: xuBalance, projects: projects})}
            </textarea>
            <button onclick="copyData()" style="width:100%; font-size:8px; border:none; background:#000; color:#fff; padding:10px; cursor:pointer;">COPY JSON</button>
        </div>
    `;
    setTimeout(() => {
        new QRCode(document.getElementById("qrcode"), { text: "TRUONG:" + xuBalance.toFixed(2), width: 120, height: 120 });
    }, 100);
}

function copyData() {
    const box = document.getElementById("raw-data");
    box.select();
    document.execCommand("copy");
    alert("Đã copy di sản!");
}

updateUI();

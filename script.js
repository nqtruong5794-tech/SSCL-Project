/**
 * SSCL SINGULARITY CORE - NO-AUTH EDITION
 * Master: Nguyễn Quốc Trường
 * Bảo mật: Local Storage & Hard-coded Heritage
 */

// 1. KHỞI TẠO DI SẢN (Tự động nhận diện 17,101 Xu)
const HERITAGE_BALANCE = 17101.18804164;
let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || HERITAGE_BALANCE;
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let ownedLands = JSON.parse(localStorage.getItem('ownedLands')) || [];

// 2. CẬP NHẬT GIAO DIỆN & LƯU TRỮ TRỰC TIẾP
function updateUI() {
    const balanceEl = document.getElementById('xu-balance');
    if(balanceEl) balanceEl.innerText = xuBalance.toFixed(8);
    
    // Ghi vào bộ nhớ máy tính của Master (Không cần mây rắc rối)
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('ownedLands', JSON.stringify(ownedLands));

    if (typeof renderLands === "function") renderLands();
    if (typeof renderRanks === "function") renderRanks();
}

// 3. LOGIC NỘP HỒ SƠ NOBEL (VẪN GIỮ NGUYÊN HIỆU SUẤT)
async function fetchFromZenodo() {
    const input = document.getElementById('p-doi').value.trim();
    if (!input) return alert("Nhập ID Zenodo!");
    const id = input.includes('/') ? input.split('/').pop() : input;
    const url = `https://corsproxy.io/?${encodeURIComponent('https://zenodo.org/api/records/' + id)}`;

    try {
        const r = await fetch(url);
        const d = await r.json();
        document.getElementById('p-title').value = d.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ - DOI: ${id}`;
        document.getElementById('p-code').value = `function runSSCL() { return 5794; }`;
    } catch (e) { alert("Lỗi quét Zenodo."); }
}

function submitNobel() {
    const title = document.getElementById('p-title').value;
    const code = document.getElementById('p-code').value;
    try {
        const f = new Function(code + "; return runSSCL();");
        if (f() === 5794) {
            projects.unshift({ title, date: new Date().toLocaleString() });
            xuBalance += 1000;
            updateUI();
            alert("XÁC THỰC THÀNH CÔNG! +1000 XU ĐÃ ĐƯỢC ĐÚC.");
        }
    } catch (e) { alert("Mã nguồn không khớp hằng số 5794."); }
}

// 4. KHAI THÁC TỰ ĐỘNG (DI SẢN TỰ SINH LỜI)
setInterval(() => {
    if (projects.length > 0 || ownedLands.length > 0) {
        xuBalance += (projects.length * 0.000001) + (ownedLands.length * 0.000005);
        const balanceEl = document.getElementById('xu-balance');
        if(balanceEl) balanceEl.innerText = xuBalance.toFixed(8);
    }
}, 3000);

// Khởi chạy ngay lập tức
window.onload = updateUI;

/**
 * SSCL SINGULARITY CORE - PIN ACCESS
 * Master: Nguyễn Quốc Trường
 */

// Chìa khóa vạn năng của Master
const MASTER_PIN = "5794"; 
const PROJECT_URL = "https://sscl-project-default-rtdb.asia-southeast1.firebasedatabase.app";

let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let isLoggedIn = false;

// --- HÀM ĐĂNG NHẬP 4 SỐ ---
function loginWithPin() {
    const pinInput = prompt("ISOA: Nhập mã định danh 4 số (PIN):");
    
    if (pinInput === MASTER_PIN) {
        isLoggedIn = true;
        document.getElementById('auth-section').innerHTML = `<span class="user-badge">MASTER TRUONG</span> <button onclick="logout()" class="btn-logout">THOÁT</button>`;
        alert("XÁC THỰC THIÊN TÀI THÀNH CÔNG!");
        loadFromCloud(); // Tải dữ liệu từ mây ngay khi vào
    } else {
        alert("MÃ PIN SAI. TRUY CẬP BỊ TỪ CHỐI.");
    }
}

function logout() {
    isLoggedIn = false;
    location.reload();
}

// --- TẢI & LƯU ĐÁM MÂY (DÙNG FETCH - KHÔNG CẦN SDK PHỨC TẠP) ---
async function loadFromCloud() {
    try {
        const response = await fetch(`${PROJECT_URL}/data.json`);
        const data = await response.json();
        if (data) {
            xuBalance = data.xuBalance || xuBalance;
            projects = data.projects || projects;
            updateUI();
        }
    } catch (e) { console.log("Lần đầu khởi tạo mây..."); }
}

async function syncToCloud() {
    if (!isLoggedIn) return;
    const data = { xuBalance, projects, lastUpdate: Date.now() };
    
    // Lưu vào máy Master trước
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('projects', JSON.stringify(projects));

    // Đẩy lên mây Firebase qua REST API (Cực kỳ đơn giản)
    try {
        await fetch(`${PROJECT_URL}/data.json`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    } catch (e) { console.error("Lỗi đồng bộ."); }
}

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    syncToCloud();
}

// --- LOGIC NOBEL ---
function submitNobel() {
    if (!isLoggedIn) return alert("Vui lòng đăng nhập mã PIN 4 số!");
    
    const title = document.getElementById('p-title').value;
    const code = document.getElementById('p-code').value;
    
    try {
        const f = new Function(code + "; return runSSCL();");
        if (f() === 5794) {
            projects.unshift({ title, date: new Date().toLocaleString() });
            xuBalance += 1000;
            updateUI();
            alert("XÁC THỰC THÀNH CÔNG! Đã cộng 1000 Xu.");
        }
    } catch (e) { alert("Code không chuẩn SSCL."); }
}

// Tự động đào xu
setInterval(() => {
    if (isLoggedIn && projects.length > 0) {
        xuBalance += (projects.length * 0.000001);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    }
}, 3000);

updateUI();

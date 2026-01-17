/**
 * SSCL SINGULARITY CORE - ISOA-V2026
 * Master: Nguyễn Quốc Trường
 * Trạng thái: Đã kết nối Đám mây Firebase
 */

// 1. CẤU HÌNH THẬT CỦA MASTER TRƯỜNG
const firebaseConfig = {
    apiKey: "AIzaSyACWqxCz_kaZu6kyQF0jfe4-LVzlb4K57Q",
    authDomain: "sscl-project.firebaseapp.com",
    databaseURL: "https://sscl-project-default-rtdb.firebaseio.com", // Kiểm tra lại link này trong Realtime Database
    projectId: "sscl-project",
    storageBucket: "sscl-project.firebasestorage.app",
    messagingSenderId: "268359558237",
    appId: "1:268359558237:web:b79a2fbf3a86e134e319b4",
    measurementId: "G-40G0RGF0DH"
};

// Khởi tạo Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();

// Biến lưu trữ tài sản
let xuBalance = 0;
let projects = [];
let ownedLands = [];

// --- HỆ THỐNG ĐĂNG NHẬP GOOGLE ---
function loginWithGoogle() {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        return auth.signInWithPopup(provider);
    })
    .catch((error) => {
        alert("ISOA: Lỗi xác thực - " + error.message);
    });
}

function logout() {
    auth.signOut().then(() => {
        localStorage.clear();
        location.reload();
    });
}

// --- TỰ ĐỘNG NHẬN DIỆN & TẢI DI SẢN ---
auth.onAuthStateChanged((user) => {
    const btnGoogle = document.getElementById('btn-login-google');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    if (user) {
        if(btnGoogle) btnGoogle.style.display = 'none';
        if(userInfo) userInfo.style.display = 'block';
        if(userName) userName.innerText = user.displayName.split(' ').pop().toUpperCase();

        console.log("ISOA: Đã nhận diện Master " + user.email);
        
        // Tải 17,101 Xu từ Firebase
        db.ref('users/' + user.uid).once('value').then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                xuBalance = data.xuBalance || 0;
                projects = data.projects || [];
                ownedLands = data.ownedLands || [];
                updateUI();
            }
        });
    } else {
        if(btnGoogle) btnGoogle.style.display = 'flex';
        if(userInfo) userInfo.style.display = 'none';
    }
});

// --- ĐỒNG BỘ ĐÁM MÂY (SILENT SYNC) ---
function sync() {
    if (auth.currentUser) {
        db.ref('users/' + auth.currentUser.uid).set({
            xuBalance: xuBalance,
            projects: projects,
            ownedLands: ownedLands,
            lastSync: firebase.database.ServerValue.TIMESTAMP
        });
    }
}

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    renderLands();
    renderRanks();
    sync(); // Lưu ngay khi có biến động
}

// --- LOGIC NOBEL & ZENODO ---
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
        alert("ISOA: Quét thành công!");
    } catch (e) { alert("Lỗi Zenodo."); }
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
            alert("XÁC THỰC THÀNH CÔNG! +1000 Xu.");
        }
    } catch (e) { alert("Code không chuẩn SSCL."); }
}

// --- THỊ TRƯỜNG ĐẤT ĐAI ---
function instantTrade(price, item) {
    if (xuBalance >= price) {
        xuBalance -= price;
        ownedLands.push({ 
            id: `L${ownedLands.length + 1}`, 
            date: new Date().toLocaleDateString() 
        });
        updateUI();
        alert("CHÚC MỪNG! Bìa đỏ đã được ghi vào Đám mây.");
    } else alert("Không đủ Xu.");
}

// --- HIỂN THỊ DỮ LIỆU ---
function renderLands() {
    const l = document.getElementById('owned-lands-list');
    if (!l) return;
    l.innerHTML = ownedLands.map(d => `
        <div class="land-card">
            <b>${d.id}</b>
            <div id="qr-${d.id}"></div>
            <br>${d.date}
        </div>
    `).join('');
    ownedLands.forEach(d => {
        new QRCode(document.getElementById(`qr-${d.id}`), { text: d.id, width: 40, height: 40 });
    });
}

function renderRanks() {
    const r = document.getElementById('dynamic-ranks');
    if (!r) return;
    r.innerHTML = projects.map(p => `<div style="font-size:10px; border-bottom:1px solid #eee;">• ${p.title}</div>`).join('');
}

// --- KHAI THÁC TỰ ĐỘNG (3S/LẦN) ---
setInterval(() => {
    if (auth.currentUser && (projects.length > 0 || ownedLands.length > 0)) {
        xuBalance += (projects.length * 0.000001) + (ownedLands.length * 0.000005);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
        // Không sync liên tục để tránh tốn băng thông, chỉ cập nhật UI
    }
}, 3000);

updateUI();

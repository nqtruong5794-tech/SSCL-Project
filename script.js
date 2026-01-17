/**
 * SSCL SINGULARITY CORE - ISOA-V2026
 * Master: Nguyễn Quốc Trường
 * Cấu hình được trích xuất từ: image_b80f4d.jpg
 */

// 1. THÔNG TIN CẤU HÌNH THẬT CỦA MASTER
const firebaseConfig = {
  apiKey: "AIzaSyACWqxCz_kaZu6kyQF0jfe4-LVzlb4K57Q",
  authDomain: "sscl-project.firebaseapp.com",
  projectId: "sscl-project",
  storageBucket: "sscl-project.firebasestorage.app",
  messagingSenderId: "268359558237",
  appId: "1:268359558237:web:b79a2fbf3a86e134e319b4",
  measurementId: "G-40G0RGF0DH",
  // Master lưu ý: Dòng dưới đây là địa chỉ kho lưu trữ 17,101 Xu
  databaseURL: "https://sscl-project-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Khởi tạo Firebase Đám Mây
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();

// Tài sản hiện có
let xuBalance = 0;
let projects = [];
let ownedLands = [];

// --- HÀM ĐĂNG NHẬP GOOGLE ---
function loginWithGoogle() {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        return auth.signInWithPopup(provider);
    })
    .catch((error) => {
        alert("ISOA: Cổng xác thực báo lỗi - " + error.message);
    });
}

function logout() {
    auth.signOut().then(() => {
        localStorage.clear();
        location.reload();
    });
}

// --- TỰ ĐỘNG NHẬN DIỆN MASTER & TẢI DỮ LIỆU ---
auth.onAuthStateChanged((user) => {
    const btnGoogle = document.getElementById('btn-login-google');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    if (user) {
        if(btnGoogle) btnGoogle.style.display = 'none';
        if(userInfo) userInfo.style.display = 'block';
        if(userName) userName.innerText = user.displayName.toUpperCase();

        console.log("ISOA: Master Trường đã trực tuyến: " + user.email);
        
        // Truy vấn kho lưu trữ 17,101 Xu
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

// --- ĐỒNG BỘ DỮ LIỆU LÊN MÂY VĨNH VIỄN ---
function sync() {
    if (auth.currentUser) {
        db.ref('users/' + auth.currentUser.uid).set({
            xuBalance: xuBalance,
            projects: projects,
            ownedLands: ownedLands,
            lastUpdate: firebase.database.ServerValue.TIMESTAMP
        });
    }
}

function updateUI() {
    const balanceEl = document.getElementById('xu-balance');
    if(balanceEl) balanceEl.innerText = xuBalance.toFixed(8);
    
    if (typeof renderLands === "function") renderLands();
    if (typeof renderRanks === "function") renderRanks();
    
    sync(); // Tự động khóa dữ liệu mỗi khi có thay đổi
}

// --- LOGIC NOBEL & ZENODO ---
async function fetchFromZenodo() {
    const input = document.getElementById('p-doi').value.trim();
    if (!input) return alert("Vui lòng nhập ID Zenodo!");
    const id = input.includes('/') ? input.split('/').pop() : input;
    const url = `https://corsproxy.io/?${encodeURIComponent('https://zenodo.org/api/records/' + id)}`;

    try {
        const r = await fetch(url);
        const d = await r.json();
        document.getElementById('p-title').value = d.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ - DOI: ${id}`;
        document.getElementById('p-code').value = `function runSSCL() { return 5794; }`;
        alert("ISOA: Quét dữ liệu Zenodo thành công!");
    } catch (e) { alert("Lỗi kết nối Zenodo."); }
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
            alert("XÁC THỰC THÀNH CÔNG! Đã cộng 1000 Xu vào quỹ Đám mây.");
        }
    } catch (e) { alert("Lỗi: Code không trả về hằng số SSCL 5794."); }
}

// --- KHAI THÁC TỰ ĐỘNG (3S/LẦN) ---
setInterval(() => {
    if (auth.currentUser && projects.length > 0) {
        xuBalance += (projects.length * 0.000001);
        const balanceEl = document.getElementById('xu-balance');
        if(balanceEl) balanceEl.innerText = xuBalance.toFixed(8);
    }
}, 3000);

// Khởi động giao diện
updateUI();

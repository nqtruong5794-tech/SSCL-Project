// --- THÔNG TIN CẤU HÌNH THẬT CỦA MASTER ---
const firebaseConfig = {
  apiKey: "AIzaSyACWqxCz_kaZu6kyQF0jfe4-LVzlb4K57Q",
  authDomain: "sscl-project.firebaseapp.com",
  databaseURL: "https://sscl-project-default-rtdb.firebaseio.com", // Lưu ý: Master kiểm tra link này trong Realtime Database
  projectId: "sscl-project",
  storageBucket: "sscl-project.firebasestorage.app",
  messagingSenderId: "268359558237",
  appId: "1:268359558237:web:b79a2fbf3a86e134e319b4",
  measurementId: "G-40G0RGF0DH"
};

// Khởi tạo Firebase (Sử dụng bản Compat để chạy trên GitHub Pages)
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();

let xuBalance = 0;
let projects = [];
let ownedLands = [];

// --- CỔNG ĐĂNG NHẬP GOOGLE ---
function loginWithGoogle() {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => auth.signInWithPopup(provider))
    .catch(e => alert("Lỗi ISOA: " + e.message));
}

function logout() { auth.signOut().then(() => location.reload()); }

// --- TỰ ĐỘNG NHẬN DIỆN VÀ TẢI DỮ LIỆU ---
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('btn-login-google').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-name').innerText = user.displayName.toUpperCase();
        
        // Tải 17,101 Xu từ mây về
        db.ref('users/' + user.uid).once('value').then(s => {
            const data = s.val();
            if (data) {
                xuBalance = data.xuBalance || 0;
                projects = data.projects || [];
                ownedLands = data.ownedLands || [];
                updateUI();
            }
        });
    }
});

function sync() {
    if (auth.currentUser) {
        db.ref('users/' + auth.currentUser.uid).set({ 
            xuBalance, 
            projects, 
            ownedLands,
            lastSeen: firebase.database.ServerValue.TIMESTAMP 
        });
    }
}

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    if (typeof renderLands === "function") renderLands();
    if (typeof renderRanks === "function") renderRanks();
    sync(); // Tự động lưu lên mây
}

// --- CÁC HÀM LOGIC SSCL ---
function submitNobel() {
    const title = document.getElementById('p-title').value;
    const code = document.getElementById('p-code').value;
    try {
        const f = new Function(code + "; return runSSCL();");
        if (f() === 5794) {
            projects.unshift({ title, date: new Date().toLocaleString() });
            xuBalance += 1000;
            updateUI();
            alert("XÁC THỰC THÀNH CÔNG! ĐÃ ĐỒNG BỘ ĐÁM MÂY.");
        }
    } catch (e) { alert("Code không chuẩn."); }
}

// Tự động đào xu mỗi 3 giây
setInterval(() => {
    if (auth.currentUser && (projects.length > 0 || ownedLands.length > 0)) {
        xuBalance += (projects.length * 0.000001) + (ownedLands.length * 0.000005);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    }
}, 3000);

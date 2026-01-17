// CẤU HÌNH FIREBASE - Master dán thông số của Master vào đây
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sscl-truong.firebaseapp.com",
  databaseURL: "https://sscl-truong.firebaseio.com",
  projectId: "sscl-truong",
  storageBucket: "sscl-truong.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
let currentUser = null;

// --- TỰ ĐỘNG NHẬN DIỆN NGƯỜI DÙNG ---
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        loadDataFromCloud(); // Tự động lấy tiền và đất về
        alert("Đã kết nối tài sản đám mây!");
    } else {
        showLoginModal(); // Hiện form đăng nhập nếu là khách mới
    }
});

// --- LƯU TRỮ TỰ ĐỘNG (SILENT SYNC) ---
function saveDataToCloud() {
    if (!currentUser) return;
    db.ref('users/' + currentUser.uid).set({
        xuBalance: xuBalance,
        projects: projects,
        ownedLands: ownedLands,
        lastActive: Date.now()
    });
}

// --- TẢI DỮ LIỆU TỰ ĐỘNG ---
function loadDataFromCloud() {
    db.ref('users/' + currentUser.uid).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            xuBalance = data.xuBalance || 0;
            projects = data.projects || [];
            ownedLands = data.ownedLands || [];
            updateUI();
        }
    });
}

// Hàm cập nhật UI kết hợp Sync
function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    saveDataToCloud(); // Mỗi khi tiền nhảy, Firebase tự động lưu ngầm
    renderLeaderboard();
    renderOwnedLands();
}

// --- GIAO DIỆN ĐĂNG NHẬP ĐƠN GIẢN ---
function showLoginModal() {
    const email = prompt("Chào mừng Master! Nhập Email để bảo vệ tài sản:");
    const pass = prompt("Nhập mật khẩu (từ 6 ký tự):");
    if (email && pass) {
        auth.signInWithEmailAndPassword(email, pass).catch(e => {
            auth.createUserWithEmailAndPassword(email, pass); // Tự đăng ký nếu chưa có
        });
    }
}

// Cấu hình lấy chính xác từ image_b80f4d.jpg của Master
const firebaseConfig = {
  apiKey: "AIzaSyACWqxCz_kaZu6kyQF0jfe4-LVzlb4K57Q",
  authDomain: "sscl-project.firebaseapp.com",
  projectId: "sscl-project",
  storageBucket: "sscl-project.firebasestorage.app",
  messagingSenderId: "268359558237",
  appId: "1:268359558237:web:b79a2fbf3a86e134e319b4",
  measurementId: "G-40G0RGF0DH",
  databaseURL: "https://sscl-project-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Khởi tạo
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// CON SỐ DI SẢN CỦA MASTER
let xuBalance = 17101.18804164; 

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    // Tự động lưu lên Firebase khi Master đăng nhập
    if (auth.currentUser) {
        db.ref('users/' + auth.currentUser.uid).update({
            xuBalance: xuBalance,
            lastSeen: new Date().toISOString()
        });
    }
}

// Hàm đăng nhập Google để bảo vệ tài sản
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => {
        alert("ISOA: Đã khóa 17,101 Xu vào tài khoản Google của Master!");
        updateUI();
    }).catch(e => alert("Lỗi: " + e.message));
}

updateUI();

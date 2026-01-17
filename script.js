/**
 * SSCL SINGULARITY CORE - ISOA-V2026
 * Master: Nguyễn Quốc Trường
 */

// 1. CẤU HÌNH FIREBASE (Master BẮT BUỘC điền thông số từ Firebase Console vào đây)
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

// Khởi tạo Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();

// Khai báo biến toàn cục
let xuBalance = 0;
let projects = [];
let ownedLands = [];

// --- HÀM ĐĂNG NHẬP GOOGLE (GHI NHỚ VĨNH VIỄN) ---
function loginWithGoogle() {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL) // Giúp không phải đăng nhập lại khi mở web
    .then(() => {
        return auth.signInWithPopup(provider);
    })
    .catch((error) => {
        alert("Lỗi đăng nhập: " + error.message);
    });
}

// --- HÀM ĐĂNG XUẤT ---
function logout() {
    auth.signOut().then(() => {
        localStorage.clear();
        location.reload();
    });
}

// --- TỰ ĐỘNG THEO DÕI TRẠNG THÁI ĐĂNG NHẬP ---
auth.onAuthStateChanged((user) => {
    const authSection = document.getElementById('auth-section');
    const btnGoogle = document.getElementById('btn-login-google');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    if (user) {
        // Giao diện khi đã đăng nhập
        if(btnGoogle) btnGoogle.style.display = 'none';
        if(userInfo) userInfo.style.display = 'block';
        if(userName) userName.innerText = user.displayName.toUpperCase();

        console.log("ISOA: Đã nhận diện Master " + user.email);
        loadLegacyData(user.uid); // Tải dữ liệu từ mây về
    } else {
        // Giao diện khi chưa đăng nhập
        if(btnGoogle) btnGoogle.style.display = 'flex';
        if(userInfo) userInfo.style.display = 'none';
    }
});

// --- TẢI DỮ LIỆU TỪ FIREBASE ---
function loadLegacyData(uid) {
    db.ref('users/' + uid).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            xuBalance = data.xuBalance || 0;
            projects = data.projects || [];
            ownedLands = data.ownedLands || [];
            console.log("ISOA: Di sản đã được phục hồi từ đám mây.");
        } else {
            console.log("ISOA: Chào mừng Master mới, hệ thống khởi tạo kho lưu trữ.");
        }
        updateUI();
    }).catch(e => console.error("Lỗi tải dữ liệu:", e));
}

// --- ĐỒNG BỘ DỮ LIỆU LÊN FIREBASE (SILENT SYNC) ---
function syncToCloud() {
    if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        db.ref('users/' + uid).set({
            xuBalance: xuBalance,
            projects: projects,
            ownedLands: ownedLands,
            lastUpdate: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            console.log("ISOA: Dữ liệu đã được bảo vệ trên mây.");
        }).catch(e => {
            console.error("Lỗi Rules Firebase: Master chưa bật quyền Ghi (Write)!");
        });
    }
}

// --- CẬP NHẬT GIAO DIỆN ---
function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    renderLeaderboard();
    renderOwnedLands();
    syncToCloud(); // Đồng bộ ngay khi có thay đổi
}

// --- HÀM QUÉT ZENODO (SỬ DỤNG PROXY ĐỂ TRÁNH LỖI CORS) ---
async function fetchFromZenodo() {
    const input = document.getElementById('p-doi').value.trim();
    if (!input) return alert("Vui lòng nhập ID Zenodo!");

    const zenodoId = input.includes('/') ? input.split('/').pop() : input;
    const proxyUrl = "https://corsproxy.io/?";
    const apiUrl = `https://zenodo.org/api/records/${zenodoId}`;

    try {
        const res = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!res.ok) throw new Error("Không tìm thấy dữ liệu.");
        const data = await res.json();

        document.getElementById('p-title').value = data.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ - DOI Verified: ${zenodoId}`;
        document.getElementById('p-code').value = `function runSSCL() {\n  // Lõi ứng dụng Đa cực\n  return 5794;\n}`;
        alert("ISOA: Quét dữ liệu Zenodo thành công!");
    } catch (e) {
        alert("Lỗi Zenodo: " + e.message);
    }
}

// --- HÀM NỘP HỒ SƠ & TIẾN HÓA ---
function submitNobel() {
    const title = document.getElementById('p-title').value;
    const code = document.getElementById('p-code').value;

    if (!title || !code) return alert("Hồ sơ thiếu thông tin!");

    try {
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            projects.unshift({
                title: title,
                iqPower: 1.0,
                timestamp: new Date().toLocaleString()
            });
            xuBalance += 1000; // Thưởng 1000 Xu cho mỗi bài Nobel
            updateUI();
            alert("XÁC THỰC THÀNH CÔNG! +1000 Xu Trường.");
        } else {
            alert("LOẠI: Code không trả về hằng số 5794.");
        }
    } catch (e) {
        alert("Lỗi thực thi code: " + e.message);
    }
}

// --- GIAO DỊCH MUA ĐẤT ---
function instantTrade(price, item) {
    if (xuBalance >= price) {
        xuBalance -= price;
        ownedLands.push({
            id: `SSCL-L${ownedLands.length + 1}`,
            name: item,
            date: new Date().toLocaleDateString()
        });
        updateUI();
        alert("CHÚC MỪNG! Master đã sở hữu thêm Bìa Đỏ Kim Cương.");
    } else {
        alert("KHÔNG ĐỦ XU. Master cần nộp thêm Nobel để khai thác.");
    }
}

// --- HIỂN THỊ DANH SÁCH BÌA ĐỎ ---
function renderOwnedLands() {
    const list = document.getElementById('owned-lands-list');
    if (!list) return;
    list.innerHTML = ownedLands.map(land => `
        <div class="land-card">
            <div class="land-id">${land.id}</div>
            <div id="qr-${land.id}" class="land-qr"></div>
            <div style="font-size:8px; font-weight:bold; z-index:1;">${land.date}</div>
        </div>
    `).join('');

    // Tạo QR riêng cho từng mảnh đất
    ownedLands.forEach(land => {
        new QRCode(document.getElementById(`qr-${land.id}`), {
            text: land.id + "-" + land.date,
            width: 60,
            height: 60
        });
    });
}

// --- HIỂN THỊ BẢNG THIÊN TÀI ---
function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    if (!list) return;
    list.innerHTML = projects.map(p => `
        <div style="font-size:11px; padding:10px 0; border-bottom:1px dashed #eee;">
            <strong>${p.title}</strong><br>
            <small style="color:#2ecc71;">⚡ IQ Power: 1.0 | ${p.timestamp}</small>
        </div>
    `).join('');
}

// --- MINING THỤ ĐỘNG (3S/LẦN) ---
setInterval(() => {
    let power = projects.length * 0.1;
    power += ownedLands.length * 0.8; // Đất Kim Cương tăng power rất lớn
    if (power > 0 && auth.currentUser) {
        xuBalance += (power * 0.000005);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
        // Không sync liên tục mỗi 3s để tiết kiệm dung lượng, chỉ sync khi Master nhấn nút hoặc mua đất
    }
}, 3000);

// Khởi chạy
updateUI();

// --- MASTER TRƯỜNG CẦN ĐIỀN THÔNG TIN FIREBASE VÀO ĐÂY ---
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
// -------------------------------------------------------

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();

let xuBalance = 0;
let projects = [];
let ownedLands = [];

// --- XỬ LÝ ĐĂNG NHẬP GOOGLE ---
function loginWithGoogle() {
    auth.signInWithPopup(provider).catch(e => alert("Lỗi Google Auth: " + e.message));
}

function logout() { auth.signOut().then(() => location.reload()); }

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('btn-login-google').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-name').innerText = user.displayName.split(' ').pop();
        
        // Tải dữ liệu từ Đám mây
        db.ref('users/' + user.uid).once('value').then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                xuBalance = data.xuBalance || 0;
                projects = data.projects || [];
                ownedLands = data.ownedLands || [];
                updateUI();
            }
        });
    }
});

// --- LƯU TRỮ TỰ ĐỘNG ---
function syncToCloud() {
    if (auth.currentUser) {
        db.ref('users/' + auth.currentUser.uid).set({
            xuBalance, projects, ownedLands, lastUpdate: Date.now()
        });
    }
}

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    renderLeaderboard();
    renderOwnedLands();
    syncToCloud(); // Mỗi khi UI đổi, dữ liệu bay lên mây
}

// --- QUÉT ZENODO (LÁCH CORS) ---
async function fetchFromZenodo() {
    const input = document.getElementById('p-doi').value.trim();
    if (!input) return alert("Nhập ID Zenodo!");
    const zenodoId = input.includes('/') ? input.split('/').pop() : input;
    const proxyUrl = "https://corsproxy.io/?";
    const apiUrl = `https://zenodo.org/api/records/${zenodoId}`;

    try {
        const res = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        const data = await res.json();
        document.getElementById('p-title').value = data.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ - DOI: ${zenodoId}`;
        document.getElementById('p-code').value = `function runSSCL() {\n  // Lĩnh vực: Force, AI, Bio\n  return 5794;\n}`;
        alert("ISOA: Quét dữ liệu thành công!");
    } catch (e) { alert("Lỗi Zenodo API."); }
}

// --- KHAI THÁC VÀNG RÒNG (3S/LẦN) ---
setInterval(() => {
    let power = projects.reduce((s, p) => s + (p.iqPower || 0.1), 0);
    power += ownedLands.length * 0.8; // Đất Kim Cương tăng power cực mạnh
    if (power > 0) {
        xuBalance += (power * 0.000005);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    }
}, 3000);

function submitNobel() {
    const title = document.getElementById('p-title').value;
    const code = document.getElementById('p-code').value;
    try {
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            projects.unshift({ title, iqPower: 1.0, timestamp: new Date().toLocaleTimeString() });
            xuBalance += 1000;
            updateUI();
            alert("XÁC THỰC THÀNH CÔNG!");
        }
    } catch (e) { alert("Lỗi Code logic."); }
}

function instantTrade(price, item) {
    if (xuBalance >= price) {
        xuBalance -= price;
        ownedLands.push({ id: `SSCL-L${ownedLands.length + 1}`, name: item, date: new Date().toLocaleDateString() });
        updateUI();
        alert("SỞ HỮU THÀNH CÔNG BÌA ĐỎ!");
    } else { alert("Không đủ Xu."); }
}

function renderOwnedLands() {
    const list = document.getElementById('owned-lands-list');
    list.innerHTML = ownedLands.map(land => `
        <div class="land-card">
            <div class="land-id">${land.id}</div>
            <div id="qr-${land.id}" class="land-qr"></div>
            <div style="font-size:8px; font-weight:bold;">${land.date}</div>
        </div>
    `).join('');
    ownedLands.forEach(land => {
        new QRCode(document.getElementById(`qr-${land.id}`), { text: land.id, width: 60, height: 60 });
    });
}

function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    list.innerHTML = projects.map(p => `
        <div style="font-size:11px; padding:5px 0; border-bottom:1px solid #eee;">
            <strong>${p.title}</strong> - [IQ: 1.0]
        </div>
    `).join('');
}

updateUI();

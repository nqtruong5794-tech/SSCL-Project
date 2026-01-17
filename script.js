// --- MASTER TRƯỜNG DÁN CONFIG THẬT VÀO ĐÂY ---
const firebaseConfig = {
  apiKey: "DÁN_API_KEY_THẬT_TẠI_ĐÂY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
// ----------------------------------------------

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();

let xuBalance = 0;
let projects = [];
let ownedLands = [];

function loginWithGoogle() {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => auth.signInWithPopup(provider))
    .catch(e => alert("Lỗi xác thực: " + e.message));
}

function logout() { auth.signOut().then(() => location.reload()); }

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('btn-login-google').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-name').innerText = user.displayName.split(' ').pop().toUpperCase();
        loadData(user.uid);
    }
});

function loadData(uid) {
    db.ref('users/' + uid).once('value').then(s => {
        const d = s.val();
        if (d) {
            xuBalance = d.xuBalance || 0;
            projects = d.projects || [];
            ownedLands = d.ownedLands || [];
            updateUI();
        }
    });
}

function sync() {
    if (auth.currentUser) {
        db.ref('users/' + auth.currentUser.uid).set({ xuBalance, projects, ownedLands });
    }
}

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    renderLands();
    renderRanks();
    sync();
}

async function fetchFromZenodo() {
    const id = document.getElementById('p-doi').value.trim().split('/').pop();
    const url = `https://corsproxy.io/?${encodeURIComponent('https://zenodo.org/api/records/' + id)}`;
    try {
        const r = await fetch(url);
        const d = await r.json();
        document.getElementById('p-title').value = d.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ - DOI: ${id}`;
        document.getElementById('p-code').value = `function runSSCL() { return 5794; }`;
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
            alert("XÁC THỰC THÀNH CÔNG!");
        }
    } catch (e) { alert("Code sai."); }
}

function instantTrade(p, i) {
    if (xuBalance >= p) {
        xuBalance -= p;
        ownedLands.push({ id: `L${ownedLands.length + 1}`, date: new Date().toLocaleDateString() });
        updateUI();
    } else alert("Không đủ Xu.");
}

function renderLands() {
    const l = document.getElementById('owned-lands-list');
    l.innerHTML = ownedLands.map(d => `<div class="land-card"><b>${d.id}</b><div id="qr-${d.id}"></div><br>${d.date}</div>`).join('');
    ownedLands.forEach(d => new QRCode(document.getElementById(`qr-${d.id}`), { text: d.id, width: 40, height: 40 }));
}

function renderRanks() {
    document.getElementById('dynamic-ranks').innerHTML = projects.map(p => `<div style="font-size:10px; margin-bottom:5px;">• ${p.title}</div>`).join('');
}

setInterval(() => {
    if (auth.currentUser && (projects.length || ownedLands.length)) {
        xuBalance += (projects.length * 0.000001) + (ownedLands.length * 0.000005);
        document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    }
}, 3000);

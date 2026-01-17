/**
 * SSCL SINGULARITY CORE - ISOA-V2026
 * Cơ chế: Quét Zenodo - Khai thác Đa cực (n^2) - Vàng ròng thụ động
 */

let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('sscl_projects')) || [];

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('sscl_projects', JSON.stringify(projects));
    renderLeaderboard();
}

// 1. QUÉT DỮ LIỆU ZENODO
async function fetchFromZenodo() {
    const doiLink = document.getElementById('p-doi').value.trim();
    if (!doiLink.includes('zenodo.org')) {
        alert("ISOA: Vui lòng dán link Zenodo để quét tri thức.");
        return;
    }

    const zenodoId = doiLink.split('/').pop();
    const apiUrl = `https://zenodo.org/api/records/${zenodoId}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        document.getElementById('p-title').value = data.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ (Zenodo Verified)`;
        document.getElementById('p-code').value = `function runSSCL() {\n  // DOI: ${doiLink}\n  return 5794;\n}`;
        
        alert(`KẾT NỐI ZENODO THÀNH CÔNG!\nTìm thấy: ${data.metadata.title}`);
    } catch (error) {
        alert("LỖI: Không thể lấy dữ liệu Zenodo.");
    }
}

// 2. KHAI THÁC VÀNG RÒNG (PASSIVE MINING)
setInterval(() => {
    let totalIQPower = 0;
    projects.forEach(p => { totalIQPower += (p.iqPower || 0.1); });
    if (totalIQPower > 0) {
        xuBalance += (totalIQPower * 0.000002); // Dòng chảy vàng ròng
        updateUI();
    }
}, 3000);

// 3. XỬ LÝ NỘP HỒ SƠ & ĐA CỰC
function submitNobel() {
    const title = document.getElementById('p-title').value.trim();
    const latex = document.getElementById('p-latex').value.trim();
    const code = document.getElementById('p-code').value.trim();
    const doi = document.getElementById('p-doi').value.trim();

    if (!title || !latex.includes('$') || !code.includes('runSSCL')) {
        alert("Hồ sơ không chuẩn Nobel SSCL.");
        return;
    }

    const isDuplicate = projects.some(p => (p.code === code && p.title !== title) || (doi !== "" && p.doi === doi && p.title !== title));
    if (isDuplicate) { alert("DNA Ý tưởng đã tồn tại!"); return; }

    // Phân tích đa cực n^2
    const domains = ['force', 'bio', 'finance', 'quantum', 'cycle', 'ai', 'crypto', 'math'];
    let n = domains.filter(d => code.toLowerCase().includes(d) || latex.toLowerCase().includes(d)).length || 1;
    let multiplier = Math.pow(n, 2);

    try {
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            const existingIdx = projects.findIndex(p => p.title === title);
            let version = 1, baseReward = 1000;

            if (existingIdx !== -1) {
                version = projects[existingIdx].version + 1;
                projects.splice(existingIdx, 1);
                baseReward = 500;
            }
            if (doi !== "") baseReward += 5000;

            let finalReward = baseReward * multiplier;
            let finalIQPower = (0.1 * version * multiplier);

            projects.unshift({ title, doi, code, version, iqPower: finalIQPower, domains: n, timestamp: new Date().toLocaleString() });
            if (projects.length > 57) projects.pop();

            xuBalance += finalReward;
            updateUI();
            alert(`XÁC THỰC THÀNH CÔNG V.${version}!\nĐa cực: ${n} lĩnh vực (x${multiplier})\nThưởng: ${finalReward} Xu.`);
        } else {
            alert("LOẠI: Kết quả sai hằng số 5794.");
        }
    } catch (e) { alert("Lỗi thực thi Code."); }
}

// 4. HIỂN THỊ BẢNG VINH DANH
function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    if (!list) return;
    list.innerHTML = projects.map(p => `
        <div class="rank-item" style="border-left: ${p.domains * 4}px solid #000; padding-left: 15px;">
            <strong>${p.title} <span class="version-badge">V.${p.version}</span></strong>
            <div style="display:flex; justify-content: space-between; margin-top:5px; font-size:10px;">
                <span style="color:#2ecc71; font-weight:bold;">⚡ IQ: ${p.iqPower.toFixed(2)}</span>
                <span style="opacity:0.5;">Lĩnh vực: ${p.domains}</span>
            </div>
            ${p.doi ? `<a href="${p.doi}" target="_blank" class="doi-tag">📄 VIEW ZENODO RESEARCH</a>` : ""}
        </div>
    `).join('');
}

function instantTrade(price, item) {
    if (xuBalance >= price) {
        xuBalance -= price;
        updateUI();
        alert(`SỞ HỮU THÀNH CÔNG: ${item}`);
    } else { alert("KHÔNG ĐỦ XU TRƯỜNG."); }
}

updateUI();

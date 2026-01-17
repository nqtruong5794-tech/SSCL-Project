let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('sscl_projects')) || [];

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8); // Tăng độ chính xác
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('sscl_projects', JSON.stringify(projects));
    renderLeaderboard();
}

// LÕI KHAI THÁC VÀNG RÒNG (PASSIVE MINING)
setInterval(() => {
    let totalIQPower = 0;
    projects.forEach(p => {
        // Mỗi dự án đóng góp vào công suất khai thác dựa trên Version và DOI
        let pPower = (p.version * 0.1) + (p.doi ? 0.5 : 0);
        totalIQPower += pPower;
    });
    
    if (totalIQPower > 0) {
        // Xu tự sinh ra dựa trên tổng trí tuệ đã nạp vào hệ thống
        xuBalance += (totalIQPower * 0.000001); 
        updateUI();
    }
}, 3000); // 3 giây sinh lời một lần

function submitNobel() {
    const title = document.getElementById('p-title').value.trim();
    const latex = document.getElementById('p-latex').value.trim();
    const code = document.getElementById('p-code').value.trim();
    const doi = document.getElementById('p-doi').value.trim();

    if (!title || !latex.includes('$') || !code.includes('runSSCL')) {
        alert("ISOA-V2026: Hồ sơ chưa đủ chuẩn Thiên tài.");
        return;
    }

    const isDuplicate = projects.some(p => (p.code === code && p.title !== title) || (doi !== "" && p.doi === doi && p.title !== title));
    if (isDuplicate) {
        alert("BẢN QUYỀN: Ý tưởng DNA đã tồn tại!");
        return;
    }

    try {
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            const existingIdx = projects.findIndex(p => p.title === title);
            let version = 1, reward = 1000;

            if (existingIdx !== -1) {
                version = projects[existingIdx].version + 1;
                projects.splice(existingIdx, 1);
                reward = 500;
            }
            if (doi !== "") reward += 5000;

            projects.unshift({ title, doi, code, version, timestamp: new Date().toLocaleString() });
            if (projects.length > 57) projects.pop();

            xuBalance += reward;
            updateUI();
            alert(`KÍCH HOẠT ĐỘNG CƠ V.${version}: Công suất khai thác đã tăng!`);
        } else {
            alert("LOẠI: Code không khớp hằng số 5794.");
        }
    } catch (e) {
        alert("LỖI THỰC THI: " + e.message);
    }
}

function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    list.innerHTML = projects.map(p => {
        let iqPower = ((p.version * 0.1) + (p.doi ? 0.5 : 0)).toFixed(2);
        return `
            <div class="rank-item">
                <strong>Thiên Tài ${p.title} <span class="version-badge">V.${p.version}</span></strong>
                <div style="color:#2ecc71; font-size:10px; margin-top:4px;">⚡ Công suất: ${iqPower} IQ/sec</div>
                ${p.doi ? `<a href="${p.doi}" target="_blank" class="doi-tag">📄 DOI: Research Link</a>` : ""}
            </div>
        `;
    }).join('');
}

function instantTrade(price, item) {
    if (xuBalance >= price) {
        xuBalance -= price;
        updateUI();
        alert(`SỞ HỮU THÀNH CÔNG: ${item} đang khai thác cho bạn.`);
    } else {
        alert("KHÔNG ĐỦ XU TRƯỜNG.");
    }
}

updateUI();

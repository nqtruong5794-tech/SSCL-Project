let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
const xuDisplay = document.getElementById('xu-balance');
const rankDiv = document.getElementById('dynamic-ranks');

function updateUI() {
    xuDisplay.innerText = xuBalance.toFixed(6);
    localStorage.setItem('xuBalance', xuBalance);
}
updateUI();

// 1. NỘP HỒ SƠ & CHECK CODE
function submitNobel() {
    const title = document.getElementById('p-title').value;
    const latex = document.getElementById('p-latex').value;
    const code = document.getElementById('p-code').value;

    if (!title || !latex.includes('$') || !code.includes('runSSCL')) {
        alert("ISOA-V2026: Hồ sơ không đạt chuẩn (Thiếu LaTeX hoặc hàm runSSCL).");
        return;
    }

    try {
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            xuBalance += 1000;
            updateUI();
            rankDiv.innerHTML = `<div class="rank-item"><span>NEW</span> <strong>Thiên Tài ${title}</strong> <small>Code Passed</small></div>` + rankDiv.innerHTML;
            alert("THÀNH CÔNG: Nhận 1000 Xu cho dự án khả thi!");
        } else {
            alert("LOẠI: Kết quả code không khớp hằng số 5794.");
        }
    } catch (e) {
        alert("LỖI THỰC THI: " + e.message);
    }
}

// 2. GIAO DỊCH 1-CLICK
function instantTrade(price, item) {
    if (xuBalance >= price) {
        xuBalance -= price;
        updateUI();
        rankDiv.innerHTML = `<div class="rank-item" style="color:#2ecc71"><span>BUY</span> <strong>Thiên Tài</strong> sở hữu ${item}</div>` + rankDiv.innerHTML;
        alert(`GIAO DỊCH THÀNH CÔNG: ${item} đã thuộc về bạn.`);
    } else {
        alert("KHÔNG ĐỦ XU TRƯỜNG.");
    }
}

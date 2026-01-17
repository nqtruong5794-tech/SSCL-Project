let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
const btnDemo = document.getElementById('btn-demo');
const timerDisplay = document.getElementById('cooldown-timer');

// Hiển thị số dư ban đầu
document.getElementById('xu-balance').innerText = xuBalance.toFixed(6);

function playDemo() {
    // 1. Cơ chế Cooldown (Chống lạm phát)
    btnDemo.disabled = true;
    let seconds = 60;
    
    // 2. Hiệu ứng Mầm sống phát sáng (Thôi miên)
    document.getElementById('seed').style.boxShadow = "0 0 60px rgba(155, 89, 182, 0.4)";
    
    // 3. Tặng thưởng dựa trên Lực F
    let bonus = 100 + (Math.random() * 10);
    xuBalance += bonus;
    localStorage.setItem('xuBalance', xuBalance);
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(6);

    const countdown = setInterval(() => {
        seconds--;
        timerDisplay.innerText = `SYNCING LỰC F: ${seconds}s`;
        if (seconds <= 0) {
            clearInterval(countdown);
            btnDemo.disabled = false;
            timerDisplay.innerText = "READY TO SYNC";
            document.getElementById('seed').style.boxShadow = "0 10px 40px rgba(0,0,0,0.05)";
        }
    }, 1000);
}

function submitProject() {
    const link = document.getElementById('scientific-link').value;
    if(link.includes('zenodo.org') || link.includes('orcid.org')) {
        alert("ISOA-V2026 XÁC THỰC: Dự án khoa học tiềm năng! Đang chờ hội đồng Trường Core đánh giá để cấp Xu Trường.");
    } else {
        alert("Vui lòng gửi link từ Zenodo hoặc ORCID để chứng minh trí tuệ.");
    }
}

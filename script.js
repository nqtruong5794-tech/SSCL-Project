function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function verifyGenius() {
    const code = document.getElementById('code-core').value;
    const latex = document.getElementById('latex-core').value;
    const title = document.getElementById('project-title').value;

    // 1. Lọc rác tức thì (Out ngay nếu không đạt)
    if (code.length < 50 || !latex.includes('$') || title.length < 5) {
        alert("ISOA-V2026: Trí tuệ chưa đủ sâu. Hồ sơ bị loại bỏ!");
        return;
    }

    // 2. Chạy thử Code chứng minh khả thi
    try {
        // Giả lập kiểm tra logic Framework
        const check = new Function(code);
        check(); 
        
        // 3. Vinh danh & Tặng thưởng
        alert(`THIÊN TÀI ${title.toUpperCase()} ĐÃ ĐƯỢC XÁC THỰC!`);
        xuBalance += 1000; // Thưởng lớn cho bài đạt chuẩn
        localStorage.setItem('xuBalance', xuBalance);
        updateUI();
        
        // Cập nhật bảng vinh danh ảo (tạo cảm giác nghiện)
        const rankDiv = document.getElementById('dynamic-ranks');
        rankDiv.innerHTML = `<div class="rank-item" style="color:#9b59b6"><span>NEW</span> <strong>Thiên Tài ${title}</strong> <small>Just now</small></div>` + rankDiv.innerHTML;
        
    } catch (e) {
        alert("LỖI KHẢ THI: Ý tưởng rất hay nhưng Code không vận hành được. Hãy sửa lại!");
    }
}

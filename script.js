// Khởi tạo bộ nhớ
let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
updateUI();

function updateUI() {
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(6);
}

// HÀM QUAN TRỌNG: NỘP HỒ SƠ NOBEL
function submitNobel() {
    const title = document.getElementById('p-title').value;
    const latex = document.getElementById('p-latex').value;
    const code = document.getElementById('p-code').value;

    // Lọc rác: Nếu thiếu thành phần quan trọng, loại ngay (OUT)
    if (title.length < 5 || !latex.includes('$') || code.length < 50) {
        alert("ISOA-V2026: Hồ sơ thiếu bộ phận hoặc chưa đạt chuẩn Nobel. BỊ LOẠI!");
        return;
    }

    try {
        // Kiểm tra tính khả thi của Code
        const checkCode = new Function(code);
        checkCode();

        // Thưởng Xu ngay lập tức vì đóng góp trí tuệ
        xuBalance += 1000;
        localStorage.setItem('xuBalance', xuBalance);
        updateUI();

        // Vinh danh tức thì
        const rankDiv = document.getElementById('dynamic-ranks');
        rankDiv.innerHTML = `<div class="rank-item" style="color:#9b59b6"><span>NEW</span> <strong>Thiên Tài ${title}</strong> <small>Đã duyệt</small></div>` + rankDiv.innerHTML;
        
        alert("XÁC THỰC THÀNH CÔNG! Bạn nhận được 1000 Xu Trường.");
    } catch (e) {
        alert("LỖI CODE: Dự án không thể vận hành thực tế. Hãy sửa lại!");
    }
}

// HÀM MUA ĐẤT 1-CLICK
function instantTrade(price, id) {
    if (xuBalance >= price) {
        xuBalance -= price;
        localStorage.setItem('xuBalance', xuBalance);
        updateUI();
        alert(`CHÚC MỪNG! Bạn đã sở hữu ${id}. Dữ liệu đã khóa vào ví.`);
    } else {
        alert("KHÔNG ĐỦ XU: Hãy tiếp tục nghiên cứu để nhận thêm Xu Trường.");
    }
}

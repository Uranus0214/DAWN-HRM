// script.js
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userId = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // 使用 SHA256 加密密碼
    const hashedPassword = sha256(password);

    // 替換為您部署的 Google Apps Script 網頁應用程式 URL
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbwhtrEeWELiMuuUJwoLVb1xp_i1UkTtMdFp8w1ljDvU50EDbDmncrkWwUbcfp64G3L4/exec'; 

    try {
        const response = await fetch(appsScriptUrl, {
            method: 'POST',
            mode: 'cors', // 必須設定為 'cors'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                password: hashedPassword
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            messageElement.textContent = `登入成功！歡迎，${data.user.name} (${data.user.role})`;
            messageElement.className = 'message success';
            // 這裡可以導向到不同的頁面，或根據角色顯示不同內容
            // 例如：window.location.href = 'dashboard.html';
            console.log('User Info:', data.user);
            alert(`登入成功！歡迎，${data.user.name} (${data.user.role})`);

            // 根據角色導向不同頁面 (範例)
            if (data.user.role === 'admin') {
                // window.location.href = 'admin_dashboard.html';
            } else if (data.user.role === 'staff') {
                // window.location.href = 'staff_dashboard.html';
            }

        } else {
            messageElement.textContent = `登入失敗: ${data.message}`;
            messageElement.className = 'message';
        }
    } catch (error) {
        messageElement.textContent = `發生錯誤: ${error.message}`;
        messageElement.className = 'message';
        console.error('Error:', error);
    }
});

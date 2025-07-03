// script.js
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userId = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // 使用 SHA256 加密密碼
    const hashedPassword = sha256(password);

    // 替換為您部署的 Google Apps Script 網頁應用程式 URL
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbwBY5KfOulc_ZCn7ILW2fki9yddXDPUk7licKTFw1bcWMkxErBHG_6gdTXuOGUL5xcj/exec'; 

    // 將資料轉換為 URL-encoded 格式
    const formData = new URLSearchParams();
    formData.append('action', 'login'); // 新增 action 參數
    formData.append('user_id', userId);
    formData.append('password', hashedPassword);

    try {
        const response = await fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        const data = await response.json();

        if (data.status === 'success') {
            messageElement.textContent = `登入成功！歡迎，${data.user.name} (${data.user.role})`;
            messageElement.className = 'message success';
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

document.getElementById('createAccountBtn').addEventListener('click', async function() {
    const userId = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    if (!userId || !password) {
        messageElement.textContent = '請輸入帳號和密碼來建立新帳號。';
        messageElement.className = 'message';
        return;
    }

    const hashedPassword = sha256(password);

    // 替換為您部署的 Google Apps Script 網頁應用程式 URL
    const appsScriptUrl = 'YOUR_APPS_SCRIPT_WEB_APP_URL'; 

    const formData = new URLSearchParams();
    formData.append('action', 'createAccount'); // 新增 action 參數
    formData.append('user_id', userId);
    formData.append('password', hashedPassword);
    // 您可以在這裡添加更多欄位，例如 name, email, role 等，讓使用者輸入
    // 例如：formData.append('name', prompt('請輸入您的姓名：'));
    // formData.append('email', prompt('請輸入您的電子郵件：'));
    // formData.append('role', 'staff'); // 預設角色為 staff

    try {
        const response = await fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        const data = await response.json();

        if (data.status === 'success') {
            messageElement.textContent = `帳號建立成功！${data.message}`;
            messageElement.className = 'message success';
        } else {
            messageElement.textContent = `帳號建立失敗: ${data.message}`;
            messageElement.className = 'message';
        }
    } catch (error) {
        messageElement.textContent = `發生錯誤: ${error.message}`;
        messageElement.className = 'message';
        console.error('Error:', error);
    }
});
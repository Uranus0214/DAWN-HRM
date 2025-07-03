
document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIG --- //
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwBY5KfOulc_ZCn7ILW2fki9yddXDPUk7licKTFw1bcWMkxErBHG_6gdTXuOGUL5xcj/exec'; // <--- 請務必替換成您的 Apps Script 網址

    // --- DOM Elements --- //
    const loginView = document.getElementById('login-view');
    const mainView = document.getElementById('main-view');
    const addUserView = document.getElementById('add-user-view'); // 新增
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    
    const navigateToAddUserBtn = document.getElementById('navigate-to-add-user-btn'); // 修改
    const addUserForm = document.getElementById('add-user-form');
    const backToMainBtn = document.getElementById('back-to-main-btn'); // 新增
    const addUserError = document.getElementById('add-user-error');
    const addUserSuccess = document.getElementById('add-user-success');

    // --- Functions --- //

    /**
     * SHA256 加密函數
     * @param {string} string 
     * @returns {string} - a hex string
     */
    function sha256(string) {
        return CryptoJS.SHA256(string).toString(CryptoJS.enc.Hex);
    }

    /**
     * 切換顯示的視圖
     * @param {string} viewId ('login-view' or 'main-view')
     */
    function switchView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
    }

    /**
     * 處理 API 請求
     * @param {string} action 
     * @param {object} payload 
     * @returns {Promise<object>} - a promise that resolves to the response data
     */
    async function apiRequest(action, payload) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Apps Script 的特殊要求
                },
                body: JSON.stringify({ action, payload }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            return { success: false, message: `前端請求失敗: ${error.message}` };
        }
    }

    /**
     * 處理登入邏輯
     */
    async function handleLogin(e) {
        e.preventDefault();
        loginError.textContent = '';
        const userId = loginForm.user_id.value;
        const password = loginForm.password.value;
        const passwordHash = sha256(password);

        const result = await apiRequest('login', { userId, passwordHash });

        if (result.success) {
            alert('登入成功!');
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            updateUserInfo(result.user);
            switchView('main-view');
        } else {
            loginError.textContent = result.message || '登入失敗';
        }
    }
    
    /**
     * 更新使用者資訊顯示
     * @param {object} user 
     */
    function updateUserInfo(user) {
        if (user) {
            userInfo.textContent = `歡迎, ${user.name} (${user.role})`;
            // 根據權限顯示/隱藏按鈕
            if (user.role === 'admin') {
                navigateToAddUserBtn.style.display = 'block';
            } else {
                navigateToAddUserBtn.style.display = 'none';
            }
        } else {
             userInfo.textContent = '';
        }
    }

    /**
     * 處理登出
     */
    function handleLogout() {
        sessionStorage.removeItem('currentUser');
        switchView('login-view');
        loginForm.reset();
    }

    /**
     * 檢查登入狀態
     */
    function checkLoginStatus() {
        const user = sessionStorage.getItem('currentUser');
        if (user) {
            updateUserInfo(JSON.parse(user));
            switchView('main-view');
        } else {
            switchView('login-view');
        }
    }

    /**
     * 處理新增使用者
     */
    async function handleAddUser(e) {
        e.preventDefault();
        addUserError.textContent = '';
        addUserSuccess.textContent = '';

        const userId = document.getElementById('new-user-id').value;
        const name = document.getElementById('new-name').value;
        const password = document.getElementById('new-password').value;
        const email = document.getElementById('new-email').value;
        const role = document.getElementById('new-role').value;
        const passwordHash = sha256(password);

        const result = await apiRequest('addUser', { userId, name, passwordHash, email, role });

        if (result.success) {
            addUserSuccess.textContent = '新增成功! 將在 1.5 秒後返回主畫面。';
            addUserForm.reset();
            setTimeout(() => {
                switchView('main-view');
                addUserSuccess.textContent = ''; // 清空成功訊息
            }, 1500);
        } else {
            addUserError.textContent = result.message || '新增失敗';
        }
    }

    // --- Event Listeners --- //
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    navigateToAddUserBtn.addEventListener('click', () => switchView('add-user-view'));
    backToMainBtn.addEventListener('click', () => switchView('main-view'));
    addUserForm.addEventListener('submit', handleAddUser);

    // --- Initial Load --- //
    checkLoginStatus();
});

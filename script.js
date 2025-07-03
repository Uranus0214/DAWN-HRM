
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

    // --- 新增的 DOM Elements ---
    const userListTbody = document.getElementById('user-list-tbody');
    const refreshUsersBtn = document.getElementById('refresh-users-btn');
    const editUserModal = document.getElementById('edit-user-modal');
    const editUserForm = document.getElementById('edit-user-form');
    const editUserError = document.getElementById('edit-user-error');
    const closeEditModalBtn = editUserModal.querySelector('.close-btn');

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
            // 1. 登入成功後，立即切換畫面
            switchView('main-view');

            // 2. 儲存使用者狀態並更新UI
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            updateUserInfo(result.user);
            
            // 3. 載入員工列表
            loadUsers();
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
            const isAdmin = user.role === 'admin';
            // 根據權限顯示/隱藏按鈕
            navigateToAddUserBtn.style.display = isAdmin ? 'inline-block' : 'none';
            // 未來也可以在這裡控制表格中的編輯/刪除按鈕是否渲染
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
            loadUsers(); // 重新載入頁面時也載入使用者
        } else {
            switchView('login-view');
        }
    }

    /**
     * 載入並渲染使用者列表
     */
    async function loadUsers() {
        const result = await apiRequest('getUsers', {});
        userListTbody.innerHTML = ''; // 清空舊列表
        if (result.success && result.users) {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            const isAdmin = currentUser.role === 'admin';

            result.users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.user_id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td class="actions"></td>
                `;

                // 只有 admin 可以看到編輯和刪除按鈕
                if (isAdmin) {
                    const actionsCell = tr.querySelector('.actions');
                    const editBtn = document.createElement('button');
                    editBtn.textContent = '編輯';
                    editBtn.className = 'action-btn edit-btn';
                    editBtn.onclick = () => openEditModal(user);
                    actionsCell.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '刪除';
                    deleteBtn.className = 'action-btn delete-btn';
                    deleteBtn.onclick = () => deleteUser(user.user_id);
                    actionsCell.appendChild(deleteBtn);
                }

                userListTbody.appendChild(tr);
            });
        }
    }

    /**
     * 開啟編輯 Modal
     * @param {object} user 
     */
    function openEditModal(user) {
        editUserError.textContent = '';
        document.getElementById('edit-user-id').value = user.user_id;
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-role').value = user.role;
        editUserModal.style.display = 'flex';
    }

    function closeEditModal() {
        editUserModal.style.display = 'none';
    }

    /**
     * 處理編輯表單提交
     */
    async function handleEditUser(e) {
        e.preventDefault();
        const userId = document.getElementById('edit-user-id').value;
        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;
        const role = document.getElementById('edit-role').value;

        const result = await apiRequest('updateUser', { userId, name, email, role });

        if (result.success) {
            alert('更新成功!');
            closeEditModal();
            loadUsers(); // 重新載入列表
        } else {
            editUserError.textContent = result.message || '更新失敗';
        }
    }

    /**
     * 刪除使用者
     * @param {string} userId 
     */
    async function deleteUser(userId) {
        if (confirm(`確定要刪除使用者 ${userId} 嗎？此操作無法復原。`)) {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (userId === currentUser.userId) {
                alert("不能刪除自己！");
                return;
            }

            const result = await apiRequest('deleteUser', { userId });
            if (result.success) {
                alert('刪除成功!');
                loadUsers(); // 重新載入列表
            } else {
                alert(`刪除失敗: ${result.message}`);
            }
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
    backToMainBtn.addEventListener('click', () => {
        switchView('main-view');
        loadUsers(); // 返回主畫面時也重新整理
    });
    addUserForm.addEventListener('submit', handleAddUser);
    refreshUsersBtn.addEventListener('click', loadUsers);
    editUserForm.addEventListener('submit', handleEditUser);
    closeEditModalBtn.addEventListener('click', closeEditModal);

    // 點擊 modal 外部關閉
    window.addEventListener('click', (event) => {
        if (event.target == editUserModal) {
            closeEditModal();
        }
    });

    // --- Initial Load --- //
    checkLoginStatus();
});

// 创建登录弹窗的HTML结构
function createLoginDialog() {
    const dialogContainer = document.createElement('div');
    dialogContainer.id = 'loginDialog';
    dialogContainer.style.display = 'none';
    dialogContainer.innerHTML = `
        <div class="login-overlay">
            <div class="login-content">
                <h2>登录窗口</h2>
                <div class="input-group">
                    <input type="text" id="username" placeholder="用户名" />
                </div>
                <div class="input-group">
                    <input type="password" id="password" placeholder="密码" />
                </div>
                <button id="loginButton">登录</button>
            </div>
        </div>
        <style>
            .login-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            .login-content {
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                width: 300px;
            }

            .login-content h2 {
                margin: 0 0 20px;
                text-align: center;
                color: #333;
            }

            .input-group {
                margin-bottom: 15px;
            }

            .input-group input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }

            #loginButton {
                width: 100%;
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }

            #loginButton:hover {
                background-color: #45a049;
            }

            .shake {
                animation: shake 0.5s;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        </style>
    `;

    document.body.appendChild(dialogContainer);
}

// 显示登录弹窗
function showLoginDialog() {
    const dialog = document.getElementById('loginDialog');
    if (!dialog) {
        createLoginDialog();
        setupLoginHandlers();
        // 添加ESC键关闭功能
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideLoginDialog();
            }
        });
        document.getElementById('loginDialog').style.display = 'block';
    } else {
        dialog.style.display = 'block';
    }
}

// 隐藏登录弹窗
function hideLoginDialog() {
    const dialog = document.getElementById('loginDialog');
    if (dialog) {
        dialog.style.display = 'none';
        // 清空输入框
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

// 设置登录处理程序
function setupLoginHandlers() {
    const loginButton = document.getElementById('loginButton');
    const loginContent = document.querySelector('.login-content');

    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // 调用验证函数
        const isValid = await window.validateLogin(username, password);

        if (isValid) {
            hideLoginDialog();
            // 设置登录状态
            sessionStorage.setItem('isLoggedIn', 'true');
            // 触发登录成功事件，传递fromDebugButton参数
            const event = new CustomEvent('loginSuccess', {
                detail: window.loginDialogParams || {}
            });
            document.dispatchEvent(event);
            // 清除临时参数
            window.loginDialogParams = null;
        } else {
            // 显示抖动效果
            loginContent.classList.add('shake');
            setTimeout(() => {
                loginContent.classList.remove('shake');
            }, 500);
        }
    });
}

// 导出函数
window.showLoginDialog = showLoginDialog;
window.hideLoginDialog = hideLoginDialog;
// 创建加载提示弹窗的HTML结构
function createLoadingDialog() {
    const dialogContainer = document.createElement('div');
    dialogContainer.id = 'loadingDialog';
    dialogContainer.style.display = 'none';
    dialogContainer.innerHTML = `
        <div class="loading-overlay">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">正在处理，请稍后..</div>
            </div>
        </div>
        <style>
            .loading-overlay {
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

            .loading-content {
                background-color: white;
                padding: 20px 40px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            .loading-spinner {
                width: 30px;
                height: 30px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loading-text {
                color: #333;
                font-size: 14px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.appendChild(dialogContainer);
}

// 显示加载提示弹窗
function showLoadingDialog() {
    const dialog = document.getElementById('loadingDialog');
    if (!dialog) {
        createLoadingDialog();
        document.getElementById('loadingDialog').style.display = 'block';
    } else {
        dialog.style.display = 'block';
    }
}

// 隐藏加载提示弹窗
function hideLoadingDialog() {
    const dialog = document.getElementById('loadingDialog');
    if (dialog) {
        dialog.style.display = 'none';
    }
}

// 导出函数
window.showLoadingDialog = showLoadingDialog;
window.hideLoadingDialog = hideLoadingDialog;
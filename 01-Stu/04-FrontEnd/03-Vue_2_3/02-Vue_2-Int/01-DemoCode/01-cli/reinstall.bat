@echo off
echo 🔄 正在重新安装依赖...
rmdir /s /q node_modules
del /f /q package-lock.json
npm cache clean --force
npm install
echo ✅ 依赖重新安装完成！
pause
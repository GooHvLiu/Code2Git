# 必须包含widgets模块（Qt5/Qt6中QWidget/QDialog都在这个模块里）
QT       += core gui widgets

# 启用C++11及以上标准（可选，但建议加）
CONFIG   += c++11

# 生成的可执行文件名称（可自定义）
TARGET = DialogTest
# 项目类型为应用程序
TEMPLATE = app

# 源文件列表（确保你的main.cpp在里面）
SOURCES += main.cpp

# 禁用Qt旧版兼容警告（可选）
DEFINES += QT_DEPRECATED_WARNINGS

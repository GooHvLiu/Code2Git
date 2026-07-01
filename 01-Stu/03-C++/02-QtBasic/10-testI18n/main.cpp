#include "mainw.h"
#include<QTranslator>

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    QTranslator translator;
    // 核心修改：资源路径 = :/ + 资源前缀 + / + qm文件名
    // 加载中文：:/translations/zh_CN.qm
    // 加载英文：:/translations/en_US.qm
    if (translator.load(":/translations/zh_CN.qm")) {
        a.installTranslator(&translator); // 安装翻译器，多语言生效
    } else {
        // 可选：加载失败时打印提示，方便调试
        qDebug() << "资源中的qm文件加载失败！检查路径/资源文件配置";
    }
    MainW w;
    w.show();
    return a.exec();
}

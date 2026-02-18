#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

// ------------ MdiChild类的前置声明 ------------
class MdiChild; // 核心：仅声明“存在MdiChild这个类”，不包含其实现/成员
class QMdiSubWindow; //核心：仅声明“存在QMdiSubWindow这个类”，不包含其实现/成员
class QSignalMapper;//核心：仅声明“存在QSignalMapper这个类”，不包含其实现/成员

QT_BEGIN_NAMESPACE
namespace Ui {
class MainWindow;
}
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_actionNew_triggered();
    void updateMenus();
    MdiChild *createMdiChild();//创建子窗口
    void setActiveSubWindow(QWidget *window);//设置活动子窗口
    void on_actionOpen_triggered();
    void updateWindowMenu();//更新窗口菜单

    void on_actionSave_triggered();

private:
    Ui::MainWindow *ui;
    //间隔器，将来在窗口菜单中显示子窗口列表时，可以用它与前面的菜单动作分隔开。
    QAction *actionSeparator;
    //活动窗口
    MdiChild *activeMdiChild();
    //查找子窗口
    QMdiSubWindow *findMdiChild(const QString &fileName);
    //添加子窗口列表中需要的信号映射器
    QSignalMapper *windowMapper;//信号映射器
};
#endif // MAINWINDOW_H

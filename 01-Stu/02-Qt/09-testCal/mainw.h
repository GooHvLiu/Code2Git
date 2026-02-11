#ifndef MAINW_H
#define MAINW_H

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui {
class MainW;
}
QT_END_NAMESPACE

class MainW : public QMainWindow
{
    Q_OBJECT

public:
    MainW(QWidget *parent = nullptr);
    ~MainW();

private slots:
    void on_btn_1_clicked();

    void on_btn_2_clicked();

    void on_btn_3_clicked();

    void on_btn_4_clicked();

    void on_btn_5_clicked();

    void on_btn_6_clicked();

    void on_btn_7_clicked();

    void on_btn_8_clicked();

    void on_btn_9_clicked();

    void on_btn_0_clicked();

    void on_btn_Point_clicked();

    void on_btn_Clear_clicked();

    void on_btn_Add_clicked();

    void on_btn_Sub_clicked();

    void on_btn_Mul_clicked();

    void on_btn_Divid_clicked();

    void on_btn_Calc_clicked();

private:
    Ui::MainW *ui;
    QString operandStr1;  //用于存储字符串形式的左操作数
    QString operatorStr;  //用于存储操作符
};
#endif // MAINW_H

#ifndef TESTGUIDEMYWIDGET_H
#define TESTGUIDEMYWIDGET_H

#include <QWidget>
#include<QLineEdit>
#include<QPushButton>
#include<QSignalMapper>

class testGuideMyWidget : public QWidget
{
    Q_OBJECT                                               //表示支持信号槽机制

public:
    testGuideMyWidget(QWidget *parent = nullptr);
    ~testGuideMyWidget();

private:
    QLineEdit lineEdit;
    QPushButton btn1,btn2,btn3;
    QSignalMapper *mapper;
    QLineEdit *edit1,*edit2;

public slots:
    void enterPressedSlot();                              //输入自定义槽
    void specialStrSlot(QString);                         //测试自定义信号使用

signals:
    void specialStrSig(QString);                          //输入自定义槽
};
#endif // TESTGUIDEMYWIDGET_H

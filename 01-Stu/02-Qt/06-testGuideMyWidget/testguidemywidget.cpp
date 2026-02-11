#include "testguidemywidget.h"
#include<QMessageBox>
#include<QString>

testGuideMyWidget::testGuideMyWidget(QWidget *parent)
    : QWidget(parent),lineEdit(this),btn1(this),btn2(this),btn3(this)
{
    this->resize(400,300);
    //测试自定义槽👇👇👇👇👇👇👇👇
    edit1=new QLineEdit(this);
    edit2=new QLineEdit(this);
    edit1->move(200,10);
    edit2->move(200,50);
    connect(edit1,SIGNAL(returnPressed()),this,SLOT(enterPressedSlot()));
    connect(this,SIGNAL(specialStrSig(QString)),this,SLOT(specialStrSlot(QString)));//测试自定义信号和自定义槽
    //测试自定义槽👆👆👆👆👆👆👆👆

    lineEdit.move(10,10);
    btn1.move(10,30);
    btn2.move(10,50);
    btn3.move(10,70);
    lineEdit.setText("我是单行文本框");
    btn1.setText("清除");
    btn2.setText("设置一段文字");
    btn3.setText("关闭窗口");

    QObject::connect(&btn1,SIGNAL(clicked()),&lineEdit,SLOT(clear()));
    QObject::connect(&btn3,SIGNAL(clicked()),this,SLOT(close()));

    //首先要明确一个关键兼容性问题：QSignalMapper 在 Qt 5 中已被标记为过时（Deprecated），Qt 6 中直接被移除（你的项目是 Qt 6.10.1，这段代码无法编译运行），企业开发中已不再使用，推荐用Lambda 表达式替代（更简洁、类型安全、无需额外对象）。
    mapper=new QSignalMapper;
    QObject::connect(&btn2,SIGNAL(clicked()),mapper,SLOT(map()));
    mapper->setMapping(&btn2,"我是一行文字");
    QObject::connect(mapper,SIGNAL(mapped(const QString&)),&lineEdit,SLOT(setText(const QString&)));
}

//测试自定义槽👇👇👇👇👇👇👇
void testGuideMyWidget::enterPressedSlot()
{
    QString str=edit1->text();
    edit2->setText("输入为："+str);
    //取消关联方式
    //edit1->disconnect();
    if(str=="lgh")
    {
        emit specialStrSig(str);
        //QMessageBox::information(this,"祝贺1","你找到了彩蛋："+str);
    }
}

//测试自定义信号👇👇👇👇👇👇👇
void testGuideMyWidget::specialStrSlot(QString str)
{
    QMessageBox::information(this,"祝贺","你找到了彩蛋："+str);
}

testGuideMyWidget::~testGuideMyWidget()
{
    delete mapper;
}

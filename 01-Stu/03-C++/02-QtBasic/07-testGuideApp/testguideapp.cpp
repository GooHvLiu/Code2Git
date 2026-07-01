#include "testguideapp.h"
#include "ui_testguideapp.h"
#include<QMessageBox>

testGuideApp::testGuideApp(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::testGuideApp)
{
    ui->setupUi(this);
}

testGuideApp::~testGuideApp()
{
    delete ui;
}

void testGuideApp::on_btn1_clicked()
{
    QMessageBox::information(this,"提示","你点击了确定按钮");
}


void testGuideApp::on_btn2_clicked()
{
    QMessageBox::information(this,"提示","你点击了取消按钮");
}


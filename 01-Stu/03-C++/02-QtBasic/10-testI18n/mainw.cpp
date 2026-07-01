#include "mainw.h"
#include "ui_mainw.h"

MainW::MainW(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainW)
{
    ui->setupUi(this);
}

MainW::~MainW()
{
    delete ui;
}

void MainW::on_btn1_clicked()
{
    ui->lineEdit->setText(QObject::tr("You have pressed PushButton01"));
}


void MainW::on_btn2_clicked()
{
    ui->lineEdit->setText(tr("You have pressed PushButton02")); //由于自定义Widget()类继承自QWidget，而QWidget继承自QObject,因此tr()函数也是自定义Widget类中的静态成员函数
}


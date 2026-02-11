#include "mainw.h"
#include "ui_mainw.h"
#include "sortedarr.h"
#include <QInputDialog>
#include <QMessageBox>

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

//数字输入框的相关槽代码
void MainW::on_digitSpinBox_editingFinished()
{
    int number=ui->digitSpinBox->value();
    sortedArr<int> intArr(number);                      //创建一个包含number个整形数据的排序数组

    ui->digitListWidget->clear();                       //清空列表

    for(int i=0;i<number;i++)                           //输入数据到排序数组
    {
        int inputValue=QInputDialog::getInt(nullptr,"输入","第"+QString::number(i+1)+"个整型数：",0);
        intArr.insert(inputValue);
    }

    for(int i=0;i<number;i++)                           //显示到digitListWidget
    {
        ui->digitListWidget->addItem(QString::number(intArr.at(i)));
    }
}




void MainW::on_strSpinBox_editingFinished()
{
    int number=ui->strSpinBox->value();
    sortedArr<QString> strArr(number);                      //创建一个包含number个字符串的排序数组

    ui->strListWidget->clear();                             //清空列表

    for(int i=0;i<number;i++)                               //输入数据到排序数组
    {
        QString inputStr=QInputDialog::getText(this,"输入","第"+QString::number(i+1)+"个整型字符串：");
       strArr.insert(inputStr);
    }

    for(int i=0;i<number;i++)                               //显示到strListWidget
    {
        ui->strListWidget->addItem(strArr.at(i));
    }
}


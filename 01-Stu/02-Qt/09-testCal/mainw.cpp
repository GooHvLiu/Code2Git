#include "mainw.h"
#include "ui_mainw.h"

MainW::MainW(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainW)
{
    ui->setupUi(this);

    operandStr1="";   //对存储的字符串进行初始化
    operatorStr="";   //对存储的操作符进行初始化

}

MainW::~MainW()
{
    delete ui;
}

void MainW::on_btn_1_clicked()      //按键1的点击实现
{
    ui->lineEditInput->setText(ui->lineEditInput->text()+"1");  //当用户按下键盘1时，将画面中输入窗口中的字符串后面增加1
}


void MainW::on_btn_2_clicked()      //按键2的点击实现
{
    ui->lineEditInput->setText(ui->lineEditInput->text()+"2");//当用户按下键盘2时，将画面中输入窗口中的字符串后面增加2
}


void MainW::on_btn_3_clicked()      //按键3的点击实现
{
    ui->lineEditInput->setText(ui->lineEditInput->text()+"3");//当用户按下键盘3时，将画面中输入窗口中的字符串后面增加3
}


void MainW::on_btn_4_clicked()      //按键4的点击实现
{
    ui->lineEditInput->setText(ui->lineEditInput->text()+"4");//当用户按下键盘4时，将画面中输入窗口中的字符串后面增加4
}


void MainW::on_btn_5_clicked()      //按键5的点击实现
{
    ui->lineEditInput->setText(ui->lineEditInput->text()+"5");//当用户按下键盘5时，将画面中输入窗口中的字符串后面增加5
}


void MainW::on_btn_6_clicked()      //按键6的点击实现
{
    ui->lineEditInput->setText(ui->lineEditInput->text()+"6");//当用户按下键盘6时，将画面中输入窗口中的字符串后面增加6
}


void MainW::on_btn_7_clicked()      //按键7的点击实现
{
    ui->lineEditInput->setText(ui->lineEditInput->text()+"7");//当用户按下键盘7时，将画面中输入窗口中的字符串后面增加7
}


void MainW::on_btn_8_clicked()      //按键8的点击实现
{
    ui->lineEditInput->setText(ui->lineEditInput->text()+"8");//当用户按下键盘8时，将画面中输入窗口中的字符串后面增加8
}


void MainW::on_btn_9_clicked()      //按键9的点击实现
{
    ui->lineEditInput->setText(ui->lineEditInput->text()+"9");//当用户按下键盘9时，将画面中输入窗口中的字符串后面增加9
}


void MainW::on_btn_0_clicked()      //按键0的点击实现
{
    if(ui->lineEditInput->text()!="0")  //如果目前输入是0时，不能出现00的现象
    {
        ui->lineEditInput->setText(ui->lineEditInput->text()+"0");//当用户按下键盘0时，将画面中输入窗口中的字符串后面增加0
    }

}


void MainW::on_btn_Point_clicked()      //按键.的点击实现
{
    if(ui->lineEditInput->text()=="")   //如果输入框内什么都没有的情况下
    {
        ui->lineEditInput->setText("0.");   //在空的情况下输入.,默认整数部分为0
    }
    else if (ui->lineEditInput->text().contains("."))   //如果输入框内包含了.,那么多输入的.会被忽略
    {

    }
    else
    {
        ui->lineEditInput->setText(ui->lineEditInput->text()+".");  //排除所有异常后，就是正常按.的操作
    }
}


void MainW::on_btn_Clear_clicked()      //按键clear的点击实现
{
    ui->lineEditInput->clear(); //点击清空时，将所有内容清空
}


void MainW::on_btn_Add_clicked()    //加法+运算符实现代码
{
    if(ui->lineEditInput->text()=="")   //点击+按键时，用户没有输入任何数字，则不做任何处理
    {

    }
    else if(operandStr1=="")    //在用户输入不为空的情况下，保存左运算数的临时字符串为空，则，说明，当前的数字为左运算值
    {
        operandStr1=ui->lineEditInput->text();  //将输入给到operandStr1
        operatorStr="+";    //operatorStr设定为+
        ui->lineEditInput->clear(); //并将lineEditInput内的
        ui->lineEditShow->setText(operandStr1+operatorStr); //将左运算值和运算符显示在运算过程显示界面中
    }
}


void MainW::on_btn_Sub_clicked()    //减法-运算符实现代码
{
    if(ui->lineEditInput->text()=="")   //点击-按键时，用户没有输入任何数字，则不做任何处理
    {

    }
    else if(operandStr1=="")    //在用户输入不为空的情况下，保存左运算数的临时字符串为空，则，说明，当前的数字为左运算值
    {
        operandStr1=ui->lineEditInput->text();  //将输入给到operandStr1
        operatorStr="-";    //operatorStr设定为-
        ui->lineEditInput->clear(); //并将lineEditInput内的
        ui->lineEditShow->setText(operandStr1+operatorStr); //将左运算值和运算符显示在运算过程显示界面中
    }
}


void MainW::on_btn_Mul_clicked()    //乘法x运算符实现代码
{
    if(ui->lineEditInput->text()=="")   //点击x按键时，用户没有输入任何数字，则不做任何处理
    {

    }
    else if(operandStr1=="")    //在用户输入不为空的情况下，保存左运算数的临时字符串为空，则，说明，当前的数字为左运算值
    {
        operandStr1=ui->lineEditInput->text();  //将输入给到operandStr1
        operatorStr="x";    //operatorStr设定为-
        ui->lineEditInput->clear(); //并将lineEditInput内的
        ui->lineEditShow->setText(operandStr1+operatorStr); //将左运算值和运算符显示在运算过程显示界面中
    }
}


void MainW::on_btn_Divid_clicked()    //除法÷运算符实现代码
{
    if(ui->lineEditInput->text()=="")   //点击÷按键时，用户没有输入任何数字，则不做任何处理
    {

    }
    else if(operandStr1=="")    //在用户输入不为空的情况下，保存左运算数的临时字符串为空，则，说明，当前的数字为左运算值
    {
        operandStr1=ui->lineEditInput->text();  //将输入给到operandStr1
        operatorStr="÷";    //operatorStr设定为-
        ui->lineEditInput->clear(); //并将lineEditInput内的
        ui->lineEditShow->setText(operandStr1+operatorStr); //将左运算值和运算符显示在运算过程显示界面中
    }
}


void MainW::on_btn_Calc_clicked()   //=运算符的实现代码
{
    if(operandStr1!=""&&ui->lineEditInput->text()!=""&&operatorStr!="") //左运算值，右运算值，运算符都同时不为空的情况下
    {
        double result;  //申请定义临时结果存储
        double operand1=operandStr1.toDouble();    //左运算值保存
        double operand2=ui->lineEditInput->text().toDouble();  //右运算值保存
        if(operatorStr=="+")
        {
            result=operand1+operand2;   //两个数相加
        }

        else if(operatorStr=="-")
        {
            result=operand1-operand2;   //两个数相减
        }

        else if(operatorStr=="÷")
        {
            if(operand2!=0.0)
            {
                result=operand1/operand2;   //两个数相除
            }
            else
            {
                ui->lineEditShow->setText("除数不能为零");
                result=0;

            }

        }

        else if(operatorStr=="x")
        {
            result=operand1*operand2;   //两个数相乘
        }

        if(operatorStr=="÷"&&operand2==0.0) //如果是除法，并且除数是0，不做任何处理
        {

        }

        else
        {
                ui->lineEditShow->setText(ui->lineEditShow->text()+QString::number(operand2)+"="+QString::number(result)); //将doulbe格式的result通过QString::number方法转换为字符串

        }

        operandStr1="";     //计算完毕后，清空左操作值
        operatorStr="";     //计算完毕后，清空运算符
        ui->lineEditInput->clear();     //将输入栏清空
    }
}


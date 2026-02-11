#include "logindialog.h"
#include "ui_logindialog.h"
#include "QMessageBox"

LoginDialog::LoginDialog(QWidget *parent)
    : QDialog(parent)
    , ui(new Ui::LoginDialog)
{
    ui->setupUi(this);
}

LoginDialog::~LoginDialog()
{
    delete ui;
}

void LoginDialog::on_btnLogin_clicked()
{
    if(ui->lineEditName->text()=="admin"&&ui->lineEditPassword->text()=="123456")
    {
        emit(LoggedIn());       //emit 是Qt 专属关键字，核心作用是触发 / 发射 Qt 信号，是激活信号的唯一合法方式；
        hide();                 //隐藏登录窗口
    }
    else
    {
        QMessageBox::information(this,"提示","用户名或密码错误");
    }
}


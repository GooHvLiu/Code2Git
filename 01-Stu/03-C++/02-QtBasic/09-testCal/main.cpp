#include "mainw.h"
#include "logindialog.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    MainW w;
    LoginDialog login(&w);
    login.show();
    QObject::connect(&login,SIGNAL(LoggedIn()),&w,SLOT(show()));
    return a.exec();
}

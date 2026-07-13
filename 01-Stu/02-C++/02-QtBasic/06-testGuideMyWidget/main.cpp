#include "testguidemywidget.h"

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    testGuideMyWidget w;
    w.show();
    return a.exec();
}

#include "testguideapp.h"

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    testGuideApp w;
    w.show();
    return a.exec();
}

#ifndef TESTGUIDEAPP_H
#define TESTGUIDEAPP_H

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui {
class testGuideApp;
}
QT_END_NAMESPACE

class testGuideApp : public QMainWindow
{
    Q_OBJECT

public:
    testGuideApp(QWidget *parent = nullptr);
    ~testGuideApp();

private slots:
    void on_btn1_clicked();

    void on_btn2_clicked();

private:
    Ui::testGuideApp *ui;
};
#endif // TESTGUIDEAPP_H

#ifndef MAINW_H
#define MAINW_H

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui {
class MainW;
}
QT_END_NAMESPACE

class MainW : public QMainWindow
{
    Q_OBJECT

public:
    MainW(QWidget *parent = nullptr);
    ~MainW();

private slots:
    void on_digitSpinBox_editingFinished();

    void on_strSpinBox_editingFinished();

private:
    Ui::MainW *ui;
};
#endif // MAINW_H

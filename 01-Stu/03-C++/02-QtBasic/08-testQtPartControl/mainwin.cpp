#include "mainwin.h"
#include "ui_mainwin.h"

MainWin::MainWin(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWin)
{
    ui->setupUi(this);
    //this->setSizeGripEnabled(false);
}

MainWin::~MainWin()
{
    delete ui;
}

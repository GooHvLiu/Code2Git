#include <QApplication>                      //应用程序类，管理GUI程序的控制流和主要设置
#include <QWidget>                           //基本窗口类QWidget
#include <QDialog>                           //对话框类QDialog
#include <QDebug>                            //打印信息类QDebug
#include <QCursor>                          //使用Qt::UpArrowCursor
#include <QLabel>                           //标签类
#include <QPushButton>                      //按钮类
#include <QLineEdit>                        //单行文本框类
#include <QTextEdit>                        //多行文本框类
#include <QFont>

int main(int argc,char* argv[])
{
    // //1）创建一个基本窗口QWidget
    // QApplication a1(argc,argv);              //GUI程序必须有且只有一个该类的对象

    // QWidget w1;                              //创建窗口对象实例
    // w1.setWindowTitle("我是QWidget标题");     //设置标题
    // w1.resize(300,200);                      //设置用户区大小
    // w1.move(30,60);                          //移动窗口位置
    // w1.setCursor(Qt::UpArrowCursor);         //设置光标为向上箭头
    // w1.show();                               //显示基本窗口

    // qDebug()<<w1.pos()<<w1.x()<<w1.y();
    // qDebug()<<w1.frameGeometry();
    // qDebug()<<w1.geometry();

    // return a1.exec();                        //在exec函数，程序进入消息循环，等待可能的输入进行响应

    // //2）创建一个对话框类QDialog
    // QApplication a2(argc,argv);              //GUI程序必须有且只有一个该类的对象

    // QDialog w2;                              //创建窗口对象实例
    // w2.setWindowTitle("我是QDialog标题");     //设置标题
    // w2.resize(300,200);                      //设置用户区大小
    // w2.move(360,360);                        //移动窗口位置
    // w2.setCursor(Qt::UpArrowCursor);         //设置光标为向上箭头
    // w2.show();                               //显示基本窗口

    // qDebug()<<w2.pos()<<w2.x()<<w2.y();
    // qDebug()<<w2.frameGeometry();
    // qDebug()<<w2.geometry();

    // return a2.exec();                        //在exec函数，程序进入消息循环，等待可能的输入进行响应

    // //3）模态与非模态对话框的详细说明与案例
    // /*
    //  **模态对话框：是指在该窗口没有关闭前，用户无法与该程序的其他窗口交互，模态对话框一般通过exec()和setMoal(bool modal)来实现；
    //  **非模态对话框：是指用户既能与该窗口交互，也能与该程序的其他窗口交付；
    //  */
    // QApplication a3(argc,argv);                                  //GUI程序必须有且只有一个该类的对象

    // QDialog dial1,dial2;                                            //创建2个对话框窗口验证模态
    // dial1.setWindowTitle("我是对话框1，我是模态exec");                 //其中一个模态通过exec函数实现
    // dial1.exec();                                                   //exec函数，只有将其关闭才能继续后面的动作流程

    // dial2.setModal(true);                                           //setModal设置为1，实现模态功能
    // dial2.setWindowTitle("我是对话框2，我是模态setModal");             //其中一个模态通过setModal实现
    // dial2.resize(200,100);
    // dial2.show();                                                   //setModal的实现不影响后面的动作流程的实现，但是用户无法操作

    // QWidget w3;
    // w3.setWindowTitle("我是基本窗口，我藏在对话框2后面，你抓不到我");     //我的存在只是为了验证setModal的实现是不影响后面流程的进行，但是用户无法操作，只有关闭setModal对应的窗口才能操作
    // w3.show();

    // return a3.exec();                                               //在exec函数，程序进入消息循环，等待可能的输入进行响应

    // //4）只阻塞自己的主窗口和副窗口，但是不阻塞应用程序的其他窗口
    // QApplication a4(argc,argv);                                        //GUI程序必须有且只有一个该类的对象
    // QWidget w4,w5;                                                     //创建了2个基本窗口
    // w4.setWindowTitle("我是基本窗口1");
    // w4.show();
    // w5.setWindowTitle("我是基本窗口2");
    // w5.move(100,100);
    // w5.show();

    // QDialog dial3(&w4);                                                //创建了一个对话框，并将w4的地址传递给了dial3，表明w4作为dial3的副窗口
    // dial3.setWindowTitle("我是对话框");
    // dial3.resize(200,100);
    // dial3.setWindowModality(Qt::WindowModal);                          //Qt::WindowModal为枚举常量，表明dial3只阻塞它的副窗口
    // dial3.show();
    // return a4.exec();

    // //5）简单常用部件类
    // QApplication a5(argc,argv);

    // QWidget w6;
    // w6.resize(400,300);

    // //标签
    // QLabel label(&w6);
    // label.setText("我是一个标签");//设置显示的文本
    // label.move(10,10);//移动位置，使用用户区坐标系

    // //按钮
    // QPushButton btn(&w6);
    // btn.move(200,10);
    // btn.setText("我是一个按钮");

    // //单行文本框
    // QLineEdit lineEdit(&w6);
    // lineEdit.move(10,50);
    // lineEdit.setText("我是单行文本框");
    // lineEdit.setFocus();

    // //多行文本框
    // QTextEdit textEdit(&w6);
    // textEdit.move(10,100);
    // textEdit.setText("我是多行文本框");

    // w6.show();
    // return a5.exec();

    //6）对简单控件的字体和颜色进行设置
    QApplication a6(argc,argv);

    QWidget w7;
    w7.resize(400,300);

    //标签
    QLabel label(&w7);
    label.setText("我是一个标签");//设置显示的文本
    label.move(10,10);//移动位置，使用用户区坐标系

    //按钮
    QPushButton btn(&w7);
    btn.move(200,10);
    btn.setText("我是一个按钮");

    //单行文本框
    QLineEdit lineEdit(&w7);
    lineEdit.move(10,50);
    lineEdit.setText("我是单行文本框");
    lineEdit.setFocus();

    //多行文本框
    QTextEdit textEdit(&w7);
    textEdit.move(10,100);
    textEdit.setText("我是多行文本框");

    //设置字体
    QFont font;//字体类
    font.setPointSize(18);//设置大小为18像素
    font.setFamily("隶书");//设置字体为隶书
    font.setItalic(true);//设置为斜体
    w7.setFont(font);//应用到窗口（包括所有子部件），也可单独应用于一个子部件

    //设置颜色
    QPalette plt;
    plt.setColor(QPalette::WindowText,Qt::red);//设置前景（文字）颜色
    plt.setColor(QPalette::Window,QColor(0,255,0));//设置背景为绿色，采用另外一种定义色的方式

    //标签使用了调色板设置颜色
    label.setPalette(plt);
    label.setAutoFillBackground(true);//须设置自动填充背景才能显示背景颜色

    //按钮和单行文本框使用了样式表设置颜色
    btn.setStyleSheet("background-color:blue");
    lineEdit.setStyleSheet("color:blue");

    //多行文本框自带设置颜色的成员函数，还支持HTML格式
    textEdit.setTextColor(Qt::red);
    textEdit.append("我可以设置颜色");//追加文字
    textEdit.append("<font color='green'>这是HTML格式的文字</font>");

    w7.show();
    return a6.exec();

}

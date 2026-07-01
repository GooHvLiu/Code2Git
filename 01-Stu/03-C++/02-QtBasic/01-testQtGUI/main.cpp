/**********************************************
 *项目名：01-testQtGUI
 *说明：一个最简单的，基于Qt的用户界面程序
 *********************************************/
#include<QApplication>  //应用程序类的头文件，该类管理GUI程序的控制流和主要设置
#include<QWidget>       //基本窗口类的头文件
#include "timeTest.h"
#include <iostream>
using namespace std;
//1）创建一个时间类文件用于测试
void usingTimeTest()
{
    timeTest getUpTime;
    timeTest arrivalTime,departureTime;

    cout<<"Size of getUpTime is ："<<sizeof(getUpTime)<<"byte"<<endl;

    cout<<"getUpTime is:";
    getUpTime.showTime();

    getUpTime.setTime(6,30,0);
    cout<<"getUpTime is:";
    getUpTime.showTime();
    //getUpTime.hour=3;

    departureTime.setTime(6,70,-3);
    cout<<"departureTime is:";
    departureTime.showTime();

    arrivalTime.setTime(6,70,-3);
    cout<<"arrivalTime is:";
    arrivalTime.showTime();

}

int main(int argc,char * argv[]) //Qt应用程序的入口函数
{
    //使用1）时间类文件用于测试
    usingTimeTest();

    //*****************以下为创建一个空白窗口用语测试的程序*******************//
    QApplication a(argc,argv);  //GUI程序必须有且只能有一个该类的对象
    QWidget w;                  //创建窗口对象实例
    w.show();                   //显示窗口
    return a.exec();            //在exec()函数，进入事件循环，等待可能的输入并进行相应return b.exec();
}



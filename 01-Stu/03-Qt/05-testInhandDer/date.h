/***********************************************************
 * 项目名：testInhandDer(继承与派生)
 * 文件名：data.h
 * 说  明：日期类
 * *******************************************************/
#ifndef DATA_H
#define DATA_H

#include <iostream>
using namespace std;

class date
{
    int year,month,day;
public:
    date(int yr,int mon=1,int d=1):year{yr},month{mon},day{d}       //date的带三个参数的构造函数
    {
        cout<<"Constructor of Date.Date的三个参数的构造函数。"<<endl;
    }
    ~date()                                                         //date的析构函数
    {
        cout<<"Destructor of Date.Date的析构函数。"<<endl;
    }
    void showDate()                                                 //date类中的shouDate函数
    {
        cout<<"Date: "<<month<<","<<day<<","<<year<<endl;
    }
};
#endif // DATA_H

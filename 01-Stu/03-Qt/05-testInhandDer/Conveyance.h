/********************************************
 * 项目名：testInhandDer(继承与派生)
 * 文件名：conveyance.h
 * 说  明：交通工具类
 * ****************************************/
#ifndef CONVEYANCE_H
#define CONVEYANCE_H

#include<iostream>
#include "date.h"
using namespace std;

class conveyance
{
    date manuDate;                              //生产日期
    double speed;                               //时速

public:
    conveyance(int yr,double spd):manuDate{yr},speed{spd}           //conveyance的两个带参构造函数
    {
        cout<<"Constructor of conveyance.conveyance的两个参数的构造函数。"<<endl;
    }

    ~conveyance()
    {
        cout<<"Destructor of conveyance.conveyance的析构函数。"<<endl;
    }

    double getSpeed()
    {
        return speed;
    }

    void showInfo()
    {
        cout<<"Speed per hour: "<<speed<<endl;
    }
};
#endif // CONVEYANCE_H

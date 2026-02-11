/*********************************************************************
 * 项目名：testInhandDer(继承与派生)
 * 文件名：ship.h
 * 说  明：船类,虚继承自conveyance
 * ******************************************************************/
#ifndef SHIP_H
#define SHIP_H
#include "conveyance.h"
#include<iostream>
using namespace std;

class ship:virtual public conveyance                                //船类，继承conveyance的虚基类
{
    double draught;     //船的吃水深度
public:
    ship(int yr,int spd,double drt):conveyance(yr,spd),draught(drt)
    {
        cout<<"Constructor of ship."<<endl;
    }

    ~ship()
    {
        cout<<"Destructor of ship."<<endl;
    }

    double getDraught()
    {
        return draught;
    }

    void showInfo()
    {
        conveyance::showInfo();
        cout<<"Ship draught: "<<draught<<endl;
    }
};




#endif // SHIP_H

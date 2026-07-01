/*********************************************************************
 * 项目名：testInhandDer(继承与派生)
 * 文件名：motorhome.h
 * 说  明：房车类,基于虚基类的原因，修改了构造函数
 * ******************************************************************/
#ifndef MOTORHOME_H
#define MOTORHOME_H

#include "house.h"
#include "car.h"
#include<iostream>
using namespace std;

class motorhome:public car,public house                 //房车类
{
    int waterReserve;                                   //储水量

public:
    motorhome(int yr,int spd,int hr,int wN,double a,int wR):conveyance(yr,spd),car(yr,spd,hr,wN),house(a),waterReserve(wR)
    {
        cout<<"Constructor of motorhome."<<endl;        //motorhome的构造函数
    }
    ~motorhome()
    {
         cout<<"Destructor of motorhome."<<endl;        //motorhome的析构函数
    }

    int getWaterReserve()
    {
        return waterReserve;
    }

    void showInfo()
    {
        car::showInfo();
        house::showInfo();
        cout<<"Water reserve:"<<waterReserve<<endl;
    }

};
#endif // MOTORHOME_H

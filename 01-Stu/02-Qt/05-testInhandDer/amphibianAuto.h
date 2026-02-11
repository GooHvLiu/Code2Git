/*********************************************************************
 * 项目名：testInhandDer(继承与派生)
 * 文件名：amphibianAuto.h
 * 说  明：水陆两栖车类
 * ******************************************************************/
#ifndef AMPHIBIANAUTO_H
#define AMPHIBIANAUTO_H
#include<iostream>
#include "car.h"
#include"ship.h"
using namespace std;

class amphibianAuto:public car,public ship                                          //水陆两栖车类
{
    int retractorType;                                                              //车轮收放放置类型编号

public:
    amphibianAuto(int yr,int spd,int hr,int wN,double drt,int rT):conveyance(yr,spd),car(yr,spd,hr,wN),ship(yr,spd,drt),retractorType(rT)
    {
        cout<<"Constructor of amphibianAuto."<<endl;
    }

    ~amphibianAuto()
    {
        cout<<"Destruotor of amphibianAuto."<<endl;
    }

    int getType()
    {
        return retractorType;
    }

    void showInfo()
    {
        car::showInfo();
        ship::showInfo();
        cout<<"Retractor type: "<<retractorType<<endl;
    }
};

#endif // AMPHIBIANAUTO_H

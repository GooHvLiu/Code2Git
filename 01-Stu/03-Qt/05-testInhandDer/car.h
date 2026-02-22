/*********************************************************************
 * 项目名：testInhandDer(继承与派生)
 * 文件名：car.h
 * 说  明：汽车类,虚继承自conveyance
 * ******************************************************************/
#ifndef CAR_H
#define CAR_H
#include "time.h"
#include "conveyance.h"
using namespace std;

class car:virtual public conveyance                                     //汽车类,使用virtual,表示conveyance为虚基类，被多个类共同继承
{
    time testTime;                                              //系统每日自检的时间
    int wheelsNum;                                              //车轮数

public:
    car(int yr,int spd,int hr,int wN):conveyance(yr,spd),testTime(hr),wheelsNum(wN)
    {
        cout<<"Constructor of car."<<endl;                      //car的构造函数
    }

    ~car()
    {
        cout<<"Destructor of car."<<endl;                      //car的析构函数
    }

    int getWheelsNum()
    {
        return wheelsNum;
    }

    void showInfo()
    {
        conveyance::showInfo();
        cout<<"Number of wheels: "<<wheelsNum<<endl;
    }
};

#endif // CAR_H

/*********************************************************************
 * 项目名：testInhandDer(继承与派生)
 * 文件名：main.cpp
 * 说  明：派生类中构造函数和析构函数的调用顺序
 * ******************************************************************/

#include <iostream>
#include"motorhome.h"
#include"amphibianauto.h"
using namespace std;

int main()
{
    motorhome mh(2019,100,23,6,8,20);

    amphibianAuto ampauto(2020,100,23,8,1.5,2);
    return 0;
}

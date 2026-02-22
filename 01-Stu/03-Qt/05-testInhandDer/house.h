/*********************************************************************
 * 项目名：testInhandDer(继承与派生)
 * 文件名：house.h
 * 说  明：房子类
 * ******************************************************************/
#ifndef HOUSE_H
#define HOUSE_H

#include<iostream>
using namespace std;

class house
{
    double area;
public:
    house(double a):area{a}
        {
            cout<<"Constructor of house."<<endl;            //house 一个参数的构造函数
        }
        ~house()
        {
            cout<<"Destrctor of house."<<endl;              //house的析构函数
        }

        double getArea()
        {
            return area;
        }

        void showInfo()
        {
            cout<<"Area of house."<<area<<endl;
        }
};

#endif // HOUSE_H

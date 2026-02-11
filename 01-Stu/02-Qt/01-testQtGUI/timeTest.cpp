#include "timeTest.h"
#include<iostream>
using namespace std;

timeTest::timeTest():hour{0},minute{0},second{0}
{
    cout<<"Constructor is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

timeTest::timeTest(int h):hour{h},minute{0},second{0}
{
    cout<<"Constructor with 1 paramter is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

timeTest::timeTest(int h,int m,int s):hour{h},minute{m},second{s}
{
    cout<<"Constructor with 3 paramter is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

timeTest::timeTest(timeTest &obj)
{
    hour=obj.hour;
    minute=obj.minute;
    second=obj.second;
    cout<<"Copy Constructor is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

timeTest::~timeTest()
{
    cout<<"Destructor is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

void timeTest::setTime(int h,int m,int s)
{
    if(h>24)
        hour=24;
    else if(h<0)
        hour=0;
    else
        hour=h;

    if(m>59)
        minute=59;
    else if(m<0)
        minute=0;
    else
        minute=m;

    if(s>59)
        second=59;
    else if(m<0)
        second=0;
    else
        second=s;
}

void timeTest::showTime()
{
    cout<<"当前时间："<<hour<<":"<<minute<<":"<<second<<endl;
}

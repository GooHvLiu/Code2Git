#include "time.h"
#include<iostream>
using namespace std;

time::time():hour{0},minute{0},second{0}
{
    cout<<"Constructor is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

time::time(int h):hour{h},minute{0},second{0}
{
    cout<<"Constructor with 1 paramter is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

time::time(int h,int m,int s):hour{h},minute{m},second{s}
{
    cout<<"Constructor with 3 paramter is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

time::time(time &obj)
{
    hour=obj.hour;
    minute=obj.minute;
    second=obj.second;
    cout<<"Copy Constructor is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

time::~time()
{
     cout<<"Destructor is Called. I'm "<<hour<<":"<<minute<<":"<<second<<endl;
}

void time::setTime(int h,int m,int s)
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

void time::showTime()
{
    cout<<"Current Time is: "<<hour<<":"<<minute<<":"<<second<<endl;
}

/***********************************************************
 * 项目名：testInhandDer(继承与派生)
 * 文件名：time.h
 * 说  明：时间类
 * *******************************************************/
#ifndef TIMETEST_H
#define TIMETEST_H

//以下为设定头文件，头文件不做执行细节，只是在头文件进行类的定位，这样，使用者只需要在此进行查看即可使用
class time
{
    int hour;
    int minute;
    int second;
public:
    time();
    time(int h);
    time(int h,int m,int s=0);
    time(time & obj);
    ~time();
    void setTime(int h,int m,int s);
    void showTime();
};
#endif // TIMETEST_H

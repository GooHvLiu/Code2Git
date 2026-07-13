#ifndef TIMETEST_H
#define TIMETEST_H

//以下为设定头文件，头文件不做执行细节，只是在头文件进行类的定位，这样，使用者只需要在此进行查看即可使用
class timeTest
{
    int hour;
    int minute;
    int second;
public:
    timeTest();
    timeTest(int h);
    timeTest(int h,int m,int s=0);
    timeTest(timeTest & obj);
    ~timeTest();
    void setTime(int h,int m,int s);
    void showTime();
};
#endif // TIMETEST_H

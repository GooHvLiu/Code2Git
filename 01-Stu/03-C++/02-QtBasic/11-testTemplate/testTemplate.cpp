/***************************************************
 * 项目名：测试模板
 * 说  明：函数模板及其使用
 * ************************************************/
#include <QDebug>

template <class T>                                  //创建函数模板
void swapValue(T& x,T&y)
{
    T temp;
    temp=x;
    x=y;
    y=temp;
}

template <class T>
void swapValue(T& x,T& y,T& z)                      //模板重载
{
    T temp;
    temp=x;
    x=y;
    y=z;
    z=temp;
}
/***************************************************
 * 原因：测试时，取消注解
int main(int argc,char * argv[])                    //主函数
{
    int intA=1,intB=2;
    swapValue(intA,intB);
    qDebug()<<intA<<","<<intB<<";";

    double doubleA=1.1,doubleB=2.2,doubleC=3.3;
    swapValue(doubleA,doubleB,doubleC);
    qDebug()<<doubleA<<","<<doubleB<<","<<doubleC<<";";

    QChar qcharA('a'),qcharB('b');
    swapValue(qcharA,qcharB);
    qDebug()<<qcharA<<","<<qcharB<<";";
}
*/

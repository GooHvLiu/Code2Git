/***************************************************
 * 项目名：测试模板
 * 说  明：函数模板及其使用
 * ************************************************/
#include <QDebug>
#include<QChar>

template <typename T,int size>
void ascendSort(T elements[])
{
    T temp;
    for(int i=0;i<size-1;i++)
        for(int j=0;j<size-1;j++)
            if(elements[j]>elements[j+1])
            {
                temp=elements[j];
                elements[j]=elements[j+1];
                elements[j+1]=temp;
            }
}

int main(int,char *[])
{
    int intArr[5]={3,4,1,2,5};
    ascendSort<int,5>(intArr);
    qDebug()<<intArr[0]<<","<<intArr[1]<<","<<intArr[2]<<","<<intArr[3]<<","<<intArr[4]<<";";

    QChar qcharArr[5]={'z','c','e','m','d'};
    ascendSort<QChar,5>(qcharArr);
    qDebug()<<qcharArr[0]<<","<<qcharArr[1]<<","<<qcharArr[2]<<","<<qcharArr[3]<<","<<qcharArr[4]<<";";
}

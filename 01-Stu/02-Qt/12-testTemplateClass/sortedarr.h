/****************************************************************
 * 项目名：类模板的测试
 * 文件名：sortedarr.h
 * 说 明：动态排序数组类模板sortedArr的定义
 * *************************************************************/
#ifndef SORTEDARR_H
#define SORTEDARR_H

//创建类模板
template <class T>
class sortedArr
{
public:
    sortedArr(int max=1);
    ~sortedArr();
    T at(int pos);                                  //返回第i个数据
    void insert(T value);                           //插入一个数据

private:
    int size,maxSize;                               //size为当前已存储数据个数，maxSize为最大能存储数据个数
    T* data;                                       //指向数据的指针
};

//用于类模板的初始化定义
template <class T>
sortedArr<T>::sortedArr(int max):size(0),maxSize(max)
{
    data=new T[max];
}

//析构函数中，将动态申请的数组删除，释放空间
template <class T>
sortedArr<T>::~sortedArr()
{
    delete[] data;
}

//用于将新填加的数据插入排序好的队列
template <class T>
void sortedArr<T>::insert(T value)
{
    data[size++]=value;
    T temp;

    for(int i=size-1;i>0;i--)                   //将新填加的数据插入排序好的队列
        if(data[i-1]>data[i])
        {
            temp=data[i-1];
            data[i-1]=data[i];
            data[i]=temp;
        }

}

//用于将数组中现有指定位置的元素返回
template <class T>
T sortedArr<T>::at(int pos)                 //用于返回当前数组中指定位置的元素
{
    return data[pos];
}

#endif // SORTEDARR_H

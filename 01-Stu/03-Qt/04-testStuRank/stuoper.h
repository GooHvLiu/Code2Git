/*************************************************************************
 * 项目名：学生成绩排名（测试）
 * 文件名：stuoper.h
 * 说  明：StuOper类的定义
 * **********************************************************************/
#ifndef STUOPER_H
#define STUOPER_H

#include"student.h"

class stuoper
{
public:
    stuoper();
    ~stuoper();
    int getStuNum();
    void quickSortByEng(int left,int right);            //快速排序法
    void shellSortByMath();                             //希尔排序
    void exchangeSortByCpp();                           //交换排序
    void insertSortByAll();                             //直接插入排序
    QStringList toStringList();

private:
    student *students;
    int studentNumber;
};
#endif // STUOPER_H

/**********************************************************************************
 * 项目名：testStuRank（学生成绩排名）
 * 文件名：stuoper.cpp
 * 说  明：StuOper类的实现
 * *******************************************************************************/

#include "stuoper.h"
#include <QInputDialog>
#include<QMessageBox>

stuoper::stuoper()
{
    studentNumber=QInputDialog::getInt(nullptr,"提示","请输入学生人数：",1,1);
    students=new student[studentNumber];
    for(int i=0;i<studentNumber;i++)
    {
        students[i].input(i+1);
    }
}

stuoper::~stuoper()
{
    delete[] students;
}

int stuoper::getStuNum()
{
    return studentNumber;
}

void stuoper::quickSortByEng(int left,int right)          //用快速排序法按照英语成绩排序
{
    if(left<right)
    {
        int i=left,j=right;
        student tempStudent=students[left];
        while(i<j)
        {//从右向左找第1个大于temp英语成绩的学生
            while(i<j&&students[j].getEnglishScore()<=tempStudent.getEnglishScore())
                j++;
            if(i<j)
                students[i++]=students[j];
         //从左向右找第1个小于或等于tempStudent英语成绩的学生
            while(i<j&&students[i].getEnglishScore()>tempStudent.getEnglishScore())
                i++;
            if(i<j)
                students[j--]=students[i];
        }
        students[i]=tempStudent;
        quickSortByEng(left,i-1);//递归调用
        quickSortByEng(i++,right);
    }
}

void stuoper::shellSortByMath()                          //用希尔排序法按数学成绩排序
{
    student tempStudent;
    int iPos;
    int d=studentNumber;                                //增量的初始值
    do
    {
        d=d/3+1;
        for(int i=d;i<=studentNumber;i++)
        {
            tempStudent=students[i];
            iPos=i-d;
            while(iPos>=0&&students[iPos].getMathScore()<tempStudent.getMathScore())
            {//实现增量为d的插入排序
                students[iPos+d]=students[iPos];
                iPos-=d;
            }
            students[iPos+d]=tempStudent;

        }
    }
    while(d>1);
}

void stuoper::exchangeSortByCpp()                       //用交换排序法按C++成绩排序
{
    student temp;
    for(int i=0;i<studentNumber;i++)                    //共排序stuNumber-1轮，每轮得到一个最大值
    {
        for(int j=i+1;j<studentNumber;j++)
        {
            if(students[j].getCppScore()>students[i].getAllScore())
            {   //每次从剩下的成绩中寻找大最大值，与当前最大值相比，如果更大则交换
                temp=students[i];
                students[i]=students[j];
                students[j]=temp;
            }
        }
    }
}

void stuoper::insertSortByAll()                         //用直接插入排序法按总成绩排序
{
    student temp;
    int iPos;
    for(int i=0;i<studentNumber;i++)
    {
        temp=students[i];                               //保存当前要插入的学生
        iPos=i-1;                                       //被插入的数组下标
                                                        //从最后一个（最小值）开始比较，小于当前要插入元素的向后移位
        while(iPos>=0&&students[iPos].getAllScore()<temp.getAllScore())
        {
            students[iPos+1]=students[iPos];
            iPos--;
        }
        students[iPos+1]=temp;                          //插入相应位置
    }
}

QStringList stuoper::toStringList()
{
    QStringList strList;
    for(int i=0;i<studentNumber;i++)                   //将所有信息输出到屏幕
        strList.append(students[i].toString());
    return strList;
}

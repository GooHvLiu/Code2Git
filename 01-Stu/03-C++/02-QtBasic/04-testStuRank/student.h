/*********************************************************************************
 * 项目名：学生成绩排名（测试）
 * 文件名：Student.h
 * 说  明：Student类的定义
 * ******************************************************************************/
#ifndef STUDENT_H
#define STUDENT_H
#include <QString>

//定义Student类
class student
{
    QString stuNo;//学生的学号
    QString name;//学生的名字
    int englishScore;//英语成绩
    int mathScore;//数学成绩
    int cppScore;//c++成绩

public:
    student(QString No="000000",QString nm="",int englishS=0,int mathS=0,int cppS=0);
    void input(unsigned idx=0);//输入学生信息
    QString toString();//学生信息转换为字符串
    QString getStuNo(){return stuNo;}
    QString getName(){return name;}

    int getEnglishScore(){return englishScore;}
    int getMathScore(){return mathScore;}
    int getCppScore(){return cppScore;}
    int getAllScore(){return englishScore+mathScore+cppScore;}

    void setStuNo(QString No){stuNo=No;}
    void setName(QString name){this->name=name;}
    void setEnglishScore(int englishS){englishScore=englishS;}
    void setMathScore(int mathS){mathScore=mathS;}
    void setCppScore(int cppS){cppScore=cppS;}
};

#endif // STUDENT_H

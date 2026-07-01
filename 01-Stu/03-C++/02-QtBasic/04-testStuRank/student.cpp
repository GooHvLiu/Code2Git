/*******************************************************************
 * 项目名：testStuRank（学生成绩排名）
 * 文件名：student.h
 * 说  明：student类的实现
 * ****************************************************************/

#include "student.h"
#include <QInputDialog>

student::student(QString No,QString nm,int englishS,int mathS,int cppS):stuNo{No},name{nm},englishScore{englishS},mathScore{mathS},cppScore{cppS}
{

}

void student::input(unsigned idx)
{
    stuNo=QInputDialog::getText(nullptr,"the"+QString::number(idx)+"th student","Please enter your student ID:");
    name=QInputDialog::getText(nullptr,"the"+QString::number(idx)+"th student","Please enter your name:");
    englishScore=QInputDialog::getInt(nullptr,"the"+QString::number(idx)+"th student","Please enter your English score:");
    mathScore=QInputDialog::getInt(nullptr,"the"+QString::number(idx)+"th student","Please enter your math score:");
    cppScore=QInputDialog::getInt(nullptr,"the"+QString::number(idx)+"th student","Please enter your cpp score:");

}

QString student::toString()
{
    QString res;
    res=stuNo+'\t'+name+'\t'+QString::number(englishScore)+'\t'+QString::number(mathScore)+'\t'+QString::number(cppScore)+'\t'+QString::number(getAllScore());
    return res;
}

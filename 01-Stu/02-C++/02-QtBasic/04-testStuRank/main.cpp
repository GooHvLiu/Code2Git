/**********************************************************************************
 * 项目名：testStuRank（学生成绩排名）
 * 文件名：main.cpp
 * 说  明：主函数的实现
 * *******************************************************************************/

#include "stuoper.h"
#include <QApplication>
#include<QWidget>
#include<QTextEdit>
#include<QLabel>

int main(int argc,char* argv[])
{
    QApplication a(argc,argv);
    QWidget w;
    w.resize(540,600);
    w.setWindowTitle("Student Score Ranking and Display");

    stuoper stus;

    QLabel label1("The student information entered by the user: ",&w);
    label1.move(20,10);
    QTextEdit edit1(&w);
    edit1.move(20,30);
    edit1.resize(500,80);
    edit1.append("学号\t 姓名\t 英语\t 数学\t C++\t 总成绩");
    edit1.append(QString(80,'-'));
    for(int i=0;i<stus.getStuNum();i++)
    {
        edit1.append(stus.toStringList().at(i));
    }

    stus.shellSortByMath();
    QLabel label2("Sort in descending order of math scores: ",&w);
    label2.move(20,130);
    QTextEdit edit2(&w);
    edit2.move(20,150);
    edit2.resize(500,80);
    edit2.append("学号\t 姓名\t 英语\t 数学\t C++\t 总成绩");
    edit2.append(QString(80,'-'));
    for(int i=0;i<stus.getStuNum();i++)
    {
        edit2.append(stus.toStringList().at(i));
    }

    stus.quickSortByEng(0,stus.getStuNum()-1);
    QLabel label3("Sort in descending order of English scores: ",&w);
    label3.move(20,250);
    QTextEdit edit3(&w);
    edit3.move(20,270);
    edit3.resize(500,80);
    edit3.append("学号\t 姓名\t 英语\t 数学\t C++\t 总成绩");
    edit3.append(QString(80,'-'));
    for(int i=0;i<stus.getStuNum();i++)
    {
        edit3.append(stus.toStringList().at(i));
    }

    stus.exchangeSortByCpp();
    QLabel label4("Sort in descending order of C++ scores: ",&w);
    label4.move(20,370);
    QTextEdit edit4(&w);
    edit4.move(20,390);
    edit4.resize(500,80);
    edit4.append("学号\t 姓名\t 英语\t 数学\t C++\t 总成绩");
    edit4.append(QString(80,'-'));
    for(int i=0;i<stus.getStuNum();i++)
    {
        edit4.append(stus.toStringList().at(i));
    }

    stus.insertSortByAll();
    QLabel label5("Sort in descending order of Total scores: ",&w);
    label5.move(20,490);
    QTextEdit edit5(&w);
    edit5.move(20,510);
    edit5.resize(500,80);
    edit5.append("学号\t 姓名\t 英语\t 数学\t C++\t 总成绩");
    edit5.append(QString(80,'-'));
    for(int i=0;i<stus.getStuNum();i++)
    {
        edit5.append(stus.toStringList().at(i));
    }

    /********************
     * 以下为测试程序使用
     * *****************/
    // QLabel testLabel("1窗口正常弹出！",&w);
    // testLabel.move(200,280);
    // w.show();
    return a.exec();
}

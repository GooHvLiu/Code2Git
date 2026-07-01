#include <iostream>
#include <stdio.h>
using namespace std;
// 类定义
class Person
{ 
public:
    
    int getAge()
    {
        return m_Age;
    }

    Person() {}//使用无参构造函数进行初始化变量 

    Person(int Age) :m_Age(Age) {}//使用1个参数进行构造函数进行初始化变量

    //成员函数实现 + 号运算符重载，函数返回值类型为Person，使用函数形式
    Person operator+(Person& P)
    {
        Person temp;
        temp.m_Age=this->m_Age+P.m_Age;
        return temp;//此处需要进行深拷贝，因为temp是局部变量，函数结束后，会自动释放，如果此处返回的是引用，则不会进行深拷贝，会返回一个临时变量，导致程序异常

    }

    ~Person() {}//类的析构函数
private:   
    int m_Age;
};

void test01()
{
    Person P1(18);
    Person P2(20);
    Person P3;
    P3= P1.operator+(P2);//也可以写为P3=P1+P2
    cout << "P3的年龄为：" << P3.getAge() << endl;

    Person P4;
    P4 = P1 + P2 + P3;//+重载之后可以和+运算符进行连续运算P4=P1.operator+(P2.operator+(P3));
    cout << "P4的年龄为：" << P4.getAge() << endl;
}

int main()
{
    test01();//调用测试函数01
    system("pause");
    return 0;
}



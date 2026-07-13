#include <iostream>
#include <string>
using namespace std;

class Person
{
public:

	// 私有化成员变量
	int getA()
	{
		return m_A;
	}

	int getB()
	{
		return m_B;
	}

	Person(int a, int b)
	{
		m_A = a;
		m_B = b;
	}

	Person() {}

	~Person() {}

private:
	int m_A;
	int m_B;
};

//使用全局函数进行左移运算符重载，因为左移运算符重载只能使用全局函数
ostream& operator<<(ostream& cout, Person& p)
{
	cout<<p.getA()<<" "<<p.getB()<<endl;
	return cout;
}

void test01()
{
	Person P1(10, 20);
	operator<<(cout, P1);//可以写为这种格式，也可以写成如下格式
	cout<< P1 << endl;//还可以写成：P1.operator<<(cout,P1)
}

int main()
{
	test01();
	system("pause");
	return 0;
}
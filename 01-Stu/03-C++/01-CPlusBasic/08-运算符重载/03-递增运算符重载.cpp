#include <iostream>
#include <string>
using namespace std;

class myInterger
{
public:
	//友元函数声明
	friend ostream& operator<<(ostream& cout, myInterger myInt);

	//前置++重载函数
	myInterger operator++()
    {
		m_i++;
        return *this;
    }

	//后置++重载函数
	myInterger operator++(int)
	{
		myInterger temp=*this;//为什么是*this呢，是因为this本身是一个指针，所以要解引用
		this->m_i++;
		return temp;
	}

	myInterger(int i )
    {
        m_i = i;
    }
	~myInterger()
    {
    }
	
private:
	int m_i;
};
//左移运算符重载
ostream& operator<<(ostream& cout, myInterger myInt)
{
	cout << myInt.m_i;
    return cout;
}

//前置++ 先++ 再返回
void test01()
{
	myInterger myInt(10);
	cout << ++myInt << endl;
	cout<< myInt << endl;
}

//后置++ 先返回 再++
void test02()
{
	myInterger myInt(20);
	cout << myInt++ << endl;
	cout << myInt << endl;
}

int main()
{
	test01();//前置++
	test02();//后置++
	system("pause");
	return 0;
}
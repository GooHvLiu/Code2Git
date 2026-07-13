#pragma once
#include <string>
#include <iostream>
using namespace std;

//职工的抽象类，职工分为普通职工、经理和老板三种类型
class Worker 
{
public:
	virtual void showInfo() = 0;//显示职工信息

	virtual string getDeptName() = 0;//获取职工部门名称

	int m_Id;//职工编号

	string m_Name;//职工姓名

	int m_DeptId;//职工部门编号
};

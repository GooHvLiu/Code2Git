#pragma once
#include <string>
#include <iostream>
#include "worker.h"
using namespace std;

class Employee:public Worker
{
public:
	//构造函数
	Employee(int id, string name, int dId);

	//显示职工信息
	virtual void showInfo() ;

	//获取职工部门名称
	virtual string getDeptName() ;
	
};
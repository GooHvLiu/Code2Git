#pragma once
#include <string>
#include<iostream>
#include <fstream>
#include "worker.h"
#define FILENAME "empFile.txt"//定义存储职工信息的文件名称
using namespace std;

class WorkerManager
{
public:
	//构造函数
	WorkerManager();

	//显示选择菜单功能
	void showMenu();

	//0-退出系统功能
	void exitSystem();

	//1-增加职工功能
	void add_Emp();

	//1.1 增加职工功能之保存职工
	void save_Emp();

	//1.2 增加职工功能之统计人数
	int get_EmpNum();

	//1.3 增加职工功能之本地保存数据存在，并初始化数据
	void initEmp();

	//2-显示职工功能
	void show();

	//3-删除职工功能
	void del_Emp();

	//3.1 删除职工之查找是否存在职工
	int isExist(int id);

	//4-修改职工功能
	void mod_Emp();

	//5-查找职工功能
	void find_Emp();

	//6-排序功能
	void Sort_Emp();

	//7-清空功能
	void clear_Emp();

	//析构函数
	~WorkerManager();

	//记录文件中的人员个数
	int m_EmpNum;

	//职工数组的指针
	Worker ** m_EmpArray;

	//标志文件是否为空
	bool m_FileIsEmpty;

};

#include <iostream>
#include <string>
using namespace std;
#include "workerManager.h"
#include "employee.h"
#include "manager.h"
#include "boss.h"
#include "worker.h"

////测试多态是否成功
//void test01()
//{
//	Worker* worker = NULL;
//	worker = new Employee(1, "张三", 1);
//	worker->showInfo();
//	delete worker;
//
//	worker = new Manager(2, "李四", 2);
//	worker->showInfo();
//	delete worker;
//
//	worker = new boss(3, "王五", 3);
//	worker->showInfo();
//	delete worker;
//}

int main()
{
	//test01();测试多态

	WorkerManager wm;
	int choice = -1;
	while (true)
	{
		wm.showMenu();//显示界面

		cout << "请输入您的选项：" << endl;

		cin >> choice;//将用户输入的选项存储在choice变量中
		switch (choice)
		{
		case 0://退出系统
			wm.exitSystem();//调用WorkerManager类中的exitSystem()函数来退出系统
			break;

		case 1://增加职工
			wm.add_Emp();//调用WorkerManager类中的add_Emp()函数来增加职工
			break;

		case 2://显示职工
			wm.show();//调用WorkerManager类中的show()函数来显示职工
			break;

		case 3://删除职工
			wm.del_Emp();//调用WorkerManager类中的del_Emp()函数来删除职工
			break;

		case 4://修改职工
			wm.mod_Emp();//调用WorkerManager类中的mod_Emp()函数来修改职工
			break;

		case 5://查找职工
			wm.find_Emp();//调用WorkerManager类中的find_Emp()函数来查找职工
			break;

		case 6://排序职工
			wm.Sort_Emp();//调用WorkerManager类中的Sort_Emp()函数来排序职工
			break;

		case 7://清空职工
			wm.clear_Emp();//调用WorkerManager类中的clear_Emp()函数来清空职工
			break;

		default:
			system("cls");
			break;
		}
	system("cls");//清屏

	}
	system("pause");
    return 0;
}

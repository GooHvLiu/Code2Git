#include "boss.h"
#include "employee.h"
#include "manager.h"
#include "workerManager.h"
#include<fstream>
#include <iostream>
#include<string>
#define  FILENAME "empFile.txt"//定义存储职工信息的文件名称


using namespace std;

//构造函数
WorkerManager::WorkerManager()
{
	//打开之后初始化
	{
		/*
		*首次打开存在3种情况：
		*	1）文件不存在，且是第一次使用，创建文件并且初始化数据
		*	2）文件存在，但没有数据
		*	3）文件存在，并且有数据
		*/

		ifstream ifs;//创建文件流对象
		ifs.open(FILENAME, ios::in);//以输入的方式打开文件

		//1)文件不存在，且是第一次使用，创建文件并且初始化数据
		{
			if (!ifs.is_open())//如果文件没有成功打开
			{
				cout << "文件不存在，且没有数据" << endl;
				this->m_EmpNum = 0;//初始化人数
				this->m_EmpArray = NULL;//初始化职工数组指针
				this->m_FileIsEmpty = true;//标志文件为空
				ifs.close();
				return;
			}

		}

		//2)文件存在，但没有数据
		{
			char ch;
			ifs >> ch;//从文件中读取一个字符
			if (ifs.eof())//如果读取到文件末尾，说明文件没有数据
			{
				cout << "文件存在，但没有数据" << endl;
				this->m_EmpNum = 0;//初始化人数
				this->m_EmpArray = NULL;//初始化职工数组指针
				this->m_FileIsEmpty = true;//标志文件为空
				ifs.close();
				return;
			}
		}

		//3)文件存在，并且有数据
		{
			int num = this->get_EmpNum();//统计文件中的职工人数
			this->m_EmpNum = num;//将统计的职工人数赋值给成员属性

			//将初始指针m_EmpArray指向堆区，开辟一个存储职工对象的数组，大小为统计的职工人数
			this->m_EmpArray = new Worker * [this->m_EmpNum];

			this->initEmp();//初始化职工信息
		}

		//4）测试初始化的读取情况
		/* {
			for(int i=0;i<this->m_EmpNum;i++)
				{
					cout << "职工编号：" << this->m_EmpArray[i]->m_Id
					<< "  职工姓名：" << this->m_EmpArray[i]->m_Name
					<< "  职工岗位：" << this->m_EmpArray[i]->m_DeptId
					<< endl;
				}
			}
		*/
	}
}

//显示选择菜单
void WorkerManager::showMenu()
{
	cout << "********************************************" << endl;
	cout << "*********  欢迎使用职工管理系统！ **********" << endl;
	cout << "*************  0.退出管理程序  *************" << endl;
	cout << "*************  1.增加职工信息  *************" << endl;
	cout << "*************  2.显示职工信息  *************" << endl;
	cout << "*************  3.删除离职职工  *************" << endl;
	cout << "*************  4.修改职工信息  *************" << endl;
	cout << "*************  5.查找职工信息  *************" << endl;
	cout << "*************  6.按照编号排序  *************" << endl;
	cout << "*************  7.清空所有文档  *************" << endl;
	cout << "********************************************" << endl;
	cout << endl;
}

//0-退出系统功能
void WorkerManager::exitSystem()
{
	cout << "欢迎再次使用" << endl;
	system("pause");
	exit(0);//退出系统
}

//1-增加职工功能
void WorkerManager::add_Emp()
{
	//1、与用户进行交互，获取用户输入的职工人数
	cout << "请输入要添加的职工数量：" << endl;
	cout << "【0-退出当前功能】" << endl;
	
	//2、将用户输入的职工数量保存到成员属性中
	int addNum = 0;//创建临时存储成员属性

	cin >> addNum;
	//3、判定用户输入的职工数量是否合法，若≤0，则提示用户输入有误
	
	if (addNum > 0)
	{
		//计算新的数组空间大小
		int newSize = this->m_EmpNum + addNum;

		//4、若≥0，则创建职工数组，大小为用户输入的职工数量
		Worker** newSpace = new Worker * [newSize];

		//5、首先将原有数组内的信息更新到新的数组当中
		if (this->m_EmpArray != NULL)
		{
			for (int i = 0;i < this->m_EmpNum;i++)
			{
				newSpace[i] = this->m_EmpArray[i];
			}
		}

		//6、通过循环语句，将提示用户新输入的职工信息录入到新的数组当中
		for (int i = 0;i < addNum;i++)
		{
			int id;//职工编号
			string name;//职工姓名
			int dSelect;//职工岗位代码

			if (this->m_EmpArray != NULL)
			{
				cout << "请输入第" << i + 1 << "个职工编号：" << endl;
				cin >> id;

				//判断职工编号是否存在，如果存在则提示用户重新输入
				for (int i = 0;i < this->m_EmpNum;i++)
				{
					while (id == this->m_EmpArray[i]->m_Id)
					{
						cout << "职工编号已存在，请重新输入！" << endl;
						cin >> id;
					}
				}
			}
			cout << "请输入第" << i + 1 << "个职工姓名：" << endl;
			cin >> name;
			cout << "请输入该职工的岗位代码：" << endl;
			cout << "1-普通职工" << endl;
			cout << "2-部门经理" << endl;
			cout << "3-公司老板" << endl;
			cin >> dSelect;

			//创建一个职工，目前为空，基于实际情况进行赋予职工属性
			Worker* worker = NULL;

			switch (dSelect)
			{
			case 1:
				//如果输入的是1，说明是普通员工，则将worker指向Employee类的对象
				worker = new Employee(id, name, dSelect);
				break;

			case 2:
				//如果输入的是2，说明是部门经理，则将worker指向Manager类的对象
				worker = new Manager(id, name, dSelect);
				break;

			case 3:
				//如果输入的是3，说明是公司老板，则将worker指向Boss类的对象
				worker = new Boss(id, name, dSelect);
				break;

			default:
				break;
			}

			newSpace[this->m_EmpNum + i] = worker;//将新创建的职工对象指针，保存到新数组当中
		}
		//7、释放原有空间
		delete[] this->m_EmpArray;

		//8、将新的数组的地址赋值给成员属性 m_EmpArray
		this->m_EmpArray = newSpace;

		//9、将新的职工数量赋值给成员属性 m_EmpNum
		this->m_EmpNum = newSize;

		//10、提示用户添加成功，并保存在文件中
		this->save_Emp();//将职工信息保存到文件中
		this->m_FileIsEmpty = false;//标志文件不为空
	}
	
	//输入0表示退出当前功能
	else if (addNum==0)
	{
		return;
	}
	else
	{
		cout << "输入有误，请重新输入！" << endl;
	}
	//用户按任意键继续
	system("pause");
}

//1.1 增加职工功能之保存职工
void WorkerManager::save_Emp()
{
	//1、实例化输出流对象
	ofstream ofs;//创建文件流对象

	//2、打开文件
	ofs.open(FILENAME, ios::out);//以输出的方式打开文件

	if (ofs.is_open())
	{
		cout << "文件打开成功！" << endl;
	}
	else
	{
		cout << "文件打开失败！" << endl;
		return;
	}

	//3、将职工信息写入文件
		for (int i = 0;i < this->m_EmpNum;i++)
		{
			string dept = "";//创建临时存储职工部门信息的变量
			switch (this->m_EmpArray[i]->m_DeptId)
			{
			case 1:
				dept="普通职工";
				break;

			case 2:
				dept = "部门经理";
				break;

			case 3:
				dept = "公司老板";
				break;

			default:
				dept = "未知职工";
				break;
			}
			ofs<<this->m_EmpArray[i]->m_Id<<"  "
				<<this->m_EmpArray[i]->m_Name << "  "
				<< dept << endl;
		}

	//4、关闭文件
	ofs.close();

	cout << "职工信息保存成功！" << endl;
}

//1.2 增加职工功能之统计人数
int WorkerManager::get_EmpNum()
{
	//1 实例化输入流对象
	ifstream ifs;//创建文件流对象
	ifs.open(FILENAME, ios::in);//以输入的方式打开文件

	//2 定义3个变量id,name,dId
	int id;//职工编号
	string name;//职工姓名
	string dep;//职工岗位

	//3 读取文件并做循环，记录数据人员数量
	int num = 0;
	while (ifs >> id && ifs >> name && ifs >> dep)
	{
		num++;
	}

	//4 关闭输入流对象
	ifs.close();

	//5 返回统计的职工人数
	return num;
}

//1.3 增加职工功能之本地保存数据存在，并初始化数据
void WorkerManager::initEmp()
{
	//1 实例化输入流对象
	ifstream ifs;//创建文件流对象
	ifs.open(FILENAME, ios::in);//以输入的方式打开文件

	//2 定义临时变量id，name，dId
	int id;//职工编号
	string name;//职工姓名
	string dep;//职工岗位
	int dId;//职工岗位编号

	//3 循环读取文件中的数据，并根据职工的岗位编号进行创建不同类型的职工对象，将创建的职工对象指针保存到职工数组中
	int index = 0;//创建一个索引，记录职工数组的下标

	while (ifs >> id && ifs >> name && ifs >> dep)
	{
		//通过判定，对dId进行赋值
		{
			if (dep == "普通职工")
			{
				dId = 1;//职工岗位编号
			}
			else if (dep == "部门经理")
			{
				dId = 2;//职工岗位编号
			}
			else if (dep == "公司老板")
			{
				dId = 3;//职工岗位编号
			}

			else
			{
				dId = 0;//职工岗位编号
			}

		}
		Worker* worker = NULL;//创建一个职工，目前为空，基于实际情况进行赋予职工属性
		switch (dId)
		{
		case 1:
			//如果输入的是1，说明是普通员工，则将worker指向Employee类的对象
			worker = new Employee(id, name, dId);
			break;

		case 2:
			//如果输入的是2，说明是部门经理，则将worker指向Manager类的对象
			worker = new Manager(id, name, dId);
			break;

		case 3:
			//如果输入的是3，说明是公司老板，则将worker指向Boss类的对象
			worker = new Boss(id, name, dId);
			break;

		default:
			break;
		}
		this->m_EmpArray[index] = worker;//将创建的职工对象指针，保存到职工数组中
		index++;
	}


}

//2-显示职工功能
void WorkerManager::show()
{
	if (this->m_FileIsEmpty)
	{
		cout << "文件不存在或记录为空！" << endl;
	}
	else
	{
		for (int i = 0;i < this->m_EmpNum;i++)
		{
			this->m_EmpArray[i]->showInfo();//调用职工对象的显示信息函数来显示职工信息
		}
	}
	system("pause");
}

//3-删除职工功能
void WorkerManager::del_Emp()
{
	//1 判断文件是否存在或记录为空
	if (this->m_FileIsEmpty)
	{
		cout << "文件不存在或记录为空！" << endl;
		system("pause");
		return;
	}
	else
	{
		//2 人员输入需要删除的id号
		cout << "请输入需要删除的职工编号：" << endl;
		cout << "【0-退出当前功能】" << endl;
		int id = 0;//创建一个变量，存储用户输入的职工编号
		cin >> id;
		if (id == 0)
		{
			return;
		}
		//3 对系统数据进行操作，删除对应id的职工信息，将后面的数据前移
		int index = this->isExist(id);//调用isExist函数来查找用户输入的职工编号是否存在，返回职工数组的下标
		//4 更新职工总人数
		if (index != -1)
		{
			for (int i = index;i < this->m_EmpNum - 1;i++)
			{
				this->m_EmpArray[i] = this->m_EmpArray[i + 1];
			}
			this->m_EmpNum--;//更新职工总人数

		//5 将删除后的数据保存到文件中
		this->save_Emp();//将职工信息保存到文件中

		//提示用户结果
		cout << "删除成功！" << endl;
				
		}
		else
		{
			cout << "删除失败，未找到该职工！" << endl;
		}
	}
	system("pause");
}

//3.1 删除职工之查找是否存在职工
int WorkerManager::isExist(int id)
{
	int index = -1;//创建一个索引，记录职工数组的下标，初始值为-1，表示没有找到

	for(int i=0;i<this->m_EmpNum;i++)
	{
		if(this->m_EmpArray[i]->m_Id == id)
		{
			index = i;
			break;
		}
	}
	return index;
}

//4-修改职工功能
void WorkerManager::mod_Emp()
{
	if (this->m_FileIsEmpty)
	{
		cout << "文件不存在或记录为空！" << endl;
	}
	else
	{
		//1 先让用户输入需要修改的职工编号
		cout << "请输入需要修改的职工编号：" << endl;
		cout << "【0-退出当前功能】" << endl;
		int id = 0;
		cin >> id;
		if (id == 0)
		{
			return;
		}

		//2 判断该编号是否存在，若不存在，则弹出对话框提示，若存在，则继续操作
		int ref = this->isExist(id);
		if ( ref== -1)
		{
			cout << "修改失败，未找到该职工！" << endl;
			system("pause");
			return;
		}
		else
		{
			//3 输入要修改的内容代码
			//3.1 1-职工编号
			//3.2 2-职工姓名
			//3.3 3-职工岗位
			int selectNo = -1;
			cout << "已查询到该员工信息，请输入需要修改的内容代码：" << endl;
			cout << "1-修改职工编号" << endl;
			cout << "2-修改职工姓名" << endl;
			cout << "3-修改职工岗位" << endl;
			cout << "【0-退出当前功能】" << endl;
			cin >> selectNo;
			if (selectNo == 0)
			{
				return;
			}

			//4 根据用户输入的需要修改的内容代码，修改对应的职工信息
			if (selectNo == 1)
			{
				cout << "请输入更改后的职工编号：" << endl;
				int id = 0;
				cin >> id;

				//判断职工编号是否存在，如果存在则提示用户重新输入
				for (int i = 0;i < this->m_EmpNum;i++)
				{
					while (id == this->m_EmpArray[i]->m_Id)
					{
						cout << "职工编号已存在，请重新输入！" << endl;
						cin >> id;
					}
				}

				this->m_EmpArray[ref]->m_Id = id;//修改职工编号
			}
			else if (selectNo == 2)
			{
				cout << "请输入更改后的职工姓名：" << endl;
				string name="";
				cin >> name;
				this->m_EmpArray[ref]->m_Name = name;//修改职工姓名
			}
			else if (selectNo == 3)
			{
				cout << "请输入更改后的职工岗位：" << endl;
				cout << "1-普通员工" << endl;
				cout << "2-部门经理" << endl;
				cout << "3-公司老板" << endl;
				int dId=-1;
				cin >> dId;
				this->m_EmpArray[ref]->m_DeptId = dId;//修改职工岗位
			}
					
			//5 将修改后的数据保存到文件中
			this->save_Emp();//将职工信息保存到文件中

			cout << "修改成功！" << endl;
			system("pause");

		}
	}
	
}

//5-查找职工功能
void WorkerManager::find_Emp()
{
	if (this->m_FileIsEmpty)
	{
		cout << "文件不存在或记录为空！" << endl;
	}
	else
	{
		cout << "请输入查询方式:" << endl;
		cout << "1-按职工编号查询" << endl;
		cout << "2-按职工姓名查询" << endl;
		cout << "【0-退出当前功能】" << endl;
		int selectNo = -1;
		cin >> selectNo;
		if (selectNo == 0)
		{
			return;
		}

		//如果客户按照职工编号查询
		if (selectNo == 1)
		{
			cout << "请输入查询的职工编号:" << endl;
			int id = 0;

			//ref为-1表示没有找到，其他值表示职工数组的下标，其他即为查找到的位置下标
			int ref = this->isExist(id);
			cout <<"ref:"<< ref << endl;
			if (ref == -1)
			{
				cout << "查找失败，查无此人" << endl;
			}
			else
			{
				cout << "查找成功！该职工信息如下：" << endl;
				this->m_EmpArray[ref]->showInfo();//调用职工对象的显示信息函数来显示职工信息
			}
		}
		//如果客户按照职工姓名查询
		else if (selectNo == 2)
		{
			cout << "请输入查询的职工姓名:" << endl;
			string name = "";
			cin >> name;

			//开始遍历查询名字
			bool flag = false;//创建一个标志，记录是否找到，初始值为false，表示没有找到
			int findNo = 0;
			for (int i = 0;i < this->m_EmpNum;i++)
			{
				if(this->m_EmpArray[i]->m_Name == name)
				{
					cout << "查找成功！该职工信息如下：" << endl;
					this->m_EmpArray[i]->showInfo();//调用职工对象的显示信息函数来显示职工信息
					flag = true;//修改标志，表示找到
					findNo++;//记录找到的个数
				}
				
			}
			if (flag == false)
			{
				cout << "查找失败，查无此人" << endl;
			}
			else
			{
				cout << "共找到" << findNo << "位职工！" << endl;
			}
		}
		else
		{
			cout << "输入选项有误" << endl;
		}
	}

	system("pause");

}

//6-排序功能
void WorkerManager::Sort_Emp()
{
	if (this->m_FileIsEmpty)
	{
		cout << "文件不存在或记录为空！" << endl;
	}
	else
	{
		cout << "请选择排序方式：" << endl;
		cout << "1-按照职工编号升序" << endl;
		cout << "2-按照职工编号降序" << endl;
		cout << "【0-退出当前功能】" << endl;
		int selectNo = -1;
		cin >> selectNo;
		if (selectNo == 0)
		{
			return;
		}

		for (int i = 0;i < this->m_EmpNum - 1;i++)
		{
			int minOrMax = i;//创建一个变量，记录当前找到的最小或最大值的下标，初始值为i

			for (int j = i + 1;j < this->m_EmpNum;j++)
			{
				if (selectNo == 1)
				{
					if (this->m_EmpArray[minOrMax]->m_Id > this->m_EmpArray[j]->m_Id)
					{
						minOrMax = j;//更新最小值的下标
					}
				}
				else if (selectNo == 2)
				{
					if (this->m_EmpArray[minOrMax]->m_Id < this->m_EmpArray[j]->m_Id)
					{
						minOrMax = j;//更新最大值的下标
					}
				}
			}
			if (minOrMax != i)
			{
				Worker* temp = this->m_EmpArray[i];//创建一个临时变量，存储当前元素的指针

				this->m_EmpArray[i] = this->m_EmpArray[minOrMax];//将找到的最小或最大元素的指针，赋值给当前元素

				this->m_EmpArray[minOrMax] = temp;//将当前元素的指针，赋值给找到的最小或最大元素
			}
			
		}
		cout << "排序成功！排序后的结果如下：" << endl;
		this->save_Emp();//将排序后的职工信息保存到文件中
		this->show();//调用显示职工信息函数来显示排序后的职工信息
	}

}

//7-清空功能
void WorkerManager::clear_Emp()
{
	cout<<"确定要清空么，您老？"<<endl;
	cout << "1-确定" <<endl;
	cout << "2-返回" << endl;

	int selectNo = -1;
	cin >> selectNo;

	if (selectNo == 1)
	{
		//1 打开文档 //2 删除文档并新建文档
		ofstream ofs(FILENAME, ios::trunc);
		ofs.close();

		//3 遍历数组，将每个数组的指针清空
		if (this->m_EmpArray != NULL)
		{
			for (int i = 0;i < this->m_EmpNum;i++)
			{
				if (this->m_EmpArray[i] != NULL)
				{
					delete this->m_EmpArray[i];
				}
			}
			//4 将职工人数置0
			this->m_EmpNum = 0;
			//5 删除数组
			delete[] this->m_EmpArray;
			this->m_EmpArray = NULL;
			
			//6 空文件变量为空
			this->m_FileIsEmpty = true;
		}
	}
	system("pause");
}

//析构函数
WorkerManager::~WorkerManager()
{
	//将创建在堆区的职工对象数组指针删除
	if (this->m_EmpArray != NULL)
	{
		delete[] this->m_EmpArray;
		this->m_EmpArray = NULL;
	}
}
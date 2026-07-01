#include <iostream>
using namespace std;
int main() {

	for (int i=0;i<10;i++)
	{
		if (i <= 5)
		{
			cout << "<小于5的值：" << i << "；>" << endl;
			continue;
		}
		else
		{
			cout << "[大于5的值：" << i << "；]" << endl;
			break;
		}
		
	}
	//**************▲for循环▲*************//
	string tempInput{"is you"};

		//cin >> tempInput;
		//cout << "你输入的内容是：" << tempInput << endl;
		while (tempInput=="is you")
		{
			cout << "您输入的内容是:" << tempInput << endl;
			break;
		}
	//**************▲while▲*************//
	string cmdTest = "cd";
	system(cmdTest.c_str());//string.c_str()将string转换为const char*
	cout << ">>";			//模拟等待输入命令行
	cin >> cmdTest;			//接受用户输入的命令
	system(cmdTest.c_str());//执行用户输入的命令

	//同时支持用户输入dir和dir c:等命令
	//判断cin中是否还有数据未取
	cout << "in_avail:" << cin.rdbuf()->in_avail() << endl;//返回缓冲区中未读字符的数量,结果至少还有\n未读
	if (cin.rdbuf()->in_avail()>1)
	{	
		string tmp;
		cin >> tmp;
		cmdTest += " " + tmp;//将用户输入的第二部分命令加到cmdTest后面

	}
	cout << "最终执行的命令是：" << cmdTest << endl;
	system("pause");
	//**************▲开发shell使用system和ci▲*************//
	

	return 0;
}
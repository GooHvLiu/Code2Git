#include <iostream>
#include <string>
using namespace std;
int main() {
	
	//字符串的初始化和赋值
	string str1{ "teststring001" };//const char* 初始化
	cout << "str1 = " << str1 << endl;//打印str1的值
	str1 = "teststring0020000000";//const char* 赋值
	cout << "str1 = " << str1 << endl;//打印str1的值
	string str3;
	cout << "str3的值：" <<str3<< endl;
	//---------▲▲01零基础_01 夏曹俊 零基础到工程实战_03.08 string代码示例分析赋值▲▲----------//
	string str4 = "123456789";
	cout << "str4的内容："<<str4 << endl;//打印字符串长度
	cout << "str4的长度：" << str4.size() << endl;//打印字符串长度
	string str5 = "一二三四五";
	cout << "str5的长度：" << str5.size() << endl;//打印字符串长度

	//字符串长度截断
	string str6=str4.substr(0, 5);//截取前5个字符
	cout << "str6的值：" << str6 << endl;//打印str6的值

	//字符串判断
	string strif;
	if (strif.empty()) {
		cout << "strif是空字符串" << endl; 
	}
	strif = "GooHv";
	if (strif=="GooHv") {
		cout << "strif字符串内容一致" << endl;
	}
	else {
		cout << "strif字符串内容不一致" << endl;
	}
	string strif2 = strif.substr(0, 3);
	cout << "strif2的内容是："<<strif2 << endl;
	if (strif2=="Goo") {
		cout << "strif2字符串内容一致" << endl;
	}
	else {
		cout << "strif2字符串内容不一致" << endl;
	}
	//---------▲▲01零基础_01 夏曹俊 零基础到工程实战_03.09 string字符串长度截断和比较▲▲----------//

	//字符串转换为数字
	auto in1 = stoi("1234");
	cout << "转换之后的in1的值是：" << in1 << endl;//转换为int类型并打印
	cout << "转换为double类型的值是：" << stod("12.3456") << endl;//转换为double类型并打印
	cout << "转换为float类型的值是：" << stof("125.6f") << endl;//转换为float类型并打印
	cout << "转换为long类型的值是：" << stol("1234567890") << endl;//转换为long类型并打印
	
	//数字转换为字符串
	cout << "转换为字符串的值是：" << to_string(12345) << endl;//转换为字符串并打印

	//---------▲▲01零基础_01 夏曹俊 零基础到工程实战_03.09 string字符串长度截断和比较▲▲----------//
	//字符串拼接
	string log;
	string txt = "login system";
	string user = "LGH";
	int threadid = 1023;
	log = user + ":" + txt + ":" + to_string(threadid);
	log = "[debug]"+log;
	log = log + ";";
	cout << log << endl;

	//字符串的查找
	string strfind = "test for find [user]2login system";//定义了一个字符串
	auto pos=strfind.find("[test]");//查找指定字符串
	cout<<"查找到[test]的位置是："<<to_string(pos) << endl;//输出查找到的位置，没有查找到的话，是一个非常大的值=string::npos
	if (pos==string::npos) {
		cout << "[test] not find!" << endl;
	}
	string keystr{"[user]"};
	pos = strfind.find(keystr);
	cout << "查找到[user]的位置是：" << to_string(pos) << endl;//输出查找到的位置，没有查找到的话，是一个非常大的值=string::npos
	if (pos != string::npos) {
		cout << "find:"<<to_string(pos) << endl;//截止到目前已经找到对应字符的位置
	}
	cout <<"打印找到字符串之后的所有内容:"<< strfind.substr(pos+keystr.length()) << endl;

	//字符串的替换
	//1 被替换字符的起始位置，2要被替换掉的内容长度，3要被替换为的字符串
	cout << "原始字符串为：" << strfind << endl;//打印原始字符串用于查看方便
	string strreplace{ "[password]"};//被替换字符串的内筒
	string afterreplace=strfind.replace(pos,keystr.length(),strreplace );//替换之后字符串内容
	cout << "更改字符串为：" << afterreplace << endl;//替换后字符串打印出来查看

	//---------▲▲01零基础_01 夏曹俊 零基础到工程实战_03.10 字符串整数转换及查找和替换▲▲----------//
	
	return 0;
}
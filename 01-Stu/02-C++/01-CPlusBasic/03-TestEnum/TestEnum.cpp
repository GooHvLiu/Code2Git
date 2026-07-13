#include <iostream>
using namespace std;
//测试枚举类型
//传统枚举类型
enum 枚举值类型
{
	枚举值1, //默认值是0
	枚举值2, //默认值是1
	枚举值3, //默认值是2
	枚举值4=1000, //默认值是3
	枚举值5   //默认值是4
};
enum Status
{
	PLAY,
	PAUSE,
	STOP
};
//现在枚举类型C++11之后支持指定枚举类型的底层类型
enum class LogLevel
{
	DEBUG,
	INFO,
	ERROR,
	WARNING
};
int main() {
	//定义枚举类型变量
	枚举值类型 ev1{枚举值1};
	cout << "ev1=" << ev1 << endl;
	cout << "枚举值1的值是=" << 枚举值1 << endl;
	cout << "枚举值2的值是=" << 枚举值2 << endl;
	cout << "枚举值3的值是=" << 枚举值3 << endl;
	cout << "枚举值4的值是=" << 枚举值4 << endl;
	cout << "枚举值5的值是=" << 枚举值5 << endl;

	//使用枚举类型变量
	Status status{ PLAY };
	if (status == PLAY) {
		cout << "正在播放音乐..." << endl;
	}
	else if (status == PAUSE) {
		cout << "音乐暂停中..." << endl;
	}
	else if (status == STOP) {
		cout << "音乐停止播放..." << endl;
	}

	//现代枚举类型
	//level为当前日志级别
	LogLevel level{ LogLevel::DEBUG };
	cout << "Level:" << (int)level << endl;
	cout <<"LogLevel中的ERROR打印："<< (int)LogLevel::ERROR << endl;
	if(LogLevel::DEBUG==level){
		cout << "当前的log级别为：DEBUG"  << endl;
	}
	//设定大于configlevel的日志级别才打印
	LogLevel configLevel{LogLevel::INFO};
	if (level>=configLevel) {
		cout << "当前级别日志可打印出来！" << endl;
	}
	else {
		cout << "当前级别日志不打印！" << endl;
	}
	return 0;
}
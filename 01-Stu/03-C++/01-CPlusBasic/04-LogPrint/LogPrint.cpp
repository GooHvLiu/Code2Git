#include <iostream>
using namespace std;
//日志级别定义
//DEBUG<INFO<ERROR<FATAL
enum class LogLevel {
	DEBUG,	//调试模式，默认值为0
	INFO,	//信息模式，默认值为1
	ERROR,	//错误模式，默认值为2
	FATAL	//致命错误模式，默认值为3
};
int main(int argc,char * argv[]) {
	//日志判断工作流如下所示：
	//1.定义当前日志级别,默认为DEBUG模式，如果输入argc>1,通过argv[1]赋值传进来的是什么日志级别
	auto inPutLogLevel = LogLevel::DEBUG; //传入的日志等级，默认日志级别为DEBUG
	if (argc>1) {	//argc>1表示有传入日志级别参数
		string logLevelStr = argv[1]; //通过argv[1]赋值传进来的日志级别
		if (logLevelStr=="INFO") {
			inPutLogLevel = LogLevel::INFO;
		}
		if (logLevelStr == "ERROR") {
			inPutLogLevel = LogLevel::ERROR;
		}
		if (logLevelStr == "FATAL") {
			inPutLogLevel = LogLevel::FATAL;
		}
		
	}
	//2.根据当前赋值日志级别，打印对应的日志信息
		//2.1 当前为DEBUG模式
	{
		LogLevel currentlevel = LogLevel::DEBUG;//假设当前日志级别为DEBUG
		string logMessage = "This is a debug message and test log 1";
		if (currentlevel >= inPutLogLevel) {
			string messageStr = "DEBUG";
			if (currentlevel == LogLevel::INFO) {
				messageStr = "INFO";
			}
			else if (currentlevel == LogLevel::ERROR) {
				messageStr = "ERROR";
			}
			else if (currentlevel == LogLevel::FATAL) {
				messageStr = "FATAL";
			}
			cout << messageStr + ":" << logMessage << endl;
		}
	}
	//2.2 当前为INFO模式
	{
		LogLevel currentlevel = LogLevel::INFO;//假设当前日志级别为INFO
		string logMessage = "This is a debug message and test log 2";
		if (currentlevel >= inPutLogLevel) {
			string messageStr = "INFO";
			if (currentlevel == LogLevel::INFO) {
				messageStr = "INFO";
			}
			else if (currentlevel == LogLevel::ERROR) {
				messageStr = "ERROR";
			}
			else if (currentlevel == LogLevel::FATAL) {
				messageStr = "FATAL";
			}
			cout << messageStr + ":" << logMessage << endl;
		}
	}
	//2.2 当前为ERROR模式
	{
		LogLevel currentlevel = LogLevel::ERROR;//假设当前日志级别为ERROR
		string logMessage = "This is a debug message and test log 3";
		if (currentlevel >= inPutLogLevel) {
			string messageStr = "ERROR";
			if (currentlevel == LogLevel::INFO) {
				messageStr = "INFO";
			}
			else if (currentlevel == LogLevel::ERROR) {
				messageStr = "ERROR";
			}
			else if (currentlevel == LogLevel::FATAL) {
				messageStr = "FATAL";
			}
			cout << messageStr + ":" << logMessage << endl;
		}
	}
	//2.2 当前为FATAL模式
	{
		LogLevel currentlevel = LogLevel::FATAL;//假设当前日志级别为FATAL
		string logMessage = "This is a debug message and test log 4";
		if (currentlevel >= inPutLogLevel) {
			string messageStr = "FATAL";
			if (currentlevel == LogLevel::INFO) {
				messageStr = "INFO";
			}
			else if (currentlevel == LogLevel::ERROR) {
				messageStr = "ERROR";
			}
			else if (currentlevel == LogLevel::FATAL) {
				messageStr = "FATAL";
			}
			cout << messageStr + ":" << logMessage << endl;
		}
	}
	
	return 0;
}	
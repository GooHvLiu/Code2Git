#include <iostream>
using namespace std;
//main函数包含两个参数argc和argv，分别表示命令行参数的数量和内容。
//argc是一个整数，表示命令行参数的数量，包括程序名称本身。
//argv是一个字符指针数组，包含所有的命令行参数，argv[0]通常是程序的名称，argv[1]到argv[argc-1]是传递给程序的其他参数。
int main(int argc,char * argv[]) {
	//打印argc和argv的内容
	cout << "argc的值为：" << argc << endl;
	for(int i = 0; i < argc; i++) {
		cout << "argv[" << i << "]的值为：" << argv[i] << endl;
	}
	return 0;
}
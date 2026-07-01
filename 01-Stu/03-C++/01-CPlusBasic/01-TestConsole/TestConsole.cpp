#include <iostream>
using namespace std;

//YUV转为RGB函数
int YUV2RGB(float Y,float U,float V ) {
	const double toR{1.13983};//定义转R的常量
	const double toG1{ 0.39465 };//定义转G-1的常量
	const double toG2{ 0.58060 };//定义转G-2的常量
	const double toB{ 2.03211 };//定义转G的常量
	const double toRGB{ 128 };//定义转RGB的常量
	int R =(int)(Y + toR * (V - toRGB));//计算R的值
	//如果R大于255，则R等于255；如果R小于0，则R等于0
	if (R>255) {
		R = 255;
	}
	else if (R<0){
		R = 0;
	}
	int G = (int)(Y - toG1 * (U - toRGB) - toG2 * (V - toRGB));//计算G的值
	//如果G大于255，则G等于255；如果G小于0，则G等于0
	if (G > 255) {
		G = 255;
	}
	else if (G < 0) {
		G = 0;
	}
	int B = (int)(Y + toB * (U - toRGB));//计算B的值
	//如果B大于255，则B等于255；如果B小于0，则B等于0
	if (B > 255) {
		B = 255;
	}
	else if (B < 0) {
		B = 0;
	}
	cout << "R=" << R << ",G=" << G << ",B=" << B << endl;
	return 0;
}

//RGB转为YUV函数
int RGB2YUV(float R, float G, float B) {
	const double toY1{ 0.299 };//定义转Y-1的常量
	const double toY2{ 0.587 };//定义转Y-2的常量
	const double toY3{ 0.114 };//定义转Y-2的常量
	const double toU1{ -0.14713 };//定义转U-1的常量
	const double toU2{ -0.28886 };//定义转U-2的常量
	const double toU3{ 0.436 };//定义转U-3的常量
	const double toV1{ 0.615 };//定义转V-1的常量
	const double toV2{ -0.51498 };//定义转V-1的常量
	const double toV3{ -0.10001 };//定义转V-1的常量
	const double toYUV{ 128 };//定义转YUV的常量
	double Y = toY1 * R + toY2 * G + toY3 * B;//计算Y的值
	double U = toU1 * R + toU2 * G + toU3 * B + toYUV;//计算U的值
	double V = toV1 * R + toV2 * G + toV3 * B + toYUV;//计算V的值
	cout << "Y=" << Y << ",U=" << U << ",V=" << V << endl;
	return 0;
}

int main()
{
	// 输出 Hello World
    std::cout << "Hello World!\n";
	//定义x的变量
	int x{100};
	//输出x的值
	std::cout << "x = " << x << std::endl;
	//输出x的内存地址
	cout << "x的内存地址：" <<& x << endl;
	//输出x的内存地址,转换为long long类型
	cout << "x的内存地址：" << (long long)&x << endl;
	//输出x的内存大小
	cout << "x的内存大小：" << sizeof(x) << "字节" << endl;

	//定义y的变量
    int y = 20;
	//输出y的值
	cout << "y = " << y << endl;
	//输出y的内存地址
	cout << "y的内存地址：" << &y << endl;
	cout << "---↑↑↑01零基础_01 夏曹俊 零基础到工程实战_02.03 变量代码演示↑↑↑---" << endl;

	cout << 123 << ";" << -123 << endl;
	cout << sizeof(123) <<";" << sizeof(-123) << endl;
	cout << 123LL << ";" << -123LL << endl;
	cout << sizeof(123LL) << ";" << sizeof(-123LL) << endl;
	int x1{2};
	int y1{12};
	int z1{ x1 + y1 };
	int z2{ z1 + 10 };
	cout << z1 <<";"<<z2 << endl;
	cout << "---↑↑↑01零基础_01 夏曹俊 零基础到工程实战_02.04 变量的算术运算↑↑↑---" << endl;
	int u{0};
	u = 10 / 2;
	cout << "U的值：" << u << endl;
	int t{ 0 };
	t = 2;	
	cout << "t的值：" << t << endl;
	cout << "---↑↑↑01零基础_01 夏曹俊 零基础到工程实战_02.05 浮点数计算和转化↑↑↑---" << endl;

	//运行时常量
	const int week{7};
	cout << "一周有" << week << "天" << endl;
	int a = 10;
	const int b = a + 20;
	cout << "b的值为：" << b << endl;
	//编译时常量
	constexpr int day{ 24 };
	cout << "一天有" << day << "小时" << endl;
	cout << "---↑↑↑01零基础_01 夏曹俊 零基础到工程实战_02.07 运行时和编译时常量↑↑↑---" << endl;

	//auto的使用,我们要优先使用，auto推导常量是会变为变量
	auto var1{ 123 };
	cout << "var1的值为：" << var1 << endl;
	auto var2{ 1.23 };
	cout << "var2的值为：" << var2 << endl;
	auto var3{ 8.f };
	cout << "var3的值为：" << var3 << endl;
	cout << "---↑↑↑01零基础_01 夏曹俊 零基础到工程实战_02.08 cpp的auto自动推导类型↑↑↑---" << endl;

	float Y{ 100.0f };
	float U{ 150.0f };
	float V{ 200.0f };
	int R{ 100 };
	int G{ 150 };
	int B{ 200 };
	char flag{ 'Y' };
	cout << "请输入值(Y代表YUV转RGB；R代表RGB转YUV)：" << endl;
	cin >> flag;
	//如果需要YUV转为RGB
	if (flag == 'Y') {
		cout << "请输入Y的值：" << endl;
		cin >> Y;
		cout << "请输入U的值：" << endl;
		cin >> U;
		cout << "请输入V的值：" << endl;
		cin >> V;
		YUV2RGB(Y, U, V);
	}
	//如果需要RGB转为YUV
	else if (flag == 'R') {
		cout << "请输入R的值：" << endl;
		cin >> R;
		cout << "请输入G的值：" << endl;
		cin >> G;
		cout << "请输入B的值：" << endl;
		cin >> B;
		RGB2YUV(R, G, B);
	}
	cout << "---↑↑↑01零基础_01 夏曹俊 零基础到工程实战_02.09 第二章总结和作业↑↑↑---" << endl;
	//字符串的使用,VS默认GBK编码，g++默认UTF-8编码
	string str1{ "test string 001" };
	cout << "str1的值为：" << str1 << endl;
	cout << "str1的长度为：" << size(str1) << endl;
	string str2{ str1 };
	cout << "str2的值为：" << str2 << endl;
	cout << "---↑↑↑01零基础_01 夏曹俊 零基础到工程实战_03.07 c++string功能分析↑↑↑---" << endl;
	return 0;


}


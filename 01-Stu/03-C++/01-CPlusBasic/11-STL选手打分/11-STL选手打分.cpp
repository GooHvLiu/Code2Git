#include <iostream>
#include <vector>	
#include <deque>
#include <algorithm>
#include "string.h"
using namespace std;

//定义选手类
class Player
{
public:
	Player(string name ,int score)
	{
		this->m_name = name;
		this->m_score = score;
	}

	string m_name;
	int m_score;
};

//创建选手
void createPlayer(vector<Player> &v1,int Num)
{
	for (int i = 0; i < Num; i++)
	{
		string name;
		cout << "请输入第" << i + 1 << "个选手的姓名：" << endl;
		cin >> name;
		int score = 0;
		v1.push_back(Player(name, score));
	}
}

//给选手打分
void setScore(vector<Player>&v2,int judgeNum)
{
	for (vector<Player>::iterator it1 = v2.begin(); it1 != v2.end(); it1++)//一个选手一个选手的打分
	{

		deque<int> d;
		int score = 0;
		for (int i = 0; i < judgeNum; i++)
		{
			score = rand() % 41 + 60;
			d.push_back(score);
		}

		//测试效果
		{
			cout << "选手名称： " << (it1)->m_name << endl;

			for (deque<int>::iterator it = d.begin(); it != d.end(); it++)
			{
				cout << *it << "；";
			}
			cout << endl;
			cout << endl;
		}	

		//排序
		sort(d.begin(),d.end());

		//去除最高分和最低分
		d.pop_back();
		d.pop_front();

		//计算总分
		int sum = 0;
		for (deque<int>::iterator it3 = d.begin(); it3 != d.end(); it3++)
		{
			sum += *it3;
		}

		//计算平均分
		it1->m_score = sum / d.size();
	}
}

//显示最终得分
void showScore(vector<Player> &v)
{
	for (vector<Player>::iterator it = v.begin(); it != v.end(); it++)
	{
		cout << (*it).m_name << "的最终得分为：" << (*it).m_score << endl;
		cout << endl;
	}

}

int main()
{
	cout << "请输入选手人数(＜10人)：" << endl;
	int playerNum = 0;
	cin >> playerNum;

	cout << "请输入评委人数：" << endl;
	int judgeNum = 0;
	cin >> judgeNum;

	vector<Player> v;//创建一个vector容器

	//创建选手
	{
		createPlayer(v, playerNum);
	
		////创建后的选手基本信息
		//{
		//	int i = 0;
		//	for (vector<Player>::iterator it = v.begin(); it != v.end(); it++)
		//	{
		//		cout << "第" << i + 1 << "个选手的姓名：" << (*it).m_name << +"； 第" << i + 1 << "个选手的初始分数：" << (*it).m_score << endl;
		//		i++;
		//	}
		//}
	}

	//给选手打分
	setScore(v, judgeNum);

	//显示最终得分
	showScore(v);

	system("pause");
	
}

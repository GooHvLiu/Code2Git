#include <iostream>
#include <string>
#define Max 1000
using namespace std;

//显示主菜单
void showMenu()
{
    cout << "*************************" << endl;
    cout << "****  1-添加联系人  ****" << endl;
    cout << "****  2-显示联系人  ****" << endl;
    cout << "****  3-查询联系人  ****" << endl;
    cout << "****  4-删除联系人  ****" << endl;
    cout << "****  5-修改联系人  ****" << endl;
    cout << "****  6-清空联系人  ****" << endl;
    cout << "****  0-退出通讯录  ****" << endl;
    cout << "*************************" << endl;
}

//创建联系人结构体
struct Person
{
    string name;//姓名
    int age;//年龄
    int sex;//性别
    string phone;//手机号码
    string address;//地址
};

//创建通讯录结构体
struct Contact
{
    struct Person person[Max];//联系人数组，默认最大1000
    int m_Size;//当前联系人个数
};

//将通讯录初始化
void initContact(Contact * contact)
{
   /******使用初始化
    contact->m_Size = 0;
    contact->person[0].name = "";
    contact->person[0].age = 0;
    contact->person[0].sex = 0;
    contact->person[0].phone = "";
    contact->person[0].address = "";
    **************/

    //以下为调试使用初始化列表
     contact->m_Size = 5;
     contact->person[0].name = "张三1";
     contact->person[1].name = "张三2";
     contact->person[2].name = "张三3";
     contact->person[3].name = "张三4";
     contact->person[4].name = "张三5";

     contact->person[0].age = 18;
     contact->person[1].age = 21;
     contact->person[2].age = 25;
     contact->person[3].age = 35;
     contact->person[4].age = 27;

     contact->person[0].sex = 0;
     contact->person[1].sex = 1;
     contact->person[2].sex = 0;
     contact->person[3].sex = 1;
     contact->person[4].sex = 0;

     contact->person[0].phone = "13545878524";
     contact->person[1].phone = "13658477854";
     contact->person[2].phone = "12654879652";
     contact->person[3].phone = "13598574632";
     contact->person[4].phone = "13987456258";

     contact->person[0].address = "江苏省吴中区梅村1道";
     contact->person[1].address = "江苏省吴中区梅村2道";
     contact->person[2].address = "江苏省吴中区梅村3道";
     contact->person[3].address = "江苏省吴中区梅村4道";
     contact->person[4].address = "江苏省吴中区梅村5道";

}

//添加联系人代码块-通用接口
int inputPerson(Contact * contact,int index)
{ 
    //输入姓名
    {
        string name = "";
        cout << "请输入姓名(0-Exit)：" << endl;
        cin >> name;
        if (name == "0")//键入0表示退出此操作
        {
            return -1;
        }
        else
        {
            contact->person[index].name = name;
        }

    }

    //输入年龄
    {

        cout << "请输入年龄(0-Exit)：" << endl;

        while (true)
        {
            int age = -1;
            cin >> age;
            if (age < 0 || age > 100)//年龄范围
            {
                cout << "请输入正确的年龄!" << endl;
            }

            else if (age == 0)//键入0表示退出此操作
            {
                return -1;
            }
            else
            {
                contact->person[index].age = age;
                break;
            }

        }
    }

    //输入性别
    {
        cout << "请输入联系人性别（0-Exit 1-女 2-男）:" << endl;
        while (true)
        {
            int sex = 0;
            cin >> sex;

            if (sex == 0)
            {
                return -1;
            }

            else if (sex != 1 && sex != 2)
            {
                cout << "请输入正确的性别!" << endl;
            }
            else
            {
                contact->person[index].sex = sex;
                break;
            }

        }
    }

    //输入手机号
    {
        cout << "请输入手机号(0-Exit):" << endl;
        while (true)
        {
            string phone;
            cin >> phone;
            if (phone == "0")
            {
                return -1;
            }
            else if (phone.size() != 11)
                cout << "请输入正确的手机号码!" << endl;
            else
            {
                contact->person[index].phone = phone;
                break;
            }
        }
    }

    //输入地址
    {
        string address;
        cout << "请输入地址(0-Exit)：" << endl;
        cin >> address;
        if (address == "0")
        {
            return -1;
        }
        else
        {
            contact->person[index].address = address;
        }
    }

    return 1;
}

//添加联系人
void addPerson(Contact * contact)
{   
    int addOk = 0;
    if(contact->m_Size == Max)
    {
    cout << "通讯录已满，无法添加" << endl;
    }
    else {

        addOk=inputPerson(contact,contact->m_Size);//调用输入联系人信息通用接口
        
        }

    if (addOk == 1)
    {
        cout << "添加成功，目前通讯录中有" << contact->m_Size << "个联系人" << endl;
        contact->m_Size++;
    }
    else
    {
        cout << "添加失败" << endl;
    }
    system("pause");
    return;

}

//显示联系人
void showPerson(Contact * contact)
{ 
    if (contact->m_Size == 0)
    {
        cout << "通讯录为空" << endl;
    }
    else
        for (int i = 0; i < contact->m_Size; i++)
        {
            cout << "姓名：" << contact->person[i].name << " 年龄：" << contact->person[i].age <<" 岁" << " 性别：" << (contact->person[i].sex == 0 ? "女" : "男") << " 手机号码：" << contact->person[i].phone << " 地址：" << contact->person[i].address << endl;
        }
    cout << "当前通讯录人数为："<<contact->m_Size<<" 人" << endl;
    system("pause");

}

//查找联系人,通用接口
int findP(Contact* contact,string name)
{
    int i = 0;
    for (i;i < contact->m_Size;i++)
    {
        if (contact->person[i].name == name)
        {
            return i;
        }

    }

    if (i == contact->m_Size)
    {
        return -1;
    }
}

//查询联系人
void findPeson(Contact * contact)
{
    cout << "请输入要查询的联系人姓名(0-Exit)：" << endl;
    string name="";
    cin >> name;
    if (name == "0")
    {
        return;
    }
    
    int index = findP(contact,name);//调用查找联系人函数
    if (index == -1)
    {
        cout << "未找到该联系人" << endl;
        system("pause");
    }
    else
    {
        cout << "查询成功" << endl;
        cout << "姓名：" << contact->person[index].name << " 年龄：" << contact->person[index].age << " 岁" << " 性别：" << (contact->person[index].sex == 0 ? "女" : "男") << " 手机号码：" << contact->person[index].phone << " 地址：" << contact->person[index].address << endl;
        system("pause");

    }

}

//删除联系人
void deletePerson(Contact * contact)
{   
    string name = "";
    int index = -1;
    cout << "请输入需要删除人员的名字(0-Exit):" << endl;
    cin >> name;
    if (name == "0")
    {
        return;
    }
    else
    {
        index=findP(contact,name);//找到即将删除的联系人的id

        if (index != -1)
        {
            for (int i = index; i < contact->m_Size - 1; i++)
            {
                contact->person[i] = contact->person[i + 1];
            }

            contact->m_Size--;
            cout << "删除成功，当前通讯录人数为："<<contact->m_Size<<" 人" << endl;
            system("pause");
        }
        else
        {
            cout << "未找到该联系人" << endl;
            system("pause");
        }
    }
}

 //修改联系人
void modifyPerson(Contact * contact)
{
    cout << "请输入需要修改的姓名(0-Exit):" << endl;
    string name = "";
    cin >> name;
    if (name == "0")
    {
        return;
    }
    else
    {
        int index = findP(contact, name);//查找此人，并返回位置
        if (index != -1)
        {
            int addOk=inputPerson(contact, index);//修改此人信息
            if(addOk==1)
            {
                cout << "修改成功" << endl;
                cout << "姓名：" << contact->person[index].name << " 年龄：" << contact->person[index].age << " 岁" << " 性别：" << (contact->person[index].sex == 0 ? "女" : "男") << " 手机号码：" << contact->person[index].phone << " 地址：" << contact->person[index].address << endl;
            }
            else
            {
                cout << "修改失败" << endl;
            }
        }
        else
        {
            cout << "查无此人" << endl;
        }

        system("pause");
        return;
    }
}

 //清空联系人
void clearPerson(Contact * contact)
{
    cout<<"请您再次确认是否要真的清空联系人 "<<"(1.确认 0.取消)"<<endl;
    int choice;
    cin>>choice;
    if(choice==1)
    {
        contact->m_Size=0;//重置联系人个数
        cout << "您已清空通讯录" << endl;
        cout<<"当前通讯录个数为："<<contact->m_Size<<"个" << endl;
    }
    else
    {
        cout<<"您已取消清空"<<endl;
    }

    system("pause");
    return;
}


//程序主函数
int main()
{
    Contact contact;//创建一个通讯录
    initContact(&contact);//初始化通讯录

    int switch_on = -1;
    while (true)
    {
        system("cls");//清空屏幕

        showMenu();//显示主界面窗口

        cout << "请选择相应功能..." << endl;

        cin >> switch_on;

        switch (switch_on)
        {
        case 0://退出通讯录
            cout << "您已退出通讯录系统" << endl;
            return 0;

        case 1://添加联系人
            addPerson(&contact);
            break;

        case 2://显示联系人
            showPerson(&contact);
            break;

        case 3://查询联系人
            findPeson(&contact);
            break;

        case 4://删除联系人
            deletePerson(&contact);
            break;

        case 5://修改联系人
            modifyPerson(&contact);
            break;

        case 6://清空联系人
            clearPerson(&contact);
            break;

        default:
            break;
        }
    }
    system("pause");
    return 0;

}

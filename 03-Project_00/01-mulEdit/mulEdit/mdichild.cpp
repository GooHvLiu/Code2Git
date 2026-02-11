#include "mdichild.h"
#include <QFile>
#include <QTextStream>
#include <QMessageBox>
#include <QFileInfo>
#include <QApplication>
#include <QFileDialog>
#include <QCloseEvent>
#include <QPushButton>
#include <QTextEdit>

MdiChild::MdiChild(QWidget *parent)
    : QTextEdit{parent}
{
    //设置在子窗口关闭时，销毁这个类的对象
    setAttribute(Qt::WA_DeleteOnClose);

    //初始isUntitled位true
    isUntitled=true;
}

/***************************************
 * 实现功能：新建文件操作newFile()
 * ***********************************/
void MdiChild::newFile()
{
    //设置窗口编号，因为编号一直被保存，所以需要使用静态变量
    static int sequenceNumber=1;

    //新建的文档没有被保存过
    isUntitled=true;

    //将当前文件命名为未命名文档加编号，编号先使用再加1
    curFile=tr("未命名文档 %1.txt").arg(sequenceNumber++);

    //设置窗口标题，使用[*]可以在文档被更改后在文件名称后显示“*”号
    setWindowTitle(curFile+"[*]"+tr(" - 多文档编辑器"));

    //文档更改时发射contentsChanged()信号，执行documentWasModified()槽
    connect(document(),SIGNAL(contentsChanged()),this,SLOT(documentWasModified()));
}

/***************************************
 * 实现功能：documentWasModified()槽的定义
 * ***********************************/
void MdiChild::documentWasModified()
{
    //根据文档的isModified()函数的返回值，判断编辑器内容是否被修改了
    //如果被修改了，就要在设置了[*]号的地方显示“*”号，这里会在窗口标题中显示
    setWindowModified(document()->isModified());
}

/***************************************
 * 实现功能：加载文件操作loadFile()的定义
 * ***********************************/
bool MdiChild::loadFile(const QString &fileName)
{
    //新建QFile对象
    QFile file(fileName);
    //只读方式打开文件，出错则提示，并返回false
    if(!file.open(QFile::ReadOnly|QFile::Text))
    {
        /**************************************************
         * 第1个参数：对话框的父窗口（确保对话框居中显示在当前窗口上）
         * 第2个参数：对话框标题（tr()标记为可翻译，适配多语言）
         * 第3个参数：提示文本
         * tr("无法读取文件 %1:\n%2.")：可翻译的文本模板，其中：
            %1：占位符 → 被fileName（要打开的文件路径 / 名称）替换；
            %2：占位符 → 被file.errorString()（Qt 返回的具体错误描述）替换；
            \n：换行符 → 让 “文件名” 和 “错误原因” 分行显示，更易读；
         * 若fileName是/Users/test.txt、错误是 “文件不存在”，对话框会显示：
         * 无法读取文件 /Users/test.txt:
         * File not found.
         * ***********************************************/
        QMessageBox::warning(this,tr("多文档编辑器"),tr("无法读取文件 %1:\n%2.").arg(fileName).arg(file.errorString()));
        return false;
    }
}

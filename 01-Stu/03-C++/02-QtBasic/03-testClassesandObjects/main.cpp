#include <iostream>
#include "trainInfoTest.h"
using namespace std;

int main()
{
    trainInfoTest train1;
    train1.showInfo();
    trainInfoTest train2(2,"K1526",8,0,0,8,15,0);
    train2.showInfo();
    return 0;
}

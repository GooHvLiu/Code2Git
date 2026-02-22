#ifndef TRAININFOTEST_H
#define TRAININFOTEST_H

#include <string>
#include "timeTest.h"
using namespace std;

class trainInfoTest
{
    unsigned platform;
    string trainNumber;
    timeTest arrivalTime,departureTime;
public:
    trainInfoTest();
    trainInfoTest(unsigned plat,string traNum,int arrH,int arrM,int arrS,int dptH,int dptM,int dptS);
    void showInfo();
    ~trainInfoTest();
};

#endif // TRAININFOTEST_H

#include <iostream>
#include "trainInfoTest.h"
using namespace std;

trainInfoTest::trainInfoTest():platform{0}
{
    cout<<"Constructor of trainInfoTest is called."<<endl;
}

trainInfoTest::trainInfoTest(unsigned plat,string traNum,int arrH,int arrM,int arrS,int dptH,int dptM,int dptS):platform{plat},trainNumber{traNum},arrivalTime{arrH,arrM,arrS},departureTime(dptH,dptM,dptS)
{
    cout<<"Constructor with 8 parameters of trainInfoTest is called."<<"I'm info of Train"<<endl;
}

void trainInfoTest::showInfo()
{
    cout<<"Information of Train:"<<endl;
    cout<<"\t"<<"Platform:"<<platform<<endl;
    cout<<"\t"<<"Train Number:"<<trainNumber<<endl;
    cout<<"\t"<<"Arrival Time:";
    arrivalTime.showTime();
    cout<<"\t"<<"Departure Time:";
    departureTime.showTime();

}

trainInfoTest::~trainInfoTest()
{
    cout<<"Destructor is called,I'm info of train:"<<trainNumber<<endl;
}

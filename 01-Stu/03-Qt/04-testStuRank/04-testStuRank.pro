# 基础配置（以Qt 6为例）
QT += core gui widgets  # 必须包含widgets，gui是基础，core是核心

HEADERS += \
    student.h \
    stuoper.h

SOURCES += \
    main.cpp \
    student.cpp \
    stuoper.cpp

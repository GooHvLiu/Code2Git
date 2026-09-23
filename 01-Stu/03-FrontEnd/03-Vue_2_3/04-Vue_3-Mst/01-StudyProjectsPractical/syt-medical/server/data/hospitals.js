const hospitals = [
  {
    "id": "h001",
    "hosname": "北京协和医院",
    "hoscode": "1000_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110101",
    "address": "北京市东城区帅府园一号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA1QkFDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京协和医院是集医疗、科研、教学为一体的大型综合医院，是国家卫生健康委指定的全国疑难重症诊治指导中心，连续多年蝉联中国医院排行榜榜首。",
    "route": "乘1路、52路、106路、108路东单路口西站下车，步行约100米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:30",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:30",
        "停挂时间：就诊前一日11:30",
        "退号时间：就诊前一日10:30前",
        "取号地点：门诊楼一层大厅"
      ]
    }
  },
  {
    "id": "h002",
    "hosname": "北京大学第一医院",
    "hoscode": "1001_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110102",
    "address": "北京市西城区西什库大街8号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOEIwMDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学第一医院创建于1915年，是国内创办最早的国立医院之一，集医疗、教学、科研、预防为一体的大型综合性三级甲等医院。",
    "route": "乘坐55路、68路、107路、118路公交车，在厂桥站下车。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "11:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日12:00"
      ]
    }
  },
  {
    "id": "h003",
    "hosname": "北京大学人民医院",
    "hoscode": "1002_0",
    "hostype": "3",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110102",
    "address": "北京市西城区西直门南大街11号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA2NDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学人民医院创建于1918年，是中国人自行集资创办的第一所综合性医院，集医疗、教学、科研为一体的大型三级甲等医院。",
    "route": "乘坐地铁2号线、6号线在车公庄站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:30",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:30"
      ]
    }
  },
  {
    "id": "h004",
    "hosname": "北京大学第三医院",
    "hoscode": "1003_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110108",
    "address": "北京市海淀区花园北路49号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOEI0NTEzIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学第三医院建于1958年，是国家卫生健康委委管的集医疗、教学、科研和预防保健为一体的现代化综合性三级甲等医院，生殖医学中心全国领先。",
    "route": "乘坐地铁10号线西土城站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h005",
    "hosname": "首都医科大学附属北京天坛医院",
    "hoscode": "1004_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110106",
    "address": "北京市丰台区南四环西路119号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkY0RjRGIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京天坛医院始建于1956年，以神经外科为先导，以神经科学集群为特色，集医、教、研、防为一体的三级甲等综合医院。",
    "route": "乘坐地铁9号线丰台科技园站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h006",
    "hosname": "首都医科大学附属北京安贞医院",
    "hoscode": "1005_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110105",
    "address": "北京市朝阳区安贞路2号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREMxNDNDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京安贞医院成立于1984年，是以治疗心肺血管疾病为重点的大型三级甲等综合性医院，心血管内外科实力雄厚。",
    "route": "乘坐地铁8号线安华桥站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h007",
    "hosname": "首都医科大学附属北京朝阳医院",
    "hoscode": "1006_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110105",
    "address": "北京市朝阳区工人体育场南路8号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY4QzAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京朝阳医院建于1958年，是集医疗、教学、科研、预防为一体的三级甲等综合性医院，呼吸病学、急诊医学为特色。",
    "route": "乘坐地铁10号线、6号线呼家楼站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h008",
    "hosname": "首都医科大学宣武医院",
    "hoscode": "1007_0",
    "hostype": "3",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110102",
    "address": "北京市西城区长椿街45号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNEIwMDgyIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学宣武医院创建于1958年，是一所以神经科学和老年医学的临床与研究为重点，以治疗心脑血管疾患为特色的大型三级甲等综合医院。",
    "route": "乘坐地铁2号线长椿街站下车，步行约300米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h009",
    "hosname": "中国医学科学院肿瘤医院",
    "hoscode": "1008_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110105",
    "address": "北京市朝阳区潘家园南里17号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA4QjhCIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中国医学科学院肿瘤医院始建于1958年，是新中国第一个肿瘤专科医院，也是亚洲地区最大的肿瘤防治研究中心，国家癌症中心依托单位。",
    "route": "乘坐地铁10号线潘家园站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "09:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h010",
    "hosname": "北京积水潭医院",
    "hoscode": "1009_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110102",
    "address": "北京市西城区新街口东街31号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkU4QjU3IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京积水潭医院建于1956年，是一所以骨科和烧伤科为重点的三级甲等综合性医院，骨科在国内外享有很高声誉。",
    "route": "乘坐地铁2号线积水潭站下车，步行约400米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h011",
    "hosname": "首都医科大学附属北京儿童医院",
    "hoscode": "1010_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110102",
    "address": "北京市西城区南礼士路56号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY2OUI0IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京儿童医院创建于1942年，是集医疗、科研、教学、保健于一体的三级甲等综合性儿科医院，国家儿童医学中心。",
    "route": "乘坐地铁1号线、2号线复兴门站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h012",
    "hosname": "北京中医药大学东直门医院",
    "hoscode": "1011_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110101",
    "address": "北京市东城区海运仓5号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREFBNTIwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京中医药大学东直门医院创建于1958年，是新中国成立后北京中医药大学最早建立的附属医院，以中医中药为特色的三级甲等医院。",
    "route": "乘坐地铁2号线、6号线朝阳门站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h013",
    "hosname": "中国人民解放军总医院",
    "hoscode": "1012_0",
    "hostype": "3",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110108",
    "address": "北京市海淀区复兴路28号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjQjIyMjIyIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中国人民解放军总医院（301医院）创建于1927年，是集医疗、保健、教学、科研于一体的大型现代化综合性三级甲等医院。",
    "route": "乘坐地铁1号线五棵松站下车，步行约300米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h014",
    "hosname": "北京医院",
    "hoscode": "1013_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110101",
    "address": "北京市东城区东单大华路1号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNDE2OUUxIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京医院始建于1905年，是一所以高干医疗保健为中心、老年医学研究为重点，向社会全面开放的医、教、研、防全面发展的现代化综合性三级甲等医院。",
    "route": "乘坐地铁1号线、5号线东单站下车，步行约400米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h015",
    "hosname": "中日友好医院",
    "hoscode": "1014_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110107",
    "address": "北京市朝阳区樱花园东街2号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOTM3MERCIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中日友好医院建于1984年，是国家卫生健康委直属大型综合性三级甲等医院，中西医结合为特色，呼吸中心、疼痛科为国家临床重点专科。",
    "route": "乘坐地铁5号线、10号线惠新西街南口站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h016",
    "hosname": "北京世纪坛医院",
    "hoscode": "100_0",
    "hostype": "3",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110107",
    "address": "北京市西城区长椿街45号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNEIwMDgyIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学宣武医院创建于1958年，是一所以神经科学和老年医学的临床与研究为重点，以治疗心脑血管疾患为特色的大型三级甲等综合医院。",
    "route": "乘坐地铁2号线长椿街站下车，步行约300米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h017",
    "hosname": "北京友谊医院",
    "hoscode": "101_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110107",
    "address": "北京市朝阳区潘家园南里17号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA4QjhCIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中国医学科学院肿瘤医院始建于1958年，是新中国第一个肿瘤专科医院，也是亚洲地区最大的肿瘤防治研究中心，国家癌症中心依托单位。",
    "route": "乘坐地铁10号线潘家园站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "09:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h018",
    "hosname": "北京同仁医院",
    "hoscode": "102_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110109",
    "address": "北京市丰台区南四环西路119号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkY0RjRGIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京天坛医院始建于1956年，以神经外科为先导，以神经科学集群为特色，集医、教、研、防为一体的三级甲等综合医院。",
    "route": "乘坐地铁9号线丰台科技园站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h019",
    "hosname": "北京佑安医院",
    "hoscode": "103_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110109",
    "address": "北京市朝阳区安贞路2号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREMxNDNDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京安贞医院成立于1984年，是以治疗心肺血管疾病为重点的大型三级甲等综合性医院，心血管内外科实力雄厚。",
    "route": "乘坐地铁8号线安华桥站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h020",
    "hosname": "北京地坛医院",
    "hoscode": "104_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110109",
    "address": "北京市朝阳区工人体育场南路8号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY4QzAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京朝阳医院建于1958年，是集医疗、教学、科研、预防为一体的三级甲等综合性医院，呼吸病学、急诊医学为特色。",
    "route": "乘坐地铁10号线、6号线呼家楼站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h021",
    "hosname": "北京胸科医院",
    "hoscode": "105_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110111",
    "address": "北京市西城区西什库大街8号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOEIwMDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学第一医院创建于1915年，是国内创办最早的国立医院之一，集医疗、教学、科研、预防为一体的大型综合性三级甲等医院。",
    "route": "乘坐55路、68路、107路、118路公交车，在厂桥站下车。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "11:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日12:00"
      ]
    }
  },
  {
    "id": "h022",
    "hosname": "北京安定医院",
    "hoscode": "106_0",
    "hostype": "3",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110111",
    "address": "北京市西城区西直门南大街11号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA2NDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学人民医院创建于1918年，是中国人自行集资创办的第一所综合性医院，集医疗、教学、科研为一体的大型三级甲等医院。",
    "route": "乘坐地铁2号线、6号线在车公庄站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:30",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:30"
      ]
    }
  },
  {
    "id": "h023",
    "hosname": "北京回龙观医院",
    "hoscode": "107_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110111",
    "address": "北京市海淀区花园北路49号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOEI0NTEzIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学第三医院建于1958年，是国家卫生健康委委管的集医疗、教学、科研和预防保健为一体的现代化综合性三级甲等医院，生殖医学中心全国领先。",
    "route": "乘坐地铁10号线西土城站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h017",
    "hosname": "北京口腔医院",
    "hoscode": "108_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110112",
    "address": "北京市朝阳区潘家园南里17号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA4QjhCIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中国医学科学院肿瘤医院始建于1958年，是新中国第一个肿瘤专科医院，也是亚洲地区最大的肿瘤防治研究中心，国家癌症中心依托单位。",
    "route": "乘坐地铁10号线潘家园站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "09:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h018",
    "hosname": "北京中医医院",
    "hoscode": "109_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110112",
    "address": "北京市丰台区南四环西路119号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkY0RjRGIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京天坛医院始建于1956年，以神经外科为先导，以神经科学集群为特色，集医、教、研、防为一体的三级甲等综合医院。",
    "route": "乘坐地铁9号线丰台科技园站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h019",
    "hosname": "北京妇产医院",
    "hoscode": "110_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110112",
    "address": "北京市朝阳区安贞路2号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREMxNDNDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京安贞医院成立于1984年，是以治疗心肺血管疾病为重点的大型三级甲等综合性医院，心血管内外科实力雄厚。",
    "route": "乘坐地铁8号线安华桥站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h001",
    "hosname": "北京小汤山医院",
    "hoscode": "111_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110113",
    "address": "北京市东城区帅府园一号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA1QkFDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京协和医院是集医疗、科研、教学为一体的大型综合医院，是国家卫生健康委指定的全国疑难重症诊治指导中心，连续多年蝉联中国医院排行榜榜首。",
    "route": "乘1路、52路、106路、108路东单路口西站下车，步行约100米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:30",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:30",
        "停挂时间：就诊前一日11:30",
        "退号时间：就诊前一日10:30前",
        "取号地点：门诊楼一层大厅"
      ]
    }
  },
  {
    "id": "h002",
    "hosname": "北京老年医院",
    "hoscode": "112_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110113",
    "address": "北京市西城区西什库大街8号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOEIwMDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学第一医院创建于1915年，是国内创办最早的国立医院之一，集医疗、教学、科研、预防为一体的大型综合性三级甲等医院。",
    "route": "乘坐55路、68路、107路、118路公交车，在厂桥站下车。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "11:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日12:00"
      ]
    }
  },
  {
    "id": "h003",
    "hosname": "北京康复医院",
    "hoscode": "113_0",
    "hostype": "3",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110113",
    "address": "北京市西城区西直门南大街11号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA2NDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学人民医院创建于1918年，是中国人自行集资创办的第一所综合性医院，集医疗、教学、科研为一体的大型三级甲等医院。",
    "route": "乘坐地铁2号线、6号线在车公庄站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:30",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:30"
      ]
    }
  },
  {
    "id": "h018",
    "hosname": "北京清华长庚医院",
    "hoscode": "114_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110114",
    "address": "北京市丰台区南四环西路119号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkY0RjRGIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京天坛医院始建于1956年，以神经外科为先导，以神经科学集群为特色，集医、教、研、防为一体的三级甲等综合医院。",
    "route": "乘坐地铁9号线丰台科技园站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h019",
    "hosname": "北京潞河医院",
    "hoscode": "115_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110114",
    "address": "北京市朝阳区安贞路2号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREMxNDNDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京安贞医院成立于1984年，是以治疗心肺血管疾病为重点的大型三级甲等综合性医院，心血管内外科实力雄厚。",
    "route": "乘坐地铁8号线安华桥站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h020",
    "hosname": "北京朝阳医院西院",
    "hoscode": "116_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110114",
    "address": "北京市朝阳区工人体育场南路8号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY4QzAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京朝阳医院建于1958年，是集医疗、教学、科研、预防为一体的三级甲等综合性医院，呼吸病学、急诊医学为特色。",
    "route": "乘坐地铁10号线、6号线呼家楼站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h003",
    "hosname": "北京天坛医院丰台院区",
    "hoscode": "117_0",
    "hostype": "3",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110115",
    "address": "北京市西城区西直门南大街11号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA2NDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学人民医院创建于1918年，是中国人自行集资创办的第一所综合性医院，集医疗、教学、科研为一体的大型三级甲等医院。",
    "route": "乘坐地铁2号线、6号线在车公庄站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:30",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:30"
      ]
    }
  },
  {
    "id": "h004",
    "hosname": "北京安贞医院通州院区",
    "hoscode": "118_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110115",
    "address": "北京市海淀区花园北路49号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOEI0NTEzIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学第三医院建于1958年，是国家卫生健康委委管的集医疗、教学、科研和预防保健为一体的现代化综合性三级甲等医院，生殖医学中心全国领先。",
    "route": "乘坐地铁10号线西土城站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h005",
    "hosname": "北京协和医院西院",
    "hoscode": "119_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110115",
    "address": "北京市丰台区南四环西路119号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkY0RjRGIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京天坛医院始建于1956年，以神经外科为先导，以神经科学集群为特色，集医、教、研、防为一体的三级甲等综合医院。",
    "route": "乘坐地铁9号线丰台科技园站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h006",
    "hosname": "北京大学人民医院通州院区",
    "hoscode": "120_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110115",
    "address": "北京市朝阳区安贞路2号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREMxNDNDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京安贞医院成立于1984年，是以治疗心肺血管疾病为重点的大型三级甲等综合性医院，心血管内外科实力雄厚。",
    "route": "乘坐地铁8号线安华桥站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h007",
    "hosname": "北京大学第一医院大兴院区",
    "hoscode": "121_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110116",
    "address": "北京市朝阳区工人体育场南路8号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY4QzAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京朝阳医院建于1958年，是集医疗、教学、科研、预防为一体的三级甲等综合性医院，呼吸病学、急诊医学为特色。",
    "route": "乘坐地铁10号线、6号线呼家楼站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h008",
    "hosname": "北京积水潭医院回龙观院区",
    "hoscode": "122_0",
    "hostype": "3",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110116",
    "address": "北京市西城区长椿街45号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNEIwMDgyIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学宣武医院创建于1958年，是一所以神经科学和老年医学的临床与研究为重点，以治疗心脑血管疾患为特色的大型三级甲等综合医院。",
    "route": "乘坐地铁2号线长椿街站下车，步行约300米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h009",
    "hosname": "北京儿童医院顺义妇儿医院",
    "hoscode": "123_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110117",
    "address": "北京市朝阳区潘家园南里17号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA4QjhCIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中国医学科学院肿瘤医院始建于1958年，是新中国第一个肿瘤专科医院，也是亚洲地区最大的肿瘤防治研究中心，国家癌症中心依托单位。",
    "route": "乘坐地铁10号线潘家园站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "09:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h010",
    "hosname": "北京中医药大学东方医院",
    "hoscode": "124_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110117",
    "address": "北京市西城区新街口东街31号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkU4QjU3IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京积水潭医院建于1956年，是一所以骨科和烧伤科为重点的三级甲等综合性医院，骨科在国内外享有很高声誉。",
    "route": "乘坐地铁2号线积水潭站下车，步行约400米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h011",
    "hosname": "北京中医药大学第三附属医院",
    "hoscode": "125_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110117",
    "address": "北京市西城区南礼士路56号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY2OUI0IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京儿童医院创建于1942年，是集医疗、科研、教学、保健于一体的三级甲等综合性儿科医院，国家儿童医学中心。",
    "route": "乘坐地铁1号线、2号线复兴门站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h012",
    "hosname": "中国中医科学院广安门医院",
    "hoscode": "126_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110117",
    "address": "北京市东城区海运仓5号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREFBNTIwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京中医药大学东直门医院创建于1958年，是新中国成立后北京中医药大学最早建立的附属医院，以中医中药为特色的三级甲等医院。",
    "route": "乘坐地铁2号线、6号线朝阳门站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h018",
    "hosname": "中国中医科学院西苑医院",
    "hoscode": "127_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110118",
    "address": "北京市丰台区南四环西路119号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkY0RjRGIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京天坛医院始建于1956年，以神经外科为先导，以神经科学集群为特色，集医、教、研、防为一体的三级甲等综合医院。",
    "route": "乘坐地铁9号线丰台科技园站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h019",
    "hosname": "中国中医科学院望京医院",
    "hoscode": "128_0",
    "hostype": "1",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110118",
    "address": "北京市朝阳区安贞路2号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREMxNDNDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京安贞医院成立于1984年，是以治疗心肺血管疾病为重点的大型三级甲等综合性医院，心血管内外科实力雄厚。",
    "route": "乘坐地铁8号线安华桥站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h020",
    "hosname": "中国医学科学院阜外医院",
    "hoscode": "129_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110118",
    "address": "北京市朝阳区工人体育场南路8号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY4QzAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京朝阳医院建于1958年，是集医疗、教学、科研、预防为一体的三级甲等综合性医院，呼吸病学、急诊医学为特色。",
    "route": "乘坐地铁10号线、6号线呼家楼站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h021",
    "hosname": "中国医学科学院整形外科医院",
    "hoscode": "130_0",
    "hostype": "2",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110119",
    "address": "北京市西城区西什库大街8号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOEIwMDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学第一医院创建于1915年，是国内创办最早的国立医院之一，集医疗、教学、科研、预防为一体的大型综合性三级甲等医院。",
    "route": "乘坐55路、68路、107路、118路公交车，在厂桥站下车。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "11:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00",
        "停挂时间：就诊前一日12:00"
      ]
    }
  },
  {
    "id": "h022",
    "hosname": "首都医科大学附属北京口腔医院",
    "hoscode": "131_0",
    "hostype": "3",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110118",
    "address": "北京市西城区西直门南大街11号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA2NDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学人民医院创建于1918年，是中国人自行集资创办的第一所综合性医院，集医疗、教学、科研为一体的大型三级甲等医院。",
    "route": "乘坐地铁2号线、6号线在车公庄站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:30",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:30"
      ]
    }
  },
  {
    "id": "h023",
    "hosname": "首都医科大学附属北京妇产医院",
    "hoscode": "132_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110119",
    "address": "北京市海淀区花园北路49号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOEI0NTEzIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学第三医院建于1958年，是国家卫生健康委委管的集医疗、教学、科研和预防保健为一体的现代化综合性三级甲等医院，生殖医学中心全国领先。",
    "route": "乘坐地铁10号线西土城站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h017",
    "hosname": "首都医科大学附属北京佑安医院",
    "hoscode": "133_0",
    "hostype": "4",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110119",
    "address": "北京市朝阳区潘家园南里17号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA4QjhCIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中国医学科学院肿瘤医院始建于1958年，是新中国第一个肿瘤专科医院，也是亚洲地区最大的肿瘤防治研究中心，国家癌症中心依托单位。",
    "route": "乘坐地铁10号线潘家园站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "09:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h018",
    "hosname": "首都医科大学附属北京地坛医院",
    "hoscode": "134_0",
    "hostype": "5",
    "provinceCode": "110000",
    "cityCode": "110100",
    "districtCode": "110118",
    "address": "北京市丰台区南四环西路119号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkY0RjRGIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "首都医科大学附属北京天坛医院始建于1956年，以神经外科为先导，以神经科学集群为特色，集医、教、研、防为一体的三级甲等综合医院。",
    "route": "乘坐地铁9号线丰台科技园站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h016",
    "hosname": "复旦大学附属中山医院",
    "hoscode": "2000_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310104",
    "address": "上海市徐汇区枫林路180号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDAzMzY2IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "复旦大学附属中山医院创建于1936年，是中国人自己创办的第一所大型综合性医院，以心、肝、肾、肺等器官疾病诊治为特色，三级甲等医院。",
    "route": "乘坐地铁4号线、7号线东安路站下车，步行约400米。",
    "status": 1,
    "bookingRule": {
      "cycle": 14,
      "releaseTime": "07:30",
      "stopTime": "16:00",
      "quitDay": 1,
      "quitTime": "14:00",
      "rule": [
        "预约周期：14天",
        "放号时间：07:30"
      ]
    }
  },
  {
    "id": "h017",
    "hosname": "复旦大学附属华山医院",
    "hoscode": "2001_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310106",
    "address": "上海市静安区乌鲁木齐中路12号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA2NkNDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "复旦大学附属华山医院创建于1907年，是国家卫生计生委委属医院，以神经外科、神经内科、皮肤科、手外科为特色的三级甲等综合性医院。",
    "route": "乘坐地铁1号线、7号线常熟路站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 14,
      "releaseTime": "08:00",
      "stopTime": "15:00",
      "quitDay": 1,
      "quitTime": "12:00",
      "rule": [
        "预约周期：14天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h018",
    "hosname": "上海交通大学医学院附属瑞金医院",
    "hoscode": "2002_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310101",
    "address": "上海市黄浦区瑞金二路197号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjQ0MwMDAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "上海交通大学医学院附属瑞金医院建于1907年，是一所集医疗、教学、科研为一体的三级甲等综合性医院，以血液科、内分泌科、烧伤科闻名全国。",
    "route": "乘坐地铁1号线陕西南路站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "17:00",
      "quitDay": 1,
      "quitTime": "15:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h019",
    "hosname": "上海交通大学医学院附属仁济医院",
    "hoscode": "2003_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310115",
    "address": "上海市浦东新区浦建路160号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA5OTRDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "上海交通大学医学院附属仁济医院始建于1844年，是上海开埠后第一所西医医院，集医疗、教学、科研于一体的三级甲等综合性医院，消化内科为特色。",
    "route": "乘坐地铁4号线、6号线蓝村路站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "16:00",
      "quitDay": 1,
      "quitTime": "14:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h020",
    "hosname": "上海交通大学医学院附属新华医院",
    "hoscode": "2004_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310110",
    "address": "上海市杨浦区控江路1665号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY2NjAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "上海交通大学医学院附属新华医院创建于1958年，是新中国成立以来上海自行设计建设的首家综合性医院，以儿科和心血管内外科为特色。",
    "route": "乘坐地铁8号线江浦路站下车，步行约300米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "16:00",
      "quitDay": 1,
      "quitTime": "14:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h021",
    "hosname": "上海市第一人民医院",
    "hoscode": "2005_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310109",
    "address": "上海市虹口区武进路85号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNjYwMENDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "上海市第一人民医院始建于1864年，是上海建院最早的综合性西医医院，集医疗、教学、科研、预防为一体的三级甲等综合性医院，眼科为特色。",
    "route": "乘坐地铁10号线四川北路站下车，步行约400米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "16:00",
      "quitDay": 1,
      "quitTime": "14:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h022",
    "hosname": "上海市第六人民医院",
    "hoscode": "2006_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310104",
    "address": "上海市徐汇区宜山路600号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA5OTk5IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "上海市第六人民医院始建于1904年，是集医疗、教学、科研为一体的三级甲等综合性大型医院，以骨科、内分泌代谢科、耳鼻咽喉科为特色。",
    "route": "乘坐地铁9号线桂林路站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "16:00",
      "quitDay": 1,
      "quitTime": "14:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h023",
    "hosname": "上海市第十人民医院",
    "hoscode": "2007_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310106",
    "address": "上海市静安区延长中路301号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjQ0M2NjAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "上海市第十人民医院创建于1910年，是集医疗、教学、科研、预防为一体的三级甲等综合性医院，以心血管、消化、肿瘤为特色。",
    "route": "乘坐地铁1号线延长路站下车，步行约300米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "16:00",
      "quitDay": 1,
      "quitTime": "14:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h024",
    "hosname": "海军军医大学第一附属医院",
    "hoscode": "2008_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310110",
    "address": "上海市杨浦区长海路168号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA2NjY2IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "海军军医大学第一附属医院（长海医院）创建于1949年，是集医疗、教学、科研为一体的现代化大型综合性三级甲等医院，以烧伤科、消化内科、心血管外科闻名。",
    "route": "乘坐地铁8号线翔殷路站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "15:00",
      "quitDay": 1,
      "quitTime": "13:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h025",
    "hosname": "海军军医大学第二附属医院",
    "hoscode": "2009_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310101",
    "address": "上海市黄浦区凤阳路415号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzM2NjAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "海军军医大学第二附属医院（长征医院）创建于1900年，是集医疗、教学、科研为一体的三级甲等综合性医院，以骨科、器官移植、泌尿外科为特色。",
    "route": "乘坐地铁1号线、2号线、8号线人民广场站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "15:00",
      "quitDay": 1,
      "quitTime": "13:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h026",
    "hosname": "复旦大学附属妇产科医院",
    "hoscode": "2010_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310101",
    "address": "上海市黄浦区方斜路419号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkYzMzk5IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "复旦大学附属妇产科医院（红房子医院）创建于1884年，是集医疗、教学、科研于一体的三级甲等妇产科专科医院，国内历史最悠久的妇产科医院之一。",
    "route": "乘坐地铁8号线、9号线陆家浜路站下车，步行约400米。",
    "status": 1,
    "bookingRule": {
      "cycle": 14,
      "releaseTime": "08:00",
      "stopTime": "15:00",
      "quitDay": 1,
      "quitTime": "12:00",
      "rule": [
        "预约周期：14天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h027",
    "hosname": "上海儿童医学中心",
    "hoscode": "2011_0",
    "hostype": "1",
    "provinceCode": "310000",
    "cityCode": "310100",
    "districtCode": "310115",
    "address": "上海市浦东新区东方路1678号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzNDQ0ZGIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "上海交通大学医学院附属上海儿童医学中心创建于1998年，是集医疗、科研、教学于一体的三级甲等儿童专科医院，以小儿心血管、血液肿瘤为特色。",
    "route": "乘坐地铁6号线儿童医学中心站下车即到。",
    "status": 1,
    "bookingRule": {
      "cycle": 14,
      "releaseTime": "08:00",
      "stopTime": "15:00",
      "quitDay": 1,
      "quitTime": "12:00",
      "rule": [
        "预约周期：14天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h028",
    "hosname": "中山大学附属第一医院",
    "hoscode": "3000_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440100",
    "districtCode": "440104",
    "address": "广州市越秀区中山二路58号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA2NjMzIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中山大学附属第一医院始建于1910年，是国内一流、国际知名的现代化三级甲等综合性医院，以肾内科、神经内科、普外科为特色。",
    "route": "乘坐地铁1号线烈士陵园站下车，步行约300米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h029",
    "hosname": "中山大学孙逸仙纪念医院",
    "hoscode": "3001_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440100",
    "districtCode": "440104",
    "address": "广州市越秀区沿江西路107号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA5OTMzIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中山大学孙逸仙纪念医院（中山二院）创建于1835年，是中国第一家西医院，集医疗、教学、科研为一体的三级甲等综合性医院，以乳腺肿瘤、心血管为特色。",
    "route": "乘坐地铁6号线一德路站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h030",
    "hosname": "中山大学附属第三医院",
    "hoscode": "3002_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440100",
    "districtCode": "440106",
    "address": "广州市天河区天河路600号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzM5OTY2IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中山大学附属第三医院始建于1971年，是集医疗、教学、科研及预防保健为一体的大型综合性三级甲等医院，以肝病、内分泌、神经科为特色。",
    "route": "乘坐地铁3号线岗顶站下车即到。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h031",
    "hosname": "南方医科大学南方医院",
    "hoscode": "3003_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440100",
    "districtCode": "440111",
    "address": "广州市白云区广州大道北1838号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA2NjAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "南方医科大学南方医院创建于1941年，是集医疗、教学、科研和预防保健为一体的大型综合性三级甲等医院，以消化病、肾病、感染科为特色。",
    "route": "乘坐地铁3号线京溪南方医院站下车即到。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h032",
    "hosname": "广东省人民医院",
    "hoscode": "3004_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440100",
    "districtCode": "440104",
    "address": "广州市越秀区中山二路106号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjQ0MzMzAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "广东省人民医院创建于1946年，是集医教研于一体的大型三级甲等综合性医院，以心血管病、老年医学、精神心理为特色，广东省心血管病研究所依托单位。",
    "route": "乘坐地铁1号线烈士陵园站下车，步行约400米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:30",
      "quitDay": 1,
      "quitTime": "10:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h033",
    "hosname": "广州医科大学附属第一医院",
    "hoscode": "3005_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440100",
    "districtCode": "440104",
    "address": "广州市越秀区沿江路151号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY5OTAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "广州医科大学附属第一医院始建于1903年，是集医疗、教学、科研、保健、康复、急救于一体的大型三级甲等医院，以呼吸疾病为特色，国家呼吸医学中心。",
    "route": "乘坐地铁6号线一德路站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h034",
    "hosname": "广州市第一人民医院",
    "hoscode": "3006_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440100",
    "districtCode": "440104",
    "address": "广州市越秀区盘福路1号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA5OUNDIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "广州市第一人民医院始建于1899年，是集医疗、教学、科研为一体的大型三级甲等综合性医院，以消化内科、心血管内科、老年病科为特色。",
    "route": "乘坐地铁2号线纪念堂站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h035",
    "hosname": "中山大学肿瘤防治中心",
    "hoscode": "3007_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440100",
    "districtCode": "440104",
    "address": "广州市越秀区东风东路651号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOTkwMDMzIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中山大学肿瘤防治中心创建于1964年，是国内规模最大、学术力量最雄厚的集医疗、教学、科研、预防于一体的肿瘤学基地之一，国家癌症中心南方分中心。",
    "route": "乘坐地铁5号线区庄站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "11:00",
      "quitDay": 1,
      "quitTime": "09:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h036",
    "hosname": "深圳市人民医院",
    "hoscode": "3008_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440300",
    "districtCode": "440303",
    "address": "深圳市罗湖区东门北路1017号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDAzMzk5IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "深圳市人民医院始建于1946年，是集医疗、教学、科研、保健为一体的深圳市最大的现代化三级甲等综合性医院，以呼吸、消化、心血管为特色。",
    "route": "乘坐地铁3号线翠竹站下车，步行约300米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h037",
    "hosname": "北京大学深圳医院",
    "hoscode": "3009_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440300",
    "districtCode": "440304",
    "address": "深圳市福田区莲花路1120号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjOTkzMzAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "北京大学深圳医院创建于1999年，是深圳市政府投资建成的集医疗、教学、科研、预防为一体的现代化三级甲等综合性医院，以生殖医学、微创外科为特色。",
    "route": "乘坐地铁10号线冬瓜岭站下车，步行约500米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h038",
    "hosname": "深圳市第二人民医院",
    "hoscode": "3010_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440300",
    "districtCode": "440304",
    "address": "深圳市福田区笋岗西路3002号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNjYwMDk5IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "深圳市第二人民医院始建于1979年，是集医疗、教学、科研、预防、保健、康复为一体的三级甲等综合性医院，以骨科、神经外科、烧伤科为特色。",
    "route": "乘坐地铁7号线黄木岗站下车，步行约400米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h039",
    "hosname": "香港大学深圳医院",
    "hoscode": "3011_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440300",
    "districtCode": "440304",
    "address": "深圳市福田区海园一路1号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjQ0MwMDY2IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "香港大学深圳医院是由深圳市政府全额投资、引进香港大学现代化管理模式的大型综合性公立医院，以全科医学、器官移植、生殖医学为特色。",
    "route": "乘坐地铁9号线深湾站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "17:00",
      "quitDay": 1,
      "quitTime": "15:00",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h040",
    "hosname": "深圳市第三人民医院",
    "hoscode": "3012_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440300",
    "districtCode": "440307",
    "address": "深圳市龙岗区布澜路29号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA5OTY2IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "深圳市第三人民医院始建于1985年，是集医疗、教学、科研为一体的三级甲等研究型医院，以感染性疾病、肝病、肺病为特色，国家感染性疾病临床医学研究中心。",
    "route": "乘坐地铁10号线禾花站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h041",
    "hosname": "南方医科大学深圳医院",
    "hoscode": "3013_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440300",
    "districtCode": "440306",
    "address": "深圳市宝安区新湖路1333号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjQ0M2NjAwIiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "南方医科大学深圳医院是深圳市政府投资新建的集医疗、教学、科研为一体的三级甲等综合性医院，以消化、神经、骨科为特色。",
    "route": "乘坐地铁1号线新安站下车，步行约600米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  },
  {
    "id": "h042",
    "hosname": "中山大学附属第七医院",
    "hoscode": "3014_0",
    "hostype": "1",
    "provinceCode": "440000",
    "cityCode": "440300",
    "districtCode": "440311",
    "address": "深圳市光明区新湖街道圳园路628号",
    "logoData": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzM2Njk5IiByeD0iMTIiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzNiIgZmlsbD0iI2ZmZiIgcng9IjIiLz48L3N2Zz4=",
    "intro": "中山大学附属第七医院是深圳市政府投资建设、中山大学运营管理的直属附属医院，是集医疗、教学、科研为一体的三级甲等综合性医院。",
    "route": "乘坐地铁6号线科学公园站下车，步行约800米。",
    "status": 1,
    "bookingRule": {
      "cycle": 7,
      "releaseTime": "08:00",
      "stopTime": "12:00",
      "quitDay": 1,
      "quitTime": "10:30",
      "rule": [
        "预约周期：7天",
        "放号时间：08:00"
      ]
    }
  }
];

module.exports = { hospitals };

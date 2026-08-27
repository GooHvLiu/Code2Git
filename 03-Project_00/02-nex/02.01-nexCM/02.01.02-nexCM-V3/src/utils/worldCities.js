/**
 * 全球主要城市数据
 * 结构：国家 -> 城市列表
 * 每个城市包含：code（唯一编码）、nameZh（中文名）、nameEn（英文名）、lng（经度）、lat（纬度）
 * 覆盖全球各大洲主要国家和地区，约200+城市
 * 可根据客户实际部署地点灵活补充
 */

export const worldCities = [
  // ==================== 亚洲 Asia ====================
  {
    code: 'CN',
    nameZh: '中国',
    nameEn: 'China',
    cities: [
      { code: 'CN-WX', nameZh: '无锡', nameEn: 'Wuxi', lng: 120.30, lat: 31.57 },
      { code: 'CN-SH', nameZh: '上海', nameEn: 'Shanghai', lng: 121.47, lat: 31.23 },
      { code: 'CN-BJ', nameZh: '北京', nameEn: 'Beijing', lng: 116.40, lat: 39.90 },
      { code: 'CN-GZ', nameZh: '广州', nameEn: 'Guangzhou', lng: 113.27, lat: 23.13 },
      { code: 'CN-SZ', nameZh: '深圳', nameEn: 'Shenzhen', lng: 114.05, lat: 22.55 },
      { code: 'CN-HZ', nameZh: '杭州', nameEn: 'Hangzhou', lng: 120.15, lat: 30.28 },
      { code: 'CN-NJ', nameZh: '南京', nameEn: 'Nanjing', lng: 118.78, lat: 32.04 },
      { code: 'CN-SU', nameZh: '苏州', nameEn: 'Suzhou', lng: 120.62, lat: 31.32 },
      { code: 'CN-CD', nameZh: '成都', nameEn: 'Chengdu', lng: 104.06, lat: 30.67 },
      { code: 'CN-WH', nameZh: '武汉', nameEn: 'Wuhan', lng: 114.31, lat: 30.52 },
      { code: 'CN-XA', nameZh: '西安', nameEn: "Xi'an", lng: 108.95, lat: 34.27 },
      { code: 'CN-CQ', nameZh: '重庆', nameEn: 'Chongqing', lng: 106.55, lat: 29.56 },
      { code: 'CN-TJ', nameZh: '天津', nameEn: 'Tianjin', lng: 117.20, lat: 39.13 },
      { code: 'CN-QD', nameZh: '青岛', nameEn: 'Qingdao', lng: 120.38, lat: 36.07 },
      { code: 'CN-DL', nameZh: '大连', nameEn: 'Dalian', lng: 121.62, lat: 38.92 },
      { code: 'CN-XM', nameZh: '厦门', nameEn: 'Xiamen', lng: 118.08, lat: 24.48 },
      { code: 'CN-FZ', nameZh: '福州', nameEn: 'Fuzhou', lng: 119.30, lat: 26.08 },
      { code: 'CN-CS', nameZh: '长沙', nameEn: 'Changsha', lng: 112.94, lat: 28.23 },
      { code: 'CN-ZZ', nameZh: '郑州', nameEn: 'Zhengzhou', lng: 113.62, lat: 34.75 },
      { code: 'CN-JN', nameZh: '济南', nameEn: 'Jinan', lng: 117.00, lat: 36.65 },
      { code: 'CN-HF', nameZh: '合肥', nameEn: 'Hefei', lng: 117.27, lat: 31.86 },
      { code: 'CN-NB', nameZh: '宁波', nameEn: 'Ningbo', lng: 121.55, lat: 29.87 },
      { code: 'CN-WZ', nameZh: '温州', nameEn: 'Wenzhou', lng: 120.67, lat: 28.00 },
      { code: 'CN-DG', nameZh: '东莞', nameEn: 'Dongguan', lng: 113.75, lat: 23.02 },
      { code: 'CN-FS', nameZh: '佛山', nameEn: 'Foshan', lng: 113.12, lat: 23.02 },
      { code: 'CN-ZH', nameZh: '珠海', nameEn: 'Zhuhai', lng: 113.58, lat: 22.27 },
      { code: 'CN-HK', nameZh: '香港', nameEn: 'Hong Kong', lng: 114.17, lat: 22.32 },
      { code: 'CN-MO', nameZh: '澳门', nameEn: 'Macau', lng: 113.55, lat: 22.20 },
      { code: 'CN-TP', nameZh: '台北', nameEn: 'Taipei', lng: 121.56, lat: 25.03 },
    ]
  },
  {
    code: 'JP',
    nameZh: '日本',
    nameEn: 'Japan',
    cities: [
      { code: 'JP-TYO', nameZh: '东京', nameEn: 'Tokyo', lng: 139.69, lat: 35.69 },
      { code: 'JP-OSA', nameZh: '大阪', nameEn: 'Osaka', lng: 135.50, lat: 34.69 },
      { code: 'JP-KYT', nameZh: '京都', nameEn: 'Kyoto', lng: 135.77, lat: 35.01 },
      { code: 'JP-NGO', nameZh: '名古屋', nameEn: 'Nagoya', lng: 136.91, lat: 35.18 },
      { code: 'JP-YOK', nameZh: '横滨', nameEn: 'Yokohama', lng: 139.64, lat: 35.44 },
      { code: 'JP-KOB', nameZh: '神户', nameEn: 'Kobe', lng: 135.20, lat: 34.69 },
      { code: 'JP-FUK', nameZh: '福冈', nameEn: 'Fukuoka', lng: 130.40, lat: 33.59 },
      { code: 'JP-SAP', nameZh: '札幌', nameEn: 'Sapporo', lng: 141.35, lat: 43.07 },
    ]
  },
  {
    code: 'KR',
    nameZh: '韩国',
    nameEn: 'South Korea',
    cities: [
      { code: 'KR-SEL', nameZh: '首尔', nameEn: 'Seoul', lng: 126.98, lat: 37.57 },
      { code: 'KR-BUS', nameZh: '釜山', nameEn: 'Busan', lng: 129.04, lat: 35.10 },
      { code: 'KR-ICN', nameZh: '仁川', nameEn: 'Incheon', lng: 126.70, lat: 37.46 },
      { code: 'KR-DAE', nameZh: '大邱', nameEn: 'Daegu', lng: 128.60, lat: 35.87 },
      { code: 'KR-GWA', nameZh: '光州', nameEn: 'Gwangju', lng: 126.85, lat: 35.16 },
    ]
  },
  {
    code: 'SG',
    nameZh: '新加坡',
    nameEn: 'Singapore',
    cities: [
      { code: 'SG-SIN', nameZh: '新加坡', nameEn: 'Singapore', lng: 103.82, lat: 1.35 },
    ]
  },
  {
    code: 'MY',
    nameZh: '马来西亚',
    nameEn: 'Malaysia',
    cities: [
      { code: 'MY-KUL', nameZh: '吉隆坡', nameEn: 'Kuala Lumpur', lng: 101.69, lat: 3.14 },
      { code: 'MY-PEN', nameZh: '槟城', nameEn: 'Penang', lng: 100.33, lat: 5.41 },
      { code: 'MY-JHB', nameZh: '新山', nameEn: 'Johor Bahru', lng: 103.78, lat: 1.49 },
    ]
  },
  {
    code: 'TH',
    nameZh: '泰国',
    nameEn: 'Thailand',
    cities: [
      { code: 'TH-BKK', nameZh: '曼谷', nameEn: 'Bangkok', lng: 100.50, lat: 13.75 },
      { code: 'TH-CNX', nameZh: '清迈', nameEn: 'Chiang Mai', lng: 98.99, lat: 18.79 },
    ]
  },
  {
    code: 'VN',
    nameZh: '越南',
    nameEn: 'Vietnam',
    cities: [
      { code: 'VN-HAN', nameZh: '河内', nameEn: 'Hanoi', lng: 105.85, lat: 21.03 },
      { code: 'VN-HCM', nameZh: '胡志明市', nameEn: 'Ho Chi Minh City', lng: 106.63, lat: 10.82 },
    ]
  },
  {
    code: 'ID',
    nameZh: '印度尼西亚',
    nameEn: 'Indonesia',
    cities: [
      { code: 'ID-JKT', nameZh: '雅加达', nameEn: 'Jakarta', lng: 106.85, lat: -6.21 },
      { code: 'ID-SUB', nameZh: '泗水', nameEn: 'Surabaya', lng: 112.75, lat: -7.25 },
    ]
  },
  {
    code: 'PH',
    nameZh: '菲律宾',
    nameEn: 'Philippines',
    cities: [
      { code: 'PH-MNL', nameZh: '马尼拉', nameEn: 'Manila', lng: 120.98, lat: 14.60 },
    ]
  },
  {
    code: 'IN',
    nameZh: '印度',
    nameEn: 'India',
    cities: [
      { code: 'IN-DEL', nameZh: '新德里', nameEn: 'New Delhi', lng: 77.21, lat: 28.61 },
      { code: 'IN-BOM', nameZh: '孟买', nameEn: 'Mumbai', lng: 72.88, lat: 19.08 },
      { code: 'IN-BLR', nameZh: '班加罗尔', nameEn: 'Bangalore', lng: 77.59, lat: 12.97 },
      { code: 'IN-MAA', nameZh: '金奈', nameEn: 'Chennai', lng: 80.27, lat: 13.08 },
      { code: 'IN-HYD', nameZh: '海得拉巴', nameEn: 'Hyderabad', lng: 78.49, lat: 17.38 },
    ]
  },
  {
    code: 'AE',
    nameZh: '阿联酋',
    nameEn: 'UAE',
    cities: [
      { code: 'AE-DXB', nameZh: '迪拜', nameEn: 'Dubai', lng: 55.27, lat: 25.20 },
      { code: 'AE-AUH', nameZh: '阿布扎比', nameEn: 'Abu Dhabi', lng: 54.37, lat: 24.47 },
    ]
  },
  {
    code: 'SA',
    nameZh: '沙特阿拉伯',
    nameEn: 'Saudi Arabia',
    cities: [
      { code: 'SA-RUH', nameZh: '利雅得', nameEn: 'Riyadh', lng: 46.72, lat: 24.71 },
      { code: 'SA-JED', nameZh: '吉达', nameEn: 'Jeddah', lng: 39.19, lat: 21.49 },
    ]
  },
  {
    code: 'IL',
    nameZh: '以色列',
    nameEn: 'Israel',
    cities: [
      { code: 'IL-TLV', nameZh: '特拉维夫', nameEn: 'Tel Aviv', lng: 34.78, lat: 32.08 },
      { code: 'IL-JRS', nameZh: '耶路撒冷', nameEn: 'Jerusalem', lng: 35.21, lat: 31.77 },
    ]
  },
  {
    code: 'TR',
    nameZh: '土耳其',
    nameEn: 'Turkey',
    cities: [
      { code: 'TR-IST', nameZh: '伊斯坦布尔', nameEn: 'Istanbul', lng: 28.98, lat: 41.01 },
      { code: 'TR-ANK', nameZh: '安卡拉', nameEn: 'Ankara', lng: 32.86, lat: 39.93 },
      { code: 'TR-IZM', nameZh: '伊兹密尔', nameEn: 'Izmir', lng: 27.14, lat: 38.42 },
    ]
  },

  // ==================== 欧洲 Europe ====================
  {
    code: 'DE',
    nameZh: '德国',
    nameEn: 'Germany',
    cities: [
      { code: 'DE-BER', nameZh: '柏林', nameEn: 'Berlin', lng: 13.40, lat: 52.52 },
      { code: 'DE-MUC', nameZh: '慕尼黑', nameEn: 'Munich', lng: 11.58, lat: 48.14 },
      { code: 'DE-FRA', nameZh: '法兰克福', nameEn: 'Frankfurt', lng: 8.68, lat: 50.11 },
      { code: 'DE-HAM', nameZh: '汉堡', nameEn: 'Hamburg', lng: 9.99, lat: 53.55 },
      { code: 'DE-COL', nameZh: '科隆', nameEn: 'Cologne', lng: 6.96, lat: 50.94 },
      { code: 'DE-DUS', nameZh: '杜塞尔多夫', nameEn: 'Düsseldorf', lng: 6.77, lat: 51.23 },
      { code: 'DE-STU', nameZh: '斯图加特', nameEn: 'Stuttgart', lng: 9.18, lat: 48.78 },
      { code: 'DE-LEJ', nameZh: '莱比锡', nameEn: 'Leipzig', lng: 12.37, lat: 51.34 },
    ]
  },
  {
    code: 'GB',
    nameZh: '英国',
    nameEn: 'United Kingdom',
    cities: [
      { code: 'GB-LON', nameZh: '伦敦', nameEn: 'London', lng: -0.13, lat: 51.51 },
      { code: 'GB-MAN', nameZh: '曼彻斯特', nameEn: 'Manchester', lng: -2.24, lat: 53.48 },
      { code: 'GB-BIR', nameZh: '伯明翰', nameEn: 'Birmingham', lng: -1.90, lat: 52.48 },
      { code: 'GB-EDI', nameZh: '爱丁堡', nameEn: 'Edinburgh', lng: -3.19, lat: 55.95 },
      { code: 'GB-GLA', nameZh: '格拉斯哥', nameEn: 'Glasgow', lng: -4.25, lat: 55.86 },
    ]
  },
  {
    code: 'FR',
    nameZh: '法国',
    nameEn: 'France',
    cities: [
      { code: 'FR-PAR', nameZh: '巴黎', nameEn: 'Paris', lng: 2.35, lat: 48.86 },
      { code: 'FR-MAR', nameZh: '马赛', nameEn: 'Marseille', lng: 5.37, lat: 43.30 },
      { code: 'FR-LYO', nameZh: '里昂', nameEn: 'Lyon', lng: 4.84, lat: 45.76 },
      { code: 'FR-TLS', nameZh: '图卢兹', nameEn: 'Toulouse', lng: 1.44, lat: 43.60 },
      { code: 'FR-NCE', nameZh: '尼斯', nameEn: 'Nice', lng: 7.27, lat: 43.71 },
    ]
  },
  {
    code: 'IT',
    nameZh: '意大利',
    nameEn: 'Italy',
    cities: [
      { code: 'IT-ROM', nameZh: '罗马', nameEn: 'Rome', lng: 12.50, lat: 41.90 },
      { code: 'IT-MIL', nameZh: '米兰', nameEn: 'Milan', lng: 9.19, lat: 45.46 },
      { code: 'IT-NAP', nameZh: '那不勒斯', nameEn: 'Naples', lng: 14.27, lat: 40.85 },
      { code: 'IT-TUR', nameZh: '都灵', nameEn: 'Turin', lng: 7.68, lat: 45.07 },
      { code: 'IT-FLR', nameZh: '佛罗伦萨', nameEn: 'Florence', lng: 11.25, lat: 43.77 },
      { code: 'IT-VEN', nameZh: '威尼斯', nameEn: 'Venice', lng: 12.32, lat: 45.44 },
    ]
  },
  {
    code: 'ES',
    nameZh: '西班牙',
    nameEn: 'Spain',
    cities: [
      { code: 'ES-MAD', nameZh: '马德里', nameEn: 'Madrid', lng: -3.70, lat: 40.42 },
      { code: 'ES-BCN', nameZh: '巴塞罗那', nameEn: 'Barcelona', lng: 2.17, lat: 41.39 },
      { code: 'ES-VLC', nameZh: '瓦伦西亚', nameEn: 'Valencia', lng: -0.38, lat: 39.47 },
      { code: 'ES-SEV', nameZh: '塞维利亚', nameEn: 'Seville', lng: -5.99, lat: 37.39 },
    ]
  },
  {
    code: 'NL',
    nameZh: '荷兰',
    nameEn: 'Netherlands',
    cities: [
      { code: 'NL-AMS', nameZh: '阿姆斯特丹', nameEn: 'Amsterdam', lng: 4.90, lat: 52.37 },
      { code: 'NL-RTM', nameZh: '鹿特丹', nameEn: 'Rotterdam', lng: 4.48, lat: 51.92 },
      { code: 'NL-EIN', nameZh: '埃因霍温', nameEn: 'Eindhoven', lng: 5.47, lat: 51.44 },
    ]
  },
  {
    code: 'BE',
    nameZh: '比利时',
    nameEn: 'Belgium',
    cities: [
      { code: 'BE-BRU', nameZh: '布鲁塞尔', nameEn: 'Brussels', lng: 4.35, lat: 50.85 },
      { code: 'BE-ANR', nameZh: '安特卫普', nameEn: 'Antwerp', lng: 4.40, lat: 51.22 },
    ]
  },
  {
    code: 'CH',
    nameZh: '瑞士',
    nameEn: 'Switzerland',
    cities: [
      { code: 'CH-ZRH', nameZh: '苏黎世', nameEn: 'Zurich', lng: 8.55, lat: 47.38 },
      { code: 'CH-GVA', nameZh: '日内瓦', nameEn: 'Geneva', lng: 6.14, lat: 46.20 },
      { code: 'CH-BSL', nameZh: '巴塞尔', nameEn: 'Basel', lng: 7.59, lat: 47.56 },
    ]
  },
  {
    code: 'AT',
    nameZh: '奥地利',
    nameEn: 'Austria',
    cities: [
      { code: 'AT-VIE', nameZh: '维也纳', nameEn: 'Vienna', lng: 16.37, lat: 48.21 },
      { code: 'AT-GRZ', nameZh: '格拉茨', nameEn: 'Graz', lng: 15.44, lat: 47.07 },
    ]
  },
  {
    code: 'SE',
    nameZh: '瑞典',
    nameEn: 'Sweden',
    cities: [
      { code: 'SE-STO', nameZh: '斯德哥尔摩', nameEn: 'Stockholm', lng: 18.07, lat: 59.33 },
      { code: 'SE-GOT', nameZh: '哥德堡', nameEn: 'Gothenburg', lng: 11.97, lat: 57.71 },
    ]
  },
  {
    code: 'NO',
    nameZh: '挪威',
    nameEn: 'Norway',
    cities: [
      { code: 'NO-OSL', nameZh: '奥斯陆', nameEn: 'Oslo', lng: 10.75, lat: 59.91 },
    ]
  },
  {
    code: 'DK',
    nameZh: '丹麦',
    nameEn: 'Denmark',
    cities: [
      { code: 'DK-CPH', nameZh: '哥本哈根', nameEn: 'Copenhagen', lng: 12.57, lat: 55.68 },
    ]
  },
  {
    code: 'FI',
    nameZh: '芬兰',
    nameEn: 'Finland',
    cities: [
      { code: 'FI-HEL', nameZh: '赫尔辛基', nameEn: 'Helsinki', lng: 24.94, lat: 60.17 },
    ]
  },
  {
    code: 'PL',
    nameZh: '波兰',
    nameEn: 'Poland',
    cities: [
      { code: 'PL-WAW', nameZh: '华沙', nameEn: 'Warsaw', lng: 21.01, lat: 52.23 },
      { code: 'PL-KRK', nameZh: '克拉科夫', nameEn: 'Krakow', lng: 19.94, lat: 50.06 },
    ]
  },
  {
    code: 'CZ',
    nameZh: '捷克',
    nameEn: 'Czech Republic',
    cities: [
      { code: 'CZ-PRG', nameZh: '布拉格', nameEn: 'Prague', lng: 14.42, lat: 50.08 },
    ]
  },
  {
    code: 'HU',
    nameZh: '匈牙利',
    nameEn: 'Hungary',
    cities: [
      { code: 'HU-BUD', nameZh: '布达佩斯', nameEn: 'Budapest', lng: 19.04, lat: 47.50 },
    ]
  },
  {
    code: 'PT',
    nameZh: '葡萄牙',
    nameEn: 'Portugal',
    cities: [
      { code: 'PT-LIS', nameZh: '里斯本', nameEn: 'Lisbon', lng: -9.14, lat: 38.72 },
      { code: 'PT-OPO', nameZh: '波尔图', nameEn: 'Porto', lng: -8.61, lat: 41.15 },
    ]
  },
  {
    code: 'GR',
    nameZh: '希腊',
    nameEn: 'Greece',
    cities: [
      { code: 'GR-ATH', nameZh: '雅典', nameEn: 'Athens', lng: 23.73, lat: 37.98 },
    ]
  },
  {
    code: 'RU',
    nameZh: '俄罗斯',
    nameEn: 'Russia',
    cities: [
      { code: 'RU-MOW', nameZh: '莫斯科', nameEn: 'Moscow', lng: 37.62, lat: 55.75 },
      { code: 'RU-LED', nameZh: '圣彼得堡', nameEn: 'Saint Petersburg', lng: 30.31, lat: 59.94 },
      { code: 'RU-NVS', nameZh: '新西伯利亚', nameEn: 'Novosibirsk', lng: 82.93, lat: 55.04 },
    ]
  },
  {
    code: 'UA',
    nameZh: '乌克兰',
    nameEn: 'Ukraine',
    cities: [
      { code: 'UA-KBP', nameZh: '基辅', nameEn: 'Kyiv', lng: 30.52, lat: 50.45 },
    ]
  },

  // ==================== 北美洲 North America ====================
  {
    code: 'US',
    nameZh: '美国',
    nameEn: 'United States',
    cities: [
      { code: 'US-NYC', nameZh: '纽约', nameEn: 'New York', lng: -74.00, lat: 40.71 },
      { code: 'US-LAX', nameZh: '洛杉矶', nameEn: 'Los Angeles', lng: -118.24, lat: 34.05 },
      { code: 'US-CHI', nameZh: '芝加哥', nameEn: 'Chicago', lng: -87.63, lat: 41.88 },
      { code: 'US-HOU', nameZh: '休斯顿', nameEn: 'Houston', lng: -95.37, lat: 29.76 },
      { code: 'US-PHX', nameZh: '凤凰城', nameEn: 'Phoenix', lng: -112.07, lat: 33.45 },
      { code: 'US-PHL', nameZh: '费城', nameEn: 'Philadelphia', lng: -75.17, lat: 39.95 },
      { code: 'US-SAN', nameZh: '圣安东尼奥', nameEn: 'San Antonio', lng: -98.49, lat: 29.42 },
      { code: 'US-SDG', nameZh: '圣地亚哥', nameEn: 'San Diego', lng: -117.16, lat: 32.72 },
      { code: 'US-DAL', nameZh: '达拉斯', nameEn: 'Dallas', lng: -96.80, lat: 32.78 },
      { code: 'US-SJC', nameZh: '圣何塞', nameEn: 'San Jose', lng: -121.89, lat: 37.34 },
      { code: 'US-AUS', nameZh: '奥斯汀', nameEn: 'Austin', lng: -97.74, lat: 30.27 },
      { code: 'US-SFO', nameZh: '旧金山', nameEn: 'San Francisco', lng: -122.42, lat: 37.77 },
      { code: 'US-SEA', nameZh: '西雅图', nameEn: 'Seattle', lng: -122.33, lat: 47.61 },
      { code: 'US-DEN', nameZh: '丹佛', nameEn: 'Denver', lng: -104.99, lat: 39.74 },
      { code: 'US-BOS', nameZh: '波士顿', nameEn: 'Boston', lng: -71.06, lat: 42.36 },
      { code: 'US-ATL', nameZh: '亚特兰大', nameEn: 'Atlanta', lng: -84.39, lat: 33.75 },
      { code: 'US-MIA', nameZh: '迈阿密', nameEn: 'Miami', lng: -80.19, lat: 25.76 },
      { code: 'US-WAS', nameZh: '华盛顿', nameEn: 'Washington D.C.', lng: -77.04, lat: 38.91 },
      { code: 'US-DET', nameZh: '底特律', nameEn: 'Detroit', lng: -83.05, lat: 42.33 },
      { code: 'US-MIN', nameZh: '明尼阿波利斯', nameEn: 'Minneapolis', lng: -93.27, lat: 44.98 },
      { code: 'US-PIT', nameZh: '匹兹堡', nameEn: 'Pittsburgh', lng: -79.99, lat: 40.44 },
      { code: 'US-CLE', nameZh: '克利夫兰', nameEn: 'Cleveland', lng: -81.69, lat: 41.50 },
      { code: 'US-ORL', nameZh: '奥兰多', nameEn: 'Orlando', lng: -81.38, lat: 28.54 },
      { code: 'US-LAS', nameZh: '拉斯维加斯', nameEn: 'Las Vegas', lng: -115.14, lat: 36.17 },
    ]
  },
  {
    code: 'CA',
    nameZh: '加拿大',
    nameEn: 'Canada',
    cities: [
      { code: 'CA-TOR', nameZh: '多伦多', nameEn: 'Toronto', lng: -79.38, lat: 43.65 },
      { code: 'CA-MON', nameZh: '蒙特利尔', nameEn: 'Montreal', lng: -73.57, lat: 45.50 },
      { code: 'CA-VAN', nameZh: '温哥华', nameEn: 'Vancouver', lng: -123.12, lat: 49.28 },
      { code: 'CA-CAL', nameZh: '卡尔加里', nameEn: 'Calgary', lng: -114.07, lat: 51.05 },
      { code: 'CA-OTT', nameZh: '渥太华', nameEn: 'Ottawa', lng: -75.70, lat: 45.42 },
      { code: 'CA-EDM', nameZh: '埃德蒙顿', nameEn: 'Edmonton', lng: -113.49, lat: 53.55 },
    ]
  },
  {
    code: 'MX',
    nameZh: '墨西哥',
    nameEn: 'Mexico',
    cities: [
      { code: 'MX-MEX', nameZh: '墨西哥城', nameEn: 'Mexico City', lng: -99.13, lat: 19.43 },
      { code: 'MX-GDL', nameZh: '瓜达拉哈拉', nameEn: 'Guadalajara', lng: -103.35, lat: 20.67 },
      { code: 'MX-MTY', nameZh: '蒙特雷', nameEn: 'Monterrey', lng: -100.32, lat: 25.67 },
    ]
  },

  // ==================== 南美洲 South America ====================
  {
    code: 'BR',
    nameZh: '巴西',
    nameEn: 'Brazil',
    cities: [
      { code: 'BR-SAO', nameZh: '圣保罗', nameEn: 'São Paulo', lng: -46.63, lat: -23.55 },
      { code: 'BR-RIO', nameZh: '里约热内卢', nameEn: 'Rio de Janeiro', lng: -43.17, lat: -22.91 },
      { code: 'BR-BSB', nameZh: '巴西利亚', nameEn: 'Brasília', lng: -47.88, lat: -15.79 },
      { code: 'BR-BEL', nameZh: '贝洛奥里藏特', nameEn: 'Belo Horizonte', lng: -43.94, lat: -19.92 },
      { code: 'BR-POA', nameZh: '阿雷格里港', nameEn: 'Porto Alegre', lng: -51.23, lat: -30.03 },
    ]
  },
  {
    code: 'AR',
    nameZh: '阿根廷',
    nameEn: 'Argentina',
    cities: [
      { code: 'AR-BUE', nameZh: '布宜诺斯艾利斯', nameEn: 'Buenos Aires', lng: -58.38, lat: -34.60 },
      { code: 'AR-COR', nameZh: '科尔多瓦', nameEn: 'Córdoba', lng: -64.19, lat: -31.42 },
    ]
  },
  {
    code: 'CL',
    nameZh: '智利',
    nameEn: 'Chile',
    cities: [
      { code: 'CL-SCL', nameZh: '圣地亚哥', nameEn: 'Santiago', lng: -70.67, lat: -33.45 },
    ]
  },
  {
    code: 'CO',
    nameZh: '哥伦比亚',
    nameEn: 'Colombia',
    cities: [
      { code: 'CO-BOG', nameZh: '波哥大', nameEn: 'Bogotá', lng: -74.07, lat: 4.71 },
      { code: 'CO-MDE', nameZh: '麦德林', nameEn: 'Medellín', lng: -75.57, lat: 6.24 },
    ]
  },
  {
    code: 'PE',
    nameZh: '秘鲁',
    nameEn: 'Peru',
    cities: [
      { code: 'PE-LIM', nameZh: '利马', nameEn: 'Lima', lng: -77.04, lat: -12.05 },
    ]
  },

  // ==================== 非洲 Africa ====================
  {
    code: 'ZA',
    nameZh: '南非',
    nameEn: 'South Africa',
    cities: [
      { code: 'ZA-JNB', nameZh: '约翰内斯堡', nameEn: 'Johannesburg', lng: 28.05, lat: -26.20 },
      { code: 'ZA-CPT', nameZh: '开普敦', nameEn: 'Cape Town', lng: 18.42, lat: -33.92 },
      { code: 'ZA-DUR', nameZh: '德班', nameEn: 'Durban', lng: 31.03, lat: -29.86 },
    ]
  },
  {
    code: 'EG',
    nameZh: '埃及',
    nameEn: 'Egypt',
    cities: [
      { code: 'EG-CAI', nameZh: '开罗', nameEn: 'Cairo', lng: 31.24, lat: 30.04 },
      { code: 'EG-ALY', nameZh: '亚历山大', nameEn: 'Alexandria', lng: 29.92, lat: 31.20 },
    ]
  },
  {
    code: 'NG',
    nameZh: '尼日利亚',
    nameEn: 'Nigeria',
    cities: [
      { code: 'NG-LOS', nameZh: '拉各斯', nameEn: 'Lagos', lng: 3.38, lat: 6.46 },
      { code: 'NG-ABV', nameZh: '阿布贾', nameEn: 'Abuja', lng: 7.49, lat: 9.08 },
    ]
  },
  {
    code: 'KE',
    nameZh: '肯尼亚',
    nameEn: 'Kenya',
    cities: [
      { code: 'KE-NBO', nameZh: '内罗毕', nameEn: 'Nairobi', lng: 36.82, lat: -1.29 },
    ]
  },
  {
    code: 'MA',
    nameZh: '摩洛哥',
    nameEn: 'Morocco',
    cities: [
      { code: 'MA-CAS', nameZh: '卡萨布兰卡', nameEn: 'Casablanca', lng: -7.59, lat: 33.57 },
      { code: 'MA-RBA', nameZh: '拉巴特', nameEn: 'Rabat', lng: -6.84, lat: 34.02 },
    ]
  },

  // ==================== 大洋洲 Oceania ====================
  {
    code: 'AU',
    nameZh: '澳大利亚',
    nameEn: 'Australia',
    cities: [
      { code: 'AU-SYD', nameZh: '悉尼', nameEn: 'Sydney', lng: 151.21, lat: -33.87 },
      { code: 'AU-MEL', nameZh: '墨尔本', nameEn: 'Melbourne', lng: 144.96, lat: -37.81 },
      { code: 'AU-BNE', nameZh: '布里斯班', nameEn: 'Brisbane', lng: 153.03, lat: -27.47 },
      { code: 'AU-PER', nameZh: '珀斯', nameEn: 'Perth', lng: 115.86, lat: -31.95 },
      { code: 'AU-ADE', nameZh: '阿德莱德', nameEn: 'Adelaide', lng: 138.60, lat: -34.93 },
      { code: 'AU-CBR', nameZh: '堪培拉', nameEn: 'Canberra', lng: 149.13, lat: -35.28 },
    ]
  },
  {
    code: 'NZ',
    nameZh: '新西兰',
    nameEn: 'New Zealand',
    cities: [
      { code: 'NZ-AKL', nameZh: '奥克兰', nameEn: 'Auckland', lng: 174.76, lat: -36.85 },
      { code: 'NZ-WLG', nameZh: '惠灵顿', nameEn: 'Wellington', lng: 174.78, lat: -41.29 },
      { code: 'NZ-CHC', nameZh: '基督城', nameEn: 'Christchurch', lng: 172.63, lat: -43.53 },
    ]
  },
]

/**
 * 根据城市编码获取城市信息
 * @param {string} cityCode - 城市编码，如 'CN-WX'
 * @returns {Object|null} 城市信息 { code, nameZh, nameEn, lng, lat, countryCode, countryNameZh, countryNameEn }
 */
export function getCityByCode(cityCode) {
  for (const country of worldCities) {
    const city = country.cities.find(c => c.code === cityCode)
    if (city) {
      return {
        ...city,
        countryCode: country.code,
        countryNameZh: country.nameZh,
        countryNameEn: country.nameEn
      }
    }
  }
  return null
}

/**
 * 获取级联选择器数据（根据语言返回对应名称）
 * @param {string} lang - 语言 'zh' | 'zh-CN' | 'en' | 'en-US'
 * @returns {Array} 级联选择器数据 [{ value: countryCode, label: countryName, children: [{ value: cityCode, label: cityName }] }]
 */
export function getCascaderOptions(lang = 'zh-CN') {
  // 兼容 'zh' / 'zh-CN' / 'en' / 'en-US' 等格式
  const isZh = lang.toLowerCase().startsWith('zh')
  return worldCities.map(country => ({
    value: country.code,
    label: isZh ? country.nameZh : country.nameEn,
    children: country.cities.map(city => ({
      value: city.code,
      label: isZh ? city.nameZh : city.nameEn
    }))
  }))
}

/**
 * 根据级联选择器的值（[countryCode, cityCode]）获取经纬度
 * @param {Array} values - [countryCode, cityCode]
 * @returns {Object|null} { lng, lat, nameZh, nameEn }
 */
export function getCoordsByValues(values) {
  if (!Array.isArray(values) || values.length < 2) return null
  const cityCode = values[1]
  const city = getCityByCode(cityCode)
  if (city) {
    return {
      lng: city.lng,
      lat: city.lat,
      nameZh: city.nameZh,
      nameEn: city.nameEn,
      countryNameZh: city.countryNameZh,
      countryNameEn: city.countryNameEn
    }
  }
  return null
}

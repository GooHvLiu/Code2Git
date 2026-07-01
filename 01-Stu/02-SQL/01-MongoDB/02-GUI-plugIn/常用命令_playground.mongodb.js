//其他命令查询：https://www.w3school.com.cn/mongodb/mongodb_update_operators.asp
// ========================================
// ========  检查是否已连接  =========
// ========================================
{
  use('myTest');
  db.adminCommand({ ping: 1 })
}

// ========================================
// ========  诊断脚本  =========
// ========================================
{
  // 1. 检查连接
  {
    try {
      const pingResult = db.adminCommand({ ping: 1 })
      print("✅ MongoDB 连接成功")
      print("Ping result: " + JSON.stringify(pingResult))
    } catch (error) {
      print("❌ MongoDB 连接失败: " + error.message)
      print("请先通过侧边栏建立连接")
    }
  }

  // 2. 切换到 DB4S
  {
    print("\n=== 切换数据库 ===")
    use('DB4S')
  }

  // 3. 验证数据库
  {
    print("\n=== 验证当前数据库 ===")
    try {
      const dbName = db.getName()
      print("当前数据库: " + dbName)
    } catch (error) {
      print("❌ 获取数据库名称失败: " + error.message)
      print("db 对象可能未初始化")
    }
  }

  // 4. 查看所有数据库
  {
    print("\n=== 所有数据库 ===")
    try {
      const databases = db.adminCommand({ listDatabases: 1 })
      databases.databases.forEach(db => print("  - " + db.name))
    } catch (error) {
      print("❌ 获取数据库列表失败: " + error.message)
    }
  }

  // 5. 检查 DB4S 中的集合
  {
    print("\n=== DB4S 中的集合 ===")
    try {
      const collections = db.getCollectionNames()
      if (collections.length > 0) {
        collections.forEach(col => print("  - " + col))
      } else {
        print("  (空数据库)")
      }
    } catch (error) {
      print("❌ 获取集合列表失败: " + error.message)
    }
  }

  // 6. 插入测试数据
  {
    print("\n=== 插入测试数据 ===")
    try {
      const result = db.users.insertOne({
        username: "sunwukong",
        createdAt: new Date()
      })
      print("✅ 插入成功，ID: " + result.insertedId)
    } catch (error) {
      print("❌ 插入失败: " + error.message)
    }
  }

  // 7. 验证数据
  {
    print("\n=== 验证数据 ===")
    try {
      db.users.find().forEach(user => {
        print("  " + JSON.stringify(user))
      })
    } catch (error) {
      print("❌ 查询失败: " + error.message)
    }
  }
}

// ========================================
// ========  创建数据库和集合  =========
// ========================================
{
  const database = 'myTest';
  const collection = 'users';
  use(database);
  db.createCollection(collection);
}
// ========================================
// ========  删除数据库  =========
// ========================================
{
  use(xxx);
  db.dropDatabase();
}
// ========================================
// ======  查看当前在哪个数据库  =======
// ========================================
{
  db;
  db.getName();
  db.getMongo().getDBs();
}

// ========================================
// ======  删除集合  =======
// ========================================
{
  use("DB4S");
  db.users.drop();
}

// ========================================
// ======  排序sort相关语法和函数  =======
// ========================================
{
  use("myTest");
  //sort默认升序排序，
  //sort内参数为指定排序规则，1表示升序排序，-1表示降序排序
  // db.emps.find().sort({ sal: 1 });
  // db.emps.find().sort({ sal: -1 });
  //如下表示先按照sal进行升序排序，然后工资相同的，按照部门降序排序
  db.emps.find().sort({ sal: 1, emptno: -1 });
}

// ========================================
// ======  显示投影相关语法和函数  =======
// ========================================
{
  use("myTest");
  //在查询结果的第二个参数的我地址来设置查询结果的投影，默认为对象
  //1表示显示，0表示不显示
  //如下表示只是显示ename字段，默认id显示，其他字段不显示
  // db.emps.find({}, { ename: 1 });
  //如下表示只是显示ename字段，默认id也显示，其他字段不显示
  db.emps.find({}, { ename: 1, _id: 0, sal: 1 });
}

// ========================================
// ======  以下为练习核心语法模块  =======
// ========================================

/*
 * ========================================
 * 01.进入 myTest 数据库
 * ========================================
 */
{
  use('myTest');
  print("切换后数据库: " + db.getName());
  db;

}
/*
 * ========================================
 * 02.向数据库的用户集合中插入一个文档,文档名称users,内容为username:"sunwukong"
 * ========================================
 */
{
  use('myTest');
  db.users.insert({ username: "sunwukong" });
  db.users.find();

}
/*
 * ========================================
 * 03.查询用户集合中的文档
 * ========================================
 */
{
  use('myTest');
  db.users.find();
}

/*
 * ========================================
 * 04.向数据库的users集合中插入一个文档username:"zhubajie"
 * ========================================
 */
{
  use('myTest');
  db.users.insert({ username: "zhubajiu" });
  db.users.find();
}

/*
 * ========================================
 * 05.查询数据库 user 集合中的文档
 * ========================================
 */
{
  use('myTest');
  db.users.find();
}

/*
 * ========================================
 * 06.统计数据库 user集合中的文档数量
 * ========================================
 */
{
  use('myTest');
  db.users.find().count();
}

/*
 * ========================================
 * 07.查询数据库 user集合中 username为 sunwukong的文档
 * ========================================
 */
{
  use("myTest");
  db.users.find({ username: "sunwukong" })
}

/*
 * ========================================
 * 08.向数据库用户集合中的用户名为sunwukong的文档，添加一个地址属性，属性值为花果山
 * ========================================
 */
{
  use("myTest");
  db.users.update({ username: "sunwukong" }, { $set: { address: "huaguoshan" } });
  db.users.find();
}

/*
 * ========================================
 * 09.使用{username:"tangseng"}替换 username为 zhubajie 的文档
 * ========================================
 */
{
  use("myTest");
  db.users.replaceOne({ username: "zhubajiu" }, { username: "tangseng" });
  db.users.find();
}

/*
 * ========================================
 * 10.删除用户名为孙悟空的文档的地址属性
 * ========================================
 */
{
  use("myTest");
  db.users.update({ username: "sunwukong" }, { $unset: { address: 1 } })
  db.users.find();
}

/*
 * ========================================
 * 11.向用户名为sunwukong的文档中，添加一个hobby:{cities:["beijing","shanghai","shenzhen"],movies:["sanguo","hero"]}
 * ========================================
 */
{
  use("myTest");
  db.users.update({ username: "sunwukong" }, { $set: { hobby: { cities: ["beijing", "shanghai", "shenzhen"], movies: ["sanguo", "hero"] } } })
  db.users.find();
}

/*
 * ========================================
 * 12.向username为tangseng的文档中添加一个hobby:{movies:["AChinese Odyssey","King of comedy"]}
 * ========================================
 */
{
  use("myTest");
  db.users.update({ username: "tangseng" }, { $set: { hobby: { movies: ["AChinese Odyssey", "King of comedy"] } } })
  db.users.find();
}

/*
 * ========================================
 * 13.查询喜欢电影hero的相关文档
 * ========================================
 */
{
  use("myTest");
  db.users.find({ "hobby.movies": "hero" });
}

/*
 * ========================================
 * 14.向tangseng中添加一个新的movies:Interstellar
 * ========================================
 */
{
  use("myTest");
  //$push，是将对应的数据插入到数组当中
  //$addToSet向数组中添加一个新元素，存在的就不会添加
  db.users.update({ username: "tangseng" }, { $push: { "hobby.movies": "Interstellar" } })
  db.users.update({ username: "tangseng" }, { $addToSet: { "hobby.movies": "Interstellar" } })
  db.users.find();
}

/*
 * ========================================
 * 15.删除喜欢北京的用户
 * ========================================
 */
{
  /*   use('myTest');
    db.users.insert(
      {
        username: "sunwukong",
        hobby: {
          cities: ["beijing", "shanghai", "shenzhen"],
          movies: ["sanguo", "hero"]
        }
      });
    db.users.find(); */

  use("myTest");
  //$pull是将数组满足条件的删除
  db.users.update({ username: 'sunwukong' }, { $pull: { "hobby.cities": 'beijing' } })
  db.users.find();
}

/*
 * ========================================
 * 16.删除users集合
 * ========================================
 */
{
  use("myTest");
  db.users.remove({});
  db.users.drop();
  db.users.find();
}

/*
 * ========================================
 * 17.向numbers中插入20000条数据
 * ========================================
 */
{
  use("myTest");
  let arr = [];
  for (let i = 0; i < 20000; i++) {
    arr.push({ num: i });
  }
  db.numbers.insert(arr);
  db.numbers.find();
}

/*
 * ========================================
 * 18.查询numbers中num为500的文档
 * ========================================
 */
{
  use("myTest");
  db.numbers.find({ num: 500 });
}

/*
 * ========================================
 * 19.查询numbers中num大于5000的文档
 * ========================================
 */
{
  use("myTest");
  //$gt:值大于另一个值。
  db.numbers.find({ num: { $gt: 5000 } });
}

/*
 * ========================================
 * 20.查询numbers中num小于30的文档
 * ========================================
 */
{
  use("myTest");
  //$lt:值小于另一个值。
  db.numbers.find({ num: { $lt: 30 } });
}

/*
 * ========================================
 * 21.查询numbers中nm大于40小于50的文档
 * ========================================
 */
{
  use("myTest");
  //$lt:值小于另一个值,$gt:值大于另一个值。
  db.numbers.find({ num: { $gt: 40, $lt: 50 } });
}

/*
 * ========================================
 * 22.查询numbers中num大于19996的文档
 * ========================================
 */
{
  use("myTest");
  //$gt:值大于另一个值。
  db.numbers.find({ num: { $gt: 19996 } });
}

/*
 * ========================================
 * 23.查看numbers集合中的前10条数据
 * ========================================
 */
{
  use("myTest");
  //$lte:值小于或等于另一个值。
  db.numbers.find({ num: { $lte: 10 } });
}

/*
 * ========================================
 * 24.查看numbers:集合中的第11条到20条数据
 * ========================================
 */
{
  use("myTest");
  //$lte:值小于或等于另一个值,$gte:值大于或等于另一个值。
  db.numbers.find({ num: { $lte: 20, $gte: 11 } });
}

/*
 * ========================================
 * 25.查看numbers:集合中的第21条到30条数据
 * ========================================
 */
{
  use("myTest");
  //$lte:值小于或等于另一个值,$gte:值大于或等于另一个值。
  db.numbers.find({ num: { $lte: 30, $gte: 21 } });
}

/*
 * ========================================
 * 26.将dept和emp桌合导入到数据库中
 * ========================================
 */
{
  //下面是对emps进行写入数据
  use('myTest');
  db.createCollection('emps');

  use('myTest');
  db.getCollection('emps').insertMany([
    {
      "_id": "5941f5bfc1bc86928f4de4ac",
      "empno": 7369.0,
      "ename": "林冲",
      "job": "职员",
      "mgr": 7902.0,
      "hiredate": "1980-12-16T16:00:00Z",
      "sal": 800.0,
      "deptno": 20.0
    },
    {
      "_id": "5941f5bfc1bc86928f4de4ad",
      "empno": 7499.0,
      "ename": "孙二娘",
      "job": "销售",
      "mgr": 7698.0,
      "hiredate": "1981-02-19T16:00:00Z",
      "sal": 1600.0,
      "comm": 300.0,
      "deptno": 30.0
    },
    {
      "_id": "5941f5bfc1bc86928f4de4ae",
      "empno": 7521.0,
      "ename": "扈三娘",
      "job": "销售",
      "mgr": 7698.0,
      "hiredate": "1981-02-21T16:00:00Z",
      "sal": 1250.0,
      "comm": 500.0,
      "deptno": 30.0
    },
    {
      "_id": "5941f5bfc1bc86928f4de4af",
      "empno": 7566.0,
      "ename": "卢俊义",
      "job": "经理",
      "mgr": 7839.0,
      "hiredate": "1981-04-01T16:00:00Z",
      "sal": 2975.0,
      "deptno": 20.0
    },
    {
      "_id": "5941f5bfc1bc86928f4de4b0",
      "empno": 7654.0,
      "ename": "潘金莲",
      "job": "销售",
      "mgr": 7698.0,
      "hiredate": "1981-09-27T16:00:00Z",
      "sal": 1250.0,
      "comm": 1400.0,
      "deptno": 30.0
    },
    {
      "_id": "5941f5bfc1bc86928f4de4b1",
      "empno": 7698.0,
      "ename": "西门庆",
      "job": "经理",
      "mgr": 7839.0,
      "hiredate": "1981-09-30T16:00:00Z",
      "sal": 2850.0,
      "deptno": 30.0
    }
  ]);

  use('myTest');
  db.emps.find();

  //下面是对dept写入数据
  use('myTest');
  db.createCollection("depts");

  use('myTest');
  db.getCollection('depts').insertMany([
    {
      "_id": "5941f2bac1bc86928f4de49a",
      "deptno": 10.0,
      "dname": "财务部",
      "loc": "北京"
    },
    {
      "_id": "5941f2bac1bc86928f4de49b",
      "deptno": 20.0,
      "dname": "办公室",
      "loc": "上海"
    },
    {
      "_id": "5941f2bac1bc86928f4de49c",
      "deptno": 30.0,
      "dname": "销售部",
      "loc": "广州"
    },
    {
      "_id": "5941f2bac1bc86928f4de49d",
      "deptno": 40.0,
      "dname": "运营部",
      "loc": "深圳"
    }
  ]);

  use('myTest');
  db.depts.find();
}

/*
 * ========================================
 * 27.查询工资小于200O的员工
 * ========================================
 */
{
  use('myTest');
  db.emps.find({ sal: { $lt: 2000 } })
}

/*
 * ========================================
 * 28.查询工资在1000-2000之间前员工
 * ========================================
 */
{
  use('myTest');
  db.emps.find({ sal: { $lt: 2000, $gt: 1000 } })
}

/*
 * ========================================
 * 29.查询工资小于1000或大于2500的员工
 * ========================================
 */
{
  use('myTest');
  //$or表示或的关系，具体语法如下所示
  db.emps.find({ $or: [{ sal: { $lt: 1000 } }, { sal: { $gt: 2500 } }] })
}

/*
 * ========================================
 * 30.查海财务部的所有员工
 * ========================================
 */
{
  use('myTest');
  let dep = db.depts.findOne({ dname: "办公室" }).deptno;
  db.emps.find({ deptno: dep });
}

/*
 * ========================================
 * 31.查询销售部的所有员工
 * ========================================
 */
{
  use('myTest');
  let dep = db.depts.findOne({ dname: "销售部" }).deptno;
  db.emps.find({ deptno: dep });
}

/*
 * ========================================
 * 32.查海所有mgr为7698前所有员工
 * ========================================
 */
{
  use('myTest');
  db.emps.find({ mgr: 7698 });
}

/*
 * ========================================
 * 33.为所有薪资低于100O员工增加工资400元
 * ========================================
 */
{
  use('myTest');
  //$inc表示自增命令
  db.emps.updateMany({ sal: { $lte: 1000 } }, { $inc: { sal: 400 } });
  db.emps.find();
}
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const ldbJsonPath = path.join(
  process.cwd(),
  "src",
  "database",
  "lowdb",
  "ldb.json",
);

//lowdb自身配置，修改w为实际存储路径
const adapter = new FileSync(ldbJsonPath);
//获取 lowdb db 对象
const db = low(adapter);

// 引入nano,用下面这种方式的原因是因为nanoid方法除了nanoid外，还有其他很多方法，而我们只是使用namoid这个属性
const { nanoid } = require("nanoid");

class DbOperate {
  /**
   * 获取随机ID函数
   * @returns 返回获得的随机数
   */
  getId() {
    try {
      // console.log("使用lowDB生成的随机ID为：", nanoid());
      return nanoid();
    } catch (error) {
      return error;
    }
  }

  /**
   * 初始化数据库，定义数据库基本结构，类似model模型
   * @param {*} Objects 数据库结构，如{ "posts": [], "users": {} }，表示创建了两个表，分别为posts金额users
   * @returns 创建后的结构
   */
  init(Objects) {
    try {
      // defaults 自动补全缺失字段，不手动调用write减少文件触碰
      db.defaults(Objects);
      // 仅当数据库为空/结构缺失时才写入，减少文件修改
      return db;
    } catch (error) {
      return error;
    }
  }

  /**
   * 获取全部数据库数据
   * @param {string} tableName 需要查询的表名，如"posts"
   * @returns 返回数据库查询结果
   */
  findAll(tableName) {
    try {
      return db.get(tableName).value();
    } catch (error) {
      return error;
    }
  }

  /**
   * 获取单条数据
   * @param {*} tableName 需要查询的表名，如"posts"
   * @param {*} conditions 需要查询指定范围，如{"id":1}
   * @returns 返回数据库查询结果
   */
  findOne(tableName, conditions) {
    try {
      return db.get(tableName).find(conditions).value();
    } catch (error) {
      return error;
    }
  }

  /**
   * 写入尾部数据
   * @param {*} tableName 需要写入对应的表名，如："posts"
   * @param {*} Objects 需要写入对应的内容，如：{ "id":10," title":"lowdb教程", "content":"xxx" }
   * @returns 返回数据库写入数据
   */
  writePush(tableName, Objects) {
    try {
      return db.get(tableName).push(Objects).write();
    } catch (error) {
      return error;
    }
  }

  /**
   * 写入头部数据
   * @param {*} tableName 需要写入对应的表名，如："posts"
   * @param {*} Objects 需要写入对应的内容，如：{ "id":10," title":"lowdb教程", "content":"xxx" }
   * @returns 返回数据库写入数据
   */
  writeUnshift(tableName, Objects) {
    try {
      return db.get(tableName).unshift(Objects).write();
    } catch (error) {
      return error;
    }
  }

  /**
   * 删除数据
   * @param {*} tableName 需要删除对应的表名，如："posts"
   * @param {*} conditions 需要删除对应的内容，如：{"id":10}
   * @returns 返回数据库删除数据
   */
  deleteData(tableName, conditions) {
    try {
      return db.get(tableName).remove(conditions).write();
    } catch (error) {
      return error;
    }
  }

  /**
   * 更新数据
   * @param {*} tableName 需要更新对应的表名，如："posts"
   * @param {*} conditions 需要更新对应的id,如：{ "id":1 }
   * @param {*} Objects 需要更新对应的内容，如：{ "title":"C++教程", "content":"xwxx" }
   * @returns 返回数据库更新后的数据
   */
  updateData(tableName, conditions, Objects) {
    try {
      return db.get(tableName).find(conditions).assign(Objects).write();
    } catch (error) {
      return error;
    }
  }
}

module.exports = new DbOperate();

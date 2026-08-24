##### 初始文件

| 文件名          | 说明               | 大小 | 使用场景                       |
| --------------- | ------------------ | ---- | ------------------------------ |
| `init.sql`      | 只有表结构，无数据 | 13KB | 提供给客户，客户自行初始化数据 |
| `init_test.sql` | 包含测试数据       | 29KB | 开发测试使用                   |

##### 使用方式

```
# 客户版（只有表结构）
mysql -u root -p your_database < init.sql

# 测试版（包含测试数据）
mysql -u root -p your_database < init_test.sql
```

##### 如何获取

###### 初始结构

```
mysqldump -h 127.0.0.1 -P 3306 -u root -p123456 --databases nexsm_v2_dev --no-data --routines --triggers --events > init.sql

```

###### 测试数据

```
mysqldump -h 127.0.0.1 -P 3306 -u root -p123456 --databases nexsm_v2_dev --single-transaction --routines --triggers --events > init.test.sql


```

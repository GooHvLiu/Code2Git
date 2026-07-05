-- 通过 * 把users 表中所有的数据查询出来
select * from mydb4demo.users

-- 从users表中把usename 和 password 对应的数据查询出来
select username,password from mydb4demo.users;

-- 向users 表中，插入新数据，username的值为tonyStark password 的值为098123
insert into mydb4demo.users (username,password) values ('tonyHook','098132');
select * from mydb4demo.users;

-- 将users表中，id=4的password更新为888888
update mydb4demo.users set password='888888' where id=4;
select * from mydb4demo.users;

-- 将users表中，id=2的password更新为admin123，同时，把用户的状态更新为 1
update mydb4demo.users set password='admin',status=1  where id=2;
select * from mydb4demo.users;

-- 删除表内的指定内容
delete from mydb4demo.users where id=4;
select * from mydb4demo.users;

-- 演示where子句的使用
select * from mydb4demo.users where id <> 3;
select * from mydb4demo.users where id >=2 and id<=5;
select * from mydb4demo.users where id =2 or id=5;

-- 演示 order by 使用
select * from mydb4demo.users where id >=2 order by password;
select * from mydb4demo.users where id >=2 order by status asc;
select * from mydb4demo.users where id >=2 order by status desc,id desc;

-- 演示 count(*) 使用
select count(*) from mydb4demo.users where status;
select count(*) from mydb4demo.users;

-- 演示 as 使用
select count(*) as totals from mydb4demo.users where status ;
select count(*) as totals from mydb4demo.users;
select username as name,password as passwords from mydb4demo.users;

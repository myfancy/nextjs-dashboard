## 这是我的个人next练习项目

采用nextjs技术栈 postgreSQL数据库 vercel网站部署

采用 typescript 开发

使用 git 版本管理工具
使用 gitflow 工作流（单人项目基于main分支，创建分支开发）

文件架构介绍：
app/seed ： 初始化项目后，对服务器的数据库进行灌装数据，此文件是对数据库的批量写入，保证后续可以使用模拟数据，便于开发。模拟数据保存在lib/placeholder-data.ts文件中。
app/query ：数据库的查询接口，如果上一步配置正确，访问该接口应该得到正确的json。

lib/placeholder-data.ts ： seed数据（灌装）假数据的占位符文件。
lib/data.ts ：对数据的操作文件，接口，理解为api接口（其实本质就是获取数据，不论是从后端提供的api，从本地文件系统，从数据库里查询，都是使用相应的api去获取数据，返回的都是数据，基本都是异步函数获取，这个没什么理解压力）
lib/definitions.ts ：typescript 所需要的类型定义。



运行命令：
pnpm run dev
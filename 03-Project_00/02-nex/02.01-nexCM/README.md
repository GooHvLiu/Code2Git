#### 版本说明

##### _nexCM-V1_

- <span style="color:orange;font-size:14px">_初代重写架构；_</span>
- <span style="color:orange;font-size:14px">_全部手写实现代码；_</span>

##### _nexCM-V2_02_

- <span style="color:orange;font-size:14px">_重绘架构，包括菜单栏及简单功能；_</span>

##### _nexCM-V2_03_

- <span style="color:orange;font-size:14px">_实现主题个性化；_</span>
- <span style="color:orange;font-size:14px">_实现国际化规范；_</span>
- <span style="color:orange;font-size:14px">_实现管理员对用户的管理；_</span>
- <span style="color:orange;font-size:14px">_对应后端的02.01.02-nexSM-V2_02.zip版本；_</span>

##### _nexCM-V2_04_

- <span style="color:orange;font-size:14px">_增加 基础 审计追踪功能：操作记录和查询记录；_</span>
- <span style="color:orange;font-size:14px">_对应后端的02.01.02-nexSM-V2_03.zip版本；_</span>
- <span style="color:orange;font-size:14px">_距离专业审计追踪还需要：_</span>
- <span style="color:orange;font-size:14px">_第一阶段_</span>

<span style="color:orange;font-size:14px">1. _审计日志表加触发器，禁止 UPDATE/DELETE_</span>
<span style="color:orange;font-size:14px">2. _关键操作（写 PLC、删用户）增加电子签名弹窗（密码 + 原因）_</span>
<span style="color:orange;font-size:14px">3. _扩大审计覆盖范围（登录 / 登出 / 用户管理 / 导出）_</span>
<span style="color:orange;font-size:14px">4. _增加密码安全策略_</span>

- <span style="color:orange;font-size:14px">_第二阶段_</span>

<span style="color:orange;font-size:14px">5. _审计日志哈希链校验_</span>
<span style="color:orange;font-size:14px">6. _NTP 时间同步配置_</span>
<span style="color:orange;font-size:14px">7. _操作超时自动登出_</span>

- <span style="color:orange;font-size:14px">_第三阶段_</span>

<span style="color:orange;font-size:14px">8. _编写 CSV 验证文档（URS/FS/DS/IQ/OQ/PQ）_</span>
<span style="color:orange;font-size:14px">9. _制定 SOP（标准操作规程）_</span>
<span style="color:orange;font-size:14px">10. _用户培训记录_</span>

##### _nexCM-V02_05_

- <span style="color:orange;font-size:14px">_审计日志表加触发器，禁止 UPDATE/DELETE;_</span>

- <span style="color:orange;font-size:14px">_关键操作（写 PLC、删用户）增加电子签名弹窗（密码 + 原因）;_</span>

- <span style="color:orange;font-size:14px">_扩大审计覆盖范围（登录 / 登出 / 用户管理 / 导出）;_</span>

- <span style="color:orange;font-size:14px">_增加密码安全策略;_</span>

- <span style="color:orange;font-size:14px">_审计日志哈希链校验;_</span>

- <span style="color:orange;font-size:14px">_NTP 时间同步配置;_</span>

- <span style="color:orange;font-size:14px">_操作超时自动登出;_</span>

- <span style="color:orange;font-size:14px">_对应后端 02.01.01-nexSM-V2_04.zip 文件_</span>

##### _nexCM-V3_

- <span style="color:orange;font-size:14px">_具备审计追踪功能；_</span>
- <span style="color:orange;font-size:14px">_具备消息中心功能；_</span>
- <span style="color:orange;font-size:14px">_具备数据字典、角色管理、部门管理、用户管理功能；_</span>
- <span style="color:orange;font-size:14px">_具备与服务器心跳交互功能和样式；_</span>
- <span style="color:orange;font-size:14px">_适当开发可供用户自行设置的参数；_</span>
- <span style="color:orange;font-size:14px">_具备授权管理功能，可以自定义授权时间；_</span>
- <span style="color:orange;font-size:14px">_对应后端 02.01.01-nexSM-V3_00.zip 文件；_</span>

##### nexCM-V3_01

- <span style="color:orange;font-size:14px">_完成菜单的设定；_</span>

##### nexCM-V3_02

- <span style="color:orange;font-size:14px">_重新优化了项目结构和错误代码形式；_</span>
- <span style="color:orange;font-size:14px">_V2.6.x的最后一个版本，还是使用mixin方式实现某些功能，下个版本采用Vue 2.7 + Composition API，为后续升级Vue3做准备；_</span>

##### nexCM-V3_03

- <span style="color:orange;font-size:14px">_在基于nexCM-V3_02的基础上，升级Vue2.6->Vue2.7,Options API->Composition API，功能上没有任何变化；_</span>

##### nexCM-V3_04

- <span style="color:orange;font-size:14px">_基于目前架构优化数据库和代码，错误代码支持国际化配置_；</span>
- <span style="color:orange;font-size:14px">_增加通知中心的提示逻辑和国际化配置_；</span>

##### nexCM-V3_05

- <span style="color:orange;font-size:14px">_完成菜单栏的服务器化，本地不保存_；</span>
- <span style="color:orange;font-size:14px">_为后续菜单，参数，按钮的角色配置功能做准备_；</span>

##### nexCM-V3_06

- <span style="color:orange;font-size:14px">_完成菜单，参数，按钮的角色配置功能_；</span>
- <span style="color:orange;font-size:14px">_参数信息保存在数据库中，前端无配置数据_；</span>
- <span style="color:orange;font-size:14px">_同一账户，只能在一处登录_；</span>
- <span style="color:orange;font-size:14px">_可以限制客户端的数量_；</span>
- <span style="color:orange;font-size:14px">_增加在线管理功能，服务器、客户端数量管理，在线设备管理_；</span>
- <span style="color:orange;font-size:14px">_支持后端检测设备在线参数-放在系统设置-参数配置-连接设置_；</span>
- <span style="color:orange;font-size:14px">_订单管理中增加新增、编辑和删除功能_；</span>
- <span style="color:orange;font-size:14px">_权限配置完全与数据库、菜单栏匹配_；</span>

##### nexCM-V3_07

- <span style="color:orange;font-size:14px">_已增加邮箱通知功能_；</span>
- <span style="color:orange;font-size:14px">_已完善 部分 部件寿命的核心功能模块_；</span>
- <span style="color:orange;font-size:14px">_**待强化审计追踪**、已完成消息通知的功能封装和使用_；</span>

##### nexCM-V3_08

- <span style="color:orange;font-size:14px">_✅️个人中心的头像采用登录用户的头像_；</span>
- <span style="color:orange;font-size:14px">_✅️菜单图标与菜单垂直方向居中_；</span>
- <span style="color:orange;font-size:14px">_✅️在线管理中，设备只要是离线，就可以进行删除，不用标记是不是本机_；</span>
- <span style="color:orange;font-size:14px">_✅️整个系统管理下的页面重写，按照在线设备头部类似的模式；_</span>
- <span style="color:orange;font-size:14px">_优化完善权限配置功能_：</span>
  - <span style="color:orange;font-size:14px">✅️完成系统设置的全部颗粒度与数据库对齐，国际化key与菜单对应一致;</span>
  - <span style="color:orange;font-size:14px">✅️完成其他页面的全部颗粒度与数据库对齐，国际化key与菜单对应一致;</span>
- <span style="color:orange;font-size:14px">_✅️强化审计追踪，整体架构定稿_；</span>
- <span style="color:orange;font-size:14px">_✅️部件寿命增加模板管理功能_；</span>
- <span style="color:orange;font-size:14px">_✅️角色增加超级管理员，可对项目做基本设置_；</span>
- <span style="color:orange;font-size:14px">_完善ReadMe.md文件_；</span>
- <span style="color:orange;font-size:14px">_电子签名_；</span>
- <span style="color:orange;font-size:14px">_测试各功能模板BUG_；</span>

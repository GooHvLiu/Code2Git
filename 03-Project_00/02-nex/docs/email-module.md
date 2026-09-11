```
src/modules/email/
├── index.js                    # 模块入口（一行代码发邮件）
├── email.config.js             # 系统默认配置
├── email.service.js            # 核心服务（发送、重试、降级、日志）
├── email.model.js              # 数据模型（CRUD、设默认）
├── initTables.js               # 数据库表初始化脚本
├── test.js                     # 测试脚本
├── providers/                  # SMTP服务商适配器
│   ├── index.js                # 服务商工厂
│   ├── base.provider.js        # 基础适配器
│   ├── qq.provider.js          # QQ邮箱
│   ├── netease.provider.js     # 163/126邮箱
│   ├── gmail.provider.js       # Gmail
│   ├── outlook.provider.js     # Outlook
│   └── custom.provider.js      # 自定义企业邮箱
├── templates/                  # 邮件模板系统
│   ├── index.js                # 模板注册中心
│   ├── base.template.js        # 基础模板（统一页眉页脚）
│   ├── passwordReset.template.js  # 密码重置模板
│   ├── notification.template.js   # 通用通知模板
│   └── test.template.js        # 测试邮件模板
└── utils/
    └── crypto.util.js          # 加密工具（AES加密、邮箱脱敏）

```

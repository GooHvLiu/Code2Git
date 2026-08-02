const https = require('https');
var createError = require('http-errors');
var express = require('express');
// 引入文件处理与工具
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
// 引入数据库MySQL
const mysql = require('mysql2/promise');
// 引入文件操作
const fs = require('fs');
// 引入跨域解决方案
const cors = require('cors');
// 引入 axios 用于调用 GitHub API
const axios = require('axios');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// 跨域插件
app.use(cors());

// 1. 配置 MySQL 连接池
const pool = mysql.createPool({
  host: 'localhost', user: 'root', password: '123456', database: 'mydb4demo',
  waitForConnections: true, connectionLimit: 10, queueLimit: 0
});

// 2. 配置 Multer (内存存储，用于云端上传),上传到 GitHub 需要将文件读入内存并转为 Base64
const memoryUpload = multer({ storage: multer.memoryStorage() });

// 3. 配置 Multer (本地磁盘存储)
const localDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(localDir)) fs.mkdirSync(localDir);

const diskStorage = multer.diskStorage({
  // 保存目录
  destination: (req, file, cb) => cb(null, localDir),
  // 使用 UUID + 原后缀，防止文件名冲突
  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
// 使用自定义的 storage
const localUpload = multer({ storage: diskStorage });

// 暴露本地静态文件目录，使上传的文件可以通过 URL 访问
app.use('/uploads', express.static(localDir));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// ==========================================
// 路由 A：上传到本地服务器，localUpload.single('file')，localUpload.array('file',3)
// ==========================================
app.post('/api/upload-local', localUpload.array('file', 3), async (req, res) => {
  // 多文件是 req.files 数组
  console.log("收到的文件：", req.files);

  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ code: 400, msg: '未上传文件' });

    // 循环批量入库
    const insertResults = [];
    for (const file of req.files) {
      const relativePath = `/uploads/${file.filename}`;
      const [result] = await pool.execute(
        'INSERT INTO files (original_name, file_size, storage_type, file_path) VALUES (?, ?, ?, ?)',
        [file.originalname, file.size, 'local', relativePath]
      );
      insertResults.push({
        id: result.insertId,
        url: `http://localhost:3000${relativePath}`
      })
    }

    res.json({ code: 200, msg: '本地上传成功', data: insertResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, msg: err.message });
  }
});

// ==========================================
// 路由 B：上传到 GitHub 图床
// ==========================================
app.post('/api/upload-cloud', memoryUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ code: 400, msg: '未上传文件' });

    // 1. 生成 GitHub 上的文件路径
    const ext = path.extname(req.file.originalname);
    // 按日期分类存储，例如：images/2026/08/uuid.jpg
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const githubPath = `images/${year}/${month}/${uuidv4()}${ext}`;


    // 2. 准备上传数据 (GitHub API 要求文件内容必须是 Base64 编码)
    const content = req.file.buffer.toString('base64');

    // 3. 调用 GitHub API 上传文件
    // ⚠️ 请务必替换下面的占位符 
    const GITHUB_TOKEN = 'Your OWN token';
    const OWNER = 'GooHvLiu';
    const REPO = 'my-files-bed';
    const BRANCH = 'main'; // 如果你的默认分支是 master，请改成 'master'

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${githubPath}`;

    await axios.put(
      url,
      {
        message: 'Upload image via API',
        content: content,
        branch: BRANCH
      },
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'Node.js-App', // GitHub API 要求必须有 User-Agent
          'Content-Type': 'application/json'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    );

    // 4. 拼接最终的图片访问 URL
    const fileUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${githubPath}`;

    // 5. 将云端 URL 存入数据库
    const [result] = await pool.execute(
      'INSERT INTO files (original_name, file_size, storage_type, file_path) VALUES (?, ?, ?, ?)',
      [req.file.originalname, req.file.size, 'cloud', fileUrl]
    );

    res.json({ code: 200, msg: 'GitHub上传成功', data: { id: result.insertId, url: fileUrl } });

  } catch (err) {
    console.error('GitHub Upload Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ code: 500, msg: 'GitHub上传失败: ' + (err.response ? err.response.data.message : err.message) });
  }
});

// ==========================================
// 路由 C：获取全部文件清单
// ==========================================
app.get('/api/download/lists', async (req, res) => {

  try {
    // 1. 根据 ID 查询数据库
    const [rows] = await pool.execute(
      'SELECT * FROM files');
    // console.log("获取到的数据：", rows);

    if (rows.length === 0) {
      return res.status(404).json({ code: 404, data: null, msg: '文件记录不存在' });
    }

    return res.status(200).json({ code: 200, data: rows, msg: '获取清单成功' });

  } catch (err) {
    console.error('下载接口异常:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});

// ==========================================
// 路由 D：下载文件 (根据 ID 查询数据库并下载)
// ==========================================
app.get('/api/download/:id', async (req, res) => {
  const fileId = req.params.id;
  console.log("fileId:", fileId);

  try {
    // 1. 根据 ID 查询数据库
    const [rows] = await pool.execute(
      'SELECT * FROM files WHERE id = ?',
      [fileId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ code: 404, msg: '文件记录不存在' });
    }

    const fileRecord = rows[0];

    // 2. 根据存储类型处理
    if (fileRecord.storage_type === 'local') {
      // --- 本地文件处理 ---

      // 拼接服务器上的绝对路径
      // 假设你的 uploads 文件夹在 app.js 同级目录
      const absolutePath = path.join(__dirname, 'uploads', path.basename(fileRecord.file_path));

      // 检查文件是否真的存在于磁盘上
      if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ code: 404, msg: '服务器上的物理文件已丢失' });
      }

      // 3. 执行下载
      // res.download(path, filename, callback)
      // filename 参数告诉浏览器保存时叫什么名字（这里使用数据库里的 original_name）
      res.download(absolutePath, fileRecord.original_name, (err) => {
        if (err) {
          console.error('下载出错:', err);
          // 如果响应头已经发送，就不能再发 JSON 了
          if (!res.headersSent) {
            res.status(500).json({ code: 500, msg: '文件读取失败' });
          }
        }
      });

    } else if (fileRecord.storage_type === 'cloud') {
      // --- GitHub/云端文件处理 ---
      // GitHub raw 链接可以直接访问，不需要后端中转流量
      // 直接重定向到 GitHub 的地址，浏览器会自动开始下载
      res.redirect(fileRecord.file_path);
    } else {
      res.status(400).json({ code: 400, msg: '未知的存储类型' });
    }

  } catch (err) {
    console.error('下载接口异常:', err);
    res.status(500).json({ code: 500, msg: '服务器内部错误' });
  }
});





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

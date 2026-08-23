/**
 * 项目管理路由
 * 管理需要授权的项目列表（如 nexCM、nexSM 等）
 * 项目配置存储在 data/projects.json
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const config = require('../config');

const projectsFile = path.join(config.dataDir, 'projects.json');

// 确保数据目录存在
if (!fs.existsSync(config.dataDir)) {
  fs.mkdirSync(config.dataDir, { recursive: true });
}

// 初始化项目配置文件
if (!fs.existsSync(projectsFile)) {
  const initProjects = [
    {
      id: 'nex-cm-v2',
      name: 'nexCM 医疗设备管理系统',
      description: '前端 Vue2 + Element UI 后台管理系统',
      techStack: 'Vue2, Element UI',
      createdAt: Date.now(),
      features: ['user_manage', 'customer_manage', 'device_manage', 'system_config'],
      customer: { name: '', contact: '', phone: '', email: '' }
    },
    {
      id: 'nex-sm-v2',
      name: 'nexSM 后端服务',
      description: 'Express + MySQL 后端服务',
      techStack: 'Express, MySQL',
      createdAt: Date.now(),
      features: ['api_service', 'auth', 'database'],
      customer: { name: '', contact: '', phone: '', email: '' }
    }
  ];
  fs.writeFileSync(projectsFile, JSON.stringify(initProjects, null, 2), 'utf8');
}

function readProjects() {
  try {
    return JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeProjects(projects) {
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2), 'utf8');
}

/**
 * 项目列表
 */
router.get('/', (req, res) => {
  const projects = readProjects();
  res.success({ list: projects, total: projects.length });
});

/**
 * 新增项目
 */
router.post('/', (req, res) => {
  const { id, name, description, techStack, features, customer } = req.body;
  if (!id || !name) {
    return res.error('项目ID和名称不能为空');
  }
  const projects = readProjects();
  if (projects.find(p => p.id === id)) {
    return res.error('项目ID已存在');
  }
  projects.push({
    id,
    name,
    description: description || '',
    techStack: techStack || '',
    features: features || [],
    customer: customer || { name: '', contact: '', phone: '', email: '' },
    createdAt: Date.now()
  });
  writeProjects(projects);
  res.success(null, '项目添加成功');
});

/**
 * 更新项目
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const projects = readProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.error('项目不存在');
  }
  projects[idx] = { ...projects[idx], ...req.body, id };
  writeProjects(projects);
  res.success(null, '项目更新成功');
});

/**
 * 删除项目
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let projects = readProjects();
  projects = projects.filter(p => p.id !== id);
  writeProjects(projects);
  res.success(null, '项目删除成功');
});

module.exports = router;

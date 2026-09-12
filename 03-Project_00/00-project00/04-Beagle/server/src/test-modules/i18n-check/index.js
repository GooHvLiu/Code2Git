/**
 * 国际化检测插件（i18n-check）
 * -------------------------------------------------------------
 * 一个系统、全面的国际化质量检测插件，覆盖：
 *  A. 语言包结构与完整性：单文件/模块目录/JSON、嵌套/扁平、缺失/多余/空值/重复键
 *  B. 多框架引用完整性：vue-i18n / react-intl / i18next / 后端 gettext，
 *     未定义引用、未使用 key、动态 key（存疑）、硬编码中文
 *  C. 文件引用图：import/require 依赖分析，只以"被引用文件"为准，
 *     孤儿文件与断链引用列入存疑报告
 *  D. 数据库国际化：表/字段使用情况、冗余表、多语言列、JSON 多语言字段
 *  所有"无法确定"的内容统一归入 uncertain（存疑），不武断判错。
 * -------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('../base');
const { walk, toRel } = require('./lib/fileWalker');
const { loadLanguagePacks } = require('./lib/langLoader');
const { buildGraph } = require('./lib/referenceGraph');
const { scanFiles } = require('./lib/i18nScanner');
const { staticAnalyze, connectAndInspect } = require('./lib/dbAnalyzer');

class I18nCheckModule extends TestModuleBase {
  static get moduleType() { return 'i18n-check'; }
  static get moduleName() { return '国际化检测'; }
  static get description() {
    return '系统检测前后端国际化完整性：语言包缺失/多余/空值/重复键、多框架(vue-i18n/react-intl/i18next/后端)引用一致性、未使用key、文件引用图(孤儿/断链)、数据库表字段与多语言列。不确定项统一列入存疑，不武断判错。';
  }
  static get icon() { return 'DocumentChecked'; }
  static get category() { return 'quality'; }
  static get version() { return '2.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'prepare', label: '校验路径与范围' },
      { key: 'load', label: '加载语言包' },
      { key: 'symmetry', label: '语言包对称性' },
      { key: 'reference', label: '前后端引用扫描' },
      { key: 'graph', label: '文件引用图分析' },
      { key: 'database', label: '数据库国际化分析' },
      { key: 'summary', label: '汇总报告' }
    ];
  }

  // 详细的声明式配置（平台自动渲染表单，字段解释即使用文档）
  static get configSchema() {
    return [
      { key: 'i18nDir', label: '国际化目录', type: 'path', span: 12, default: 'src/i18n', required: true,
        tip: '语言包所在目录，相对于「前端路径」。支持单文件(zh-CN.js)或模块目录(modules/)两种结构，会自动识别。' },
      { key: 'baseLang', label: '基准语言', type: 'string', span: 12, default: '',
        tip: '作为对比基准的语言代码，如 zh-CN。留空则自动取语言包排序后的第一个。其他语言都与它比对缺失/多余。' },
      { key: 'structure', label: '目录结构', type: 'select', span: 12, default: 'auto',
        options: [{ label: '自动识别', value: 'auto' }, { label: '单文件模式', value: 'single-file' }, { label: '模块化目录', value: 'module-dir' }],
        tip: '语言文件的组织方式。自动识别适用于绝大多数项目；识别不准时可手动指定。' },
      { key: 'keySeparator', label: 'Key分隔符', type: 'string', span: 12, default: '.',
        tip: '嵌套对象扁平化时的连接符，通常为点号(.)，如 menu.home.title。' },
      { key: 'frontendSrcDir', label: '前端源码目录', type: 'path', span: 12, default: 'src',
        tip: '需要扫描引用的前端源码目录，相对于前端路径，一般为 src。' },
      { key: 'scanBackend', label: '扫描后端', type: 'boolean', span: 12, default: true,
        tip: '是否同时扫描后端代码中的国际化引用与硬编码中文，需要项目配置了「后端路径」。' },
      { key: 'backendSrcDir', label: '后端源码目录', type: 'path', span: 12, default: 'src',
        tip: '后端源码目录，相对于「后端路径」，如 src。' },
      { key: 'frameworks', label: '识别的i18n框架', type: 'multiselect', span: 24,
        default: ['vue-i18n', 'react-intl', 'i18next', 'backend'],
        options: [
          { label: 'vue-i18n ($t/t/i18n.t)', value: 'vue-i18n' },
          { label: 'react-intl (formatMessage)', value: 'react-intl' },
          { label: 'i18next (t/useTranslation)', value: 'i18next' },
          { label: '后端 (__/gettext/req.t)', value: 'backend' }
        ],
        tip: '按项目实际技术栈选择。多选，平台会识别对应写法的 key 引用。' },
      { key: 'checkUnused', label: '检测未使用Key', type: 'boolean', span: 12, default: true,
        tip: '语言包中定义但代码从未引用的 key，属于冗余，会作为警告列出。' },
      { key: 'checkDynamic', label: '检测动态Key', type: 'boolean', span: 12, default: true,
        tip: '用变量或模板字符串作为 key（无法静态确定），列入「存疑」供人工确认。' },
      { key: 'checkHardcoded', label: '检测硬编码中文', type: 'boolean', span: 12, default: false,
        tip: '扫描代码中直接写死的中文字符串。项目较大时结果较多，默认关闭。' },
      { key: 'onlyReferenced', label: '仅以被引用文件为准', type: 'boolean', span: 12, default: true,
        tip: '通过 import/require 引用图判断文件是否真正被使用；孤儿文件(未被引用)中的问题只列入存疑，不计入正式判定。' },
      { key: 'checkDatabase', label: '数据库国际化分析', type: 'boolean', span: 12, default: true,
        tip: '分析后端 model/SQL 中表与字段的使用情况、冗余表、多语言列(_en/_zh)、JSON多语言字段。' },
      { key: 'dbType', label: '数据库类型', type: 'select', span: 12, default: 'static',
        options: [{ label: '仅静态分析(不连库)', value: 'static' }, { label: 'MySQL/MariaDB(连接真实库)', value: 'mysql' }],
        tip: '静态分析只扫描代码与.sql文件，无需连接；连接真实库可获得实际表结构与数据量，需要后端安装 mysql2。' },
      { key: 'dbHost', label: '数据库Host', type: 'string', span: 12, default: '127.0.0.1' },
      { key: 'dbPort', label: '数据库端口', type: 'number', span: 12, default: 3306 },
      { key: 'dbUser', label: '数据库用户', type: 'string', span: 8, default: 'root' },
      { key: 'dbPassword', label: '数据库密码', type: 'password', span: 8, default: '' },
      { key: 'dbDatabase', label: '数据库名', type: 'string', span: 8, default: '' },
      { key: 'ignoreDirs', label: '额外忽略目录', type: 'textarea', span: 24, default: '',
        tip: '除默认忽略(node_modules/dist等)外，额外不扫描的目录名，用英文逗号分隔，如 mock,scripts,legacy。' }
    ];
  }

  async run() {
    this.startTimer();
    const cfg = this.cfg;
    const project = this.project;
    const stats = { languages: 0, definedKeys: 0, referencedKeys: 0, filesScanned: 0, orphanFiles: 0 };

    try {
      // ========== 阶段1：路径与范围 ==========
      this.setProgress('prepare', 100);
      const frontendPath = project.frontend_path;
      if (!frontendPath || !fs.existsSync(frontendPath)) {
        this.addResult({ name: '前端路径', passed: false, category: 'error', message: `前端路径不存在: ${frontendPath || '(空)'}` });
        return this.finish(stats);
      }
      const backendPath = project.backend_path && fs.existsSync(project.backend_path)
        ? path.join(project.backend_path, cfg.backendSrcDir || 'src') : '';
      if (cfg.scanBackend && project.backend_path && !backendPath) {
        this.addResult({ name: '后端路径', passed: false, category: 'uncertain', message: '配置了扫描后端，但后端源码目录不存在，后端部分跳过' });
      }
      const ignoreDirs = cfg.ignoreDirs ? cfg.ignoreDirs.split(/[,，]/).map(s => s.trim()).filter(Boolean) : [];
      this.addResult({ name: '检测范围', passed: true, category: 'info',
        message: `前端: ${toRel(frontendPath, frontendPath) || '.'}；后端: ${backendPath ? '已配置' : '未配置/跳过'}`,
        detail: { frontendPath, backendPath, frameworks: cfg.frameworks } });

      // ========== 阶段2：加载语言包 ==========
      this.setProgress('load', 100);
      const i18nPath = path.join(frontendPath, cfg.i18nDir);
      if (!fs.existsSync(i18nPath)) {
        this.addResult({ name: '国际化目录', passed: false, category: 'error', message: `目录不存在: ${i18nPath}` });
        return this.finish(stats);
      }
      const langResult = loadLanguagePacks(i18nPath, { keySeparator: cfg.keySeparator });
      const packs = langResult.packs;
      const langs = Object.keys(packs);
      stats.languages = langs.length;
      this.addResult({ name: '语言包结构', passed: langResult.structure !== 'unknown', category: 'info',
        message: `结构=${langResult.structure}，语言数=${langs.length}，文件数=${langResult.fileCount}：${langs.join(', ')}`,
        detail: { structure: langResult.structure, languages: langs, sources: langResult.sources } });

      // 无法解析的语言文件
      for (const e of langResult.errors) {
        this.addResult({ name: `语言文件解析失败: ${path.basename(e.file)}`, passed: false, category: 'error',
          message: e.error, detail: { file: e.file } });
      }
      // 重复键
      for (const [file, keys] of Object.entries(langResult.duplicates)) {
        this.addResult({ name: `重复键: ${path.basename(file)}`, passed: false, category: 'warning',
          message: `存在 ${keys.length} 个重复定义的键（运行时后者覆盖前者）: ${keys.slice(0, 10).join(', ')}`,
          detail: { file, keys } });
      }
      if (langs.length === 0) {
        this.addResult({ name: '语言包', passed: false, category: 'error', message: '未发现任何语言包文件' });
        return this.finish(stats);
      }

      // ========== 阶段3：对称性 ==========
      this.setProgress('symmetry', 0);
      const langKeySets = {};
      for (const l of langs) langKeySets[l] = new Set(Object.keys(packs[l]));
      stats.definedKeys = langs.reduce((s, l) => s + langKeySets[l].size, 0);

      const baseLang = pickBaseLang(cfg.baseLang, langs, langKeySets);
      const baseKeys = langKeySets[baseLang];
      this.addResult({ name: '基准语言', passed: true, category: 'info', message: `${baseLang}（${baseKeys.size} 个 key）` });

      let symmetryPct = 0;
      const otherLangs = langs.filter(l => l !== baseLang);
      for (const l of otherLangs) {
        symmetryPct += 100 / Math.max(1, otherLangs.length);
        this.setProgress('symmetry', symmetryPct);
        const target = langKeySets[l];
        const missing = [...baseKeys].filter(k => !target.has(k));
        const extra = [...target].filter(k => !baseKeys.has(k));
        const empty = Object.entries(packs[l]).filter(([, v]) => v === '' || v === null || v === undefined).map(([k]) => k);

        this.addResult({ name: `${l} 对称性`, passed: missing.length === 0 && extra.length === 0 && empty.length === 0, category: 'symmetry',
          message: `缺失 ${missing.length}，多余 ${extra.length}，空值 ${empty.length}（基准 ${baseLang}）`,
          detail: { missing: missing.slice(0, 500), extra: extra.slice(0, 500), empty: empty.slice(0, 500), missingTotal: missing.length, extraTotal: extra.length } });

        missing.slice(0, 300).forEach(k => this.addResult({ name: `[缺失] ${l}`, passed: false, category: 'missing', message: k, detail: { key: k, lang: l } }));
        extra.slice(0, 300).forEach(k => this.addResult({ name: `[多余] ${l}`, passed: false, category: 'extra', message: k, detail: { key: k, lang: l } }));
        empty.slice(0, 300).forEach(k => this.addResult({ name: `[空值] ${l}`, passed: false, category: 'empty', message: k, detail: { key: k, lang: l, baseValue: packs[baseLang][k] } }));
      }
      // 基准语言自身空值
      const baseEmpty = Object.entries(packs[baseLang]).filter(([, v]) => v === '' || v === null || v === undefined).map(([k]) => k);
      if (baseEmpty.length) {
        this.addResult({ name: `[空值] ${baseLang}`, passed: false, category: 'empty', message: `基准语言存在 ${baseEmpty.length} 个空值`, detail: { keys: baseEmpty.slice(0, 300) } });
      }

      // ========== 阶段4：引用扫描（结合引用图，区分被引用/孤儿） ==========
      this.setProgress('reference', 20);
      const feSrc = path.join(frontendPath, cfg.frontendSrcDir || 'src');
      const codeExts = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.mjs', '.cjs'];
      const feWalk = walk(feSrc, { exts: codeExts, ignoreDirs, maxFiles: 20000 });
      stats.filesScanned += feWalk.files.length;
      feWalk.truncated && this.addResult({ name: '前端文件上限', passed: false, category: 'uncertain', message: '文件数达到上限被截断，结果可能不完整' });

      // 前端引用图（root 即源码目录，@/~ 别名指向源码根本身）
      this.setProgress('graph', 30);
      const feGraph = buildGraph(feSrc, { alias: { '@': '.', '~': '.' }, exts: codeExts });
      // 语言包目录由 i18n 框架加载，不参与引用扫描，也不计入孤儿判定
      const inLangDir = f => path.resolve(f).startsWith(path.resolve(i18nPath));
      const feActive = feWalk.files.filter(f => !inLangDir(f) && (!cfg.onlyReferenced || feGraph.isReferenced(f)));
      const feOrphan = feWalk.files.filter(f => !inLangDir(f) && cfg.onlyReferenced && !feGraph.isReferenced(f));
      stats.orphanFiles += feOrphan.length;

      const feScan = scanFiles(feActive, feSrc, {
        frameworks: cfg.frameworks, checkDynamic: cfg.checkDynamic, checkHardcoded: cfg.checkHardcoded
      });

      let beScan = { usages: {}, usedKeys: [], dynamic: [], hardcodedCJK: [] };
      let beGraph = null;
      if (cfg.scanBackend && backendPath && fs.existsSync(backendPath)) {
        this.setProgress('reference', 60);
        const beWalk = walk(backendPath, { exts: ['.js', '.ts', '.mjs', '.cjs'], ignoreDirs, maxFiles: 15000 });
        stats.filesScanned += beWalk.files.length;
        beGraph = buildGraph(backendPath, { exts: ['.js', '.ts', '.mjs', '.cjs'] });
        const beActive = beWalk.files.filter(f => !cfg.onlyReferenced || beGraph.isReferenced(f));
        stats.orphanFiles += beWalk.files.length - beActive.length;
        beScan = scanFiles(beActive, backendPath, {
          frameworks: cfg.frameworks, checkDynamic: cfg.checkDynamic, checkHardcoded: cfg.checkHardcoded
        });
      }

      // 合并前后端引用
      const allUsages = {};
      for (const [k, v] of Object.entries(feScan.usages)) mergeUsages(allUsages, k, v);
      for (const [k, v] of Object.entries(beScan.usages)) mergeUsages(allUsages, k, v);
      const referencedKeys = new Set([...feScan.usedKeys, ...beScan.usedKeys]);
      stats.referencedKeys = referencedKeys.size;

      // 全部已定义 key（并集）
      const allDefined = new Set();
      for (const l of langs) Object.keys(packs[l]).forEach(k => allDefined.add(k));

      // 未定义引用：代码用了，但语言包没有
      const undefinedRefs = [...referencedKeys].filter(k => !allDefined.has(k));
      this.addResult({ name: '引用完整性', passed: undefinedRefs.length === 0, category: 'reference',
        message: `扫描 ${stats.filesScanned} 个被引用文件，引用 ${referencedKeys.size} 个不同 key，其中 ${undefinedRefs.length} 个未在语言包定义`,
        detail: { undefinedRefs: undefinedRefs.slice(0, 500), undefinedTotal: undefinedRefs.length, usageCount: Object.keys(allUsages).length } });
      undefinedRefs.slice(0, 300).forEach(k => this.addResult({
        name: '[未定义引用]', passed: false, category: 'undefined', message: k,
        detail: { key: k, locations: (allUsages[k] || []).slice(0, 20) }
      }));

      // 未使用 key：语言包定义了但代码没引用（以基准语言为准）
      if (cfg.checkUnused) {
        const unused = [...baseKeys].filter(k => !referencedKeys.has(k));
        this.addResult({ name: '未使用Key(冗余)', passed: unused.length === 0, category: 'unused',
          message: `${baseLang} 中 ${unused.length} 个 key 未被任何被引用代码使用`,
          detail: { unused: unused.slice(0, 500), unusedTotal: unused.length } });
      }

      // 动态 key（存疑）
      if (cfg.checkDynamic) {
        const dynamic = [...feScan.dynamic, ...beScan.dynamic];
        this.addResult({ name: '动态Key(存疑)', passed: dynamic.length === 0, category: 'uncertain',
          message: `${dynamic.length} 处使用变量/模板字符串作为 key，无法静态校验，请人工确认`,
          detail: dynamic.slice(0, 300) });
      }

      // 硬编码中文
      if (cfg.checkHardcoded) {
        const cjk = [...feScan.hardcodedCJK, ...beScan.hardcodedCJK];
        this.addResult({ name: '硬编码中文', passed: cjk.length === 0, category: cjk.length ? 'warning' : 'pass',
          message: `${cjk.length} 处疑似硬编码中文字符串（含文案/注释，需人工甄别）`, detail: cjk.slice(0, 300) });
      }

      // ========== 阶段5：引用图结论（孤儿/断链） ==========
      this.setProgress('graph', 90);
      const broken = [...feGraph.brokenImports, ...(beGraph ? beGraph.brokenImports : [])];
      this.addResult({ name: '文件引用图', passed: feOrphan.length === 0 && broken.length === 0, category: 'graph',
        message: `前端文件 ${feWalk.files.length}，孤儿(未被引用) ${feOrphan.length}，断链引用 ${broken.length}`,
        detail: {
          frontOrphans: feOrphan.slice(0, 300).map(f => toRel(feSrc, f)),
          frontOrphanTotal: feOrphan.length,
          broken: broken.slice(0, 300)
        }
      });
      if (feOrphan.length) {
        this.addResult({ name: '孤儿文件(存疑)', passed: false, category: 'orphan',
          message: `${feOrphan.length} 个前端文件未被任何文件引用（入口文件已排除），可能是废弃代码`,
          detail: { orphans: feOrphan.slice(0, 300).map(f => toRel(feSrc, f)), total: feOrphan.length } });
      }
      broken.slice(0, 200).forEach(b => this.addResult({ name: '[断链引用]', passed: false, category: 'broken',
        message: `${b.file} 引用了不存在的模块: ${b.specifier}`, detail: b }));

      // ========== 阶段6：数据库分析 ==========
      if (cfg.checkDatabase) {
        this.setProgress('database', 30);
        const beRoot = project.backend_path || '';
        if (beRoot && fs.existsSync(beRoot)) {
          const staticRes = staticAnalyze(beRoot);
          this.addResult({ name: '数据库表使用', passed: staticRes.usedButNotDefined.length === 0 && staticRes.definedButNotUsed.length === 0,
            category: 'database',
            message: `代码/SQL 涉及 ${staticRes.usedTables.length} 张表；用了但未定义 ${staticRes.usedButNotDefined.length}，定义但未使用 ${staticRes.definedButNotUsed.length}`,
            detail: {
              usedTables: staticRes.usedTables,
              usedButNotDefined: staticRes.usedButNotDefined,
              definedButNotUsed: staticRes.definedButNotUsed,
              sqlFiles: staticRes.sqlFiles
            }
          });
          staticRes.definedButNotUsed.slice(0, 100).forEach(t => this.addResult({
            name: '[冗余表-存疑]', passed: false, category: 'uncertain',
            message: `表 ${t} 在 .sql 中定义，但代码中未发现引用`, detail: { table: t, definedIn: staticRes.definedTables[t]?.source }
          }));
          staticRes.usedButNotDefined.slice(0, 100).forEach(t => this.addResult({
            name: '[表缺定义]', passed: false, category: 'warning',
            message: `代码使用了表 ${t}，但在 .sql 定义中未找到（可能由 ORM 自动建表或定义在别处）`,
            detail: { table: t, usedIn: staticRes.tableLocations[t] }
          }));
          // 多语言列
          const i18nTables = Object.keys(staticRes.i18nColumns);
          if (i18nTables.length) {
            this.addResult({ name: '数据库多语言列', passed: false, category: 'database',
              message: `${i18nTables.length} 张表使用了 _en/_zh 等多语言列（推荐改为只存 i18n key）`,
              detail: staticRes.i18nColumns });
          }
          if (staticRes.jsonI18nHits.length) {
            this.addResult({ name: 'JSON多语言字段(存疑)', passed: false, category: 'uncertain',
              message: `${staticRes.jsonI18nHits.length} 个文件疑似在数据库/代码中存储 {"zh":..,"en":..} 结构`,
              detail: staticRes.jsonI18nHits.slice(0, 100) });
          }

          // 可选：连接真实库
          if (cfg.dbType === 'mysql') {
            this.setProgress('database', 70);
            const live = await connectAndInspect({
              type: 'mysql', host: cfg.dbHost, port: cfg.dbPort, user: cfg.dbUser,
              password: cfg.dbPassword, database: cfg.dbDatabase
            });
            if (live && live.available === false) {
              this.addResult({ name: '真实数据库连接', passed: false, category: 'uncertain', message: live.reason });
            } else if (live && live.available) {
              const liveTables = Object.keys(live.tables);
              const codeTables = staticRes.usedTables;
              const liveNotUsed = liveTables.filter(t => !codeTables.includes(t));
              this.addResult({ name: '真实库 vs 代码', passed: liveNotUsed.length === 0, category: 'database',
                message: `真实库 ${liveTables.length} 张表，其中 ${liveNotUsed.length} 张代码未使用`,
                detail: { liveTables, liveNotUsed, withRowEstimate: live.tables } });
            }
          }
        } else {
          this.addResult({ name: '数据库分析', passed: true, category: 'uncertain', message: '未配置后端路径，跳过数据库分析' });
        }
      }

      this.setProgress('summary', 100);
    } catch (err) {
      this.addResult({ name: '检测执行异常', passed: false, category: 'error', message: err.message, detail: { stack: err.stack } });
    }

    return this.finish(stats);
  }

  finish(stats) {
    this.stopTimer();
    const report = this.generateReport();
    report.stats = stats;
    // 按类别计数，便于前端概览
    report.categoryCount = {};
    for (const r of this.results) report.categoryCount[r.category || 'other'] = (report.categoryCount[r.category || 'other'] || 0) + 1;
    return report;
  }

  generateSummary() {
    const c = {};
    for (const r of this.results) c[r.category] = (c[r.category] || 0) + 1;
    const pick = (...keys) => keys.reduce((s, k) => s + (c[k] || 0), 0);
    const errors = pick('error', 'undefined', 'broken');
    const warns = pick('missing', 'extra', 'empty', 'warning', 'unused');
    const uncertain = pick('uncertain', 'orphan');
    return `错误 ${errors}，警告 ${warns}，存疑 ${uncertain}，信息 ${c.info || 0}（详见分类报告）`;
  }
}

function mergeUsages(target, key, list) {
  if (!target[key]) target[key] = [];
  target[key].push(...list);
}

/**
 * 选择基准语言：显式配置优先；否则优先中文(zh)，再退化为第一个
 */
function pickBaseLang(configured, langs, langKeySets) {
  if (configured && langKeySets[configured]) return configured;
  const zh = langs.find(l => /^zh\b|^zh[-_]/i.test(l));
  return zh || langs[0];
}

module.exports = I18nCheckModule;

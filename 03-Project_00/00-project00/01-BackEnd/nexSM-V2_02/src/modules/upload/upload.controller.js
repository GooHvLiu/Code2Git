/**
 * 文件上传控制器
 */
const UploadService = require('./upload.service');

class UploadController {
  /**
   * 本地单文件上传
   * POST /prod-api/upload/local
   */
  uploadLocalSingle(req, res, next) {
    try {
      const host = `${req.protocol}://${req.get('host')}`;
      const fileInfo = UploadService.buildLocalFileInfo(req.file, { host });
      return res.success(fileInfo, '文件上传成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 本地多文件上传
   * POST /prod-api/upload/local/batch
   */
  uploadLocalBatch(req, res, next) {
    try {
      const host = `${req.protocol}://${req.get('host')}`;
      const fileList = UploadService.buildLocalFileList(req.files, { host });
      return res.success(fileList, `成功上传 ${fileList.length} 个文件`);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GitHub 图床单文件上传
   * POST /prod-api/upload/github
   */
  async uploadGithubSingle(req, res, next) {
    try {
      const uploaderId = req.user?.userId || req.user?.id || null;
      const fileInfo = await UploadService.uploadToGithub(req.file, { uploaderId });
      return res.success(fileInfo, 'GitHub 图床上传成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GitHub 图床多文件上传
   * POST /prod-api/upload/github/batch
   */
  async uploadGithubBatch(req, res, next) {
    try {
      const uploaderId = req.user?.userId || req.user?.id || null;
      const fileList = await UploadService.uploadBatchToGithub(req.files, { uploaderId });
      return res.success(fileList, `成功上传 ${fileList.length} 个文件到 GitHub`);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除本地文件
   * DELETE /prod-api/upload/local  body: { path }
   */
  deleteLocalFile(req, res, next) {
    try {
      const { path: filePath } = req.body;
      UploadService.deleteLocalFile(filePath);
      return res.success(null, '文件删除成功');
    } catch (err) {
      next(err);
    }
  }

  /**
   * 删除 GitHub 文件
   * DELETE /prod-api/upload/github  body: { path }
   */
  async deleteGithubFile(req, res, next) {
    try {
      const { path: objectPath } = req.body;
      await UploadService.deleteGithubFile(objectPath);
      return res.success(null, 'GitHub 文件删除成功');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UploadController();
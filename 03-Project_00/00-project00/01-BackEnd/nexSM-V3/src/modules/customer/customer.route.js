const express = require('express');
const router = express.Router();
const CustomerController = require('./customer.controller.js');
const { requireAuth } = require('../../middleware/auth.middleware.js');
const validate = require('../../middleware/validate.middleware');
const {
  createCustomerSchema,
  updateCustomerSchema,
  idParamSchema,
  batchDeleteSchema,
  updateStatusSchema,
  queryCustomerListSchema
} = require('./customer.schema');

// 需要登录的接口
router.use(requireAuth);

// 客户管理CRUD（RESTful风格）
router.get('/', validate(queryCustomerListSchema, 'query'), CustomerController.getUserList);
router.get('/:id', validate(idParamSchema, 'params'), CustomerController.getUserDetail);
router.post('/', validate(createCustomerSchema, 'body'), CustomerController.createUser);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateCustomerSchema, 'body'), CustomerController.updateUser);
router.delete('/:id', validate(idParamSchema, 'params'), CustomerController.deleteUser);
router.delete('/batch', validate(batchDeleteSchema, 'body'), CustomerController.batchDeleteUsers);
router.patch('/:id/status', validate(idParamSchema, 'params'), validate(updateStatusSchema, 'body'), CustomerController.updateUserStatus);

module.exports = router;

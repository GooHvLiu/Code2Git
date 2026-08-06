<!--
  order/create/index.vue - 创建订单
  功能：表单填写产品信息、目标数量、分配设备、优先级
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>创建订单</h2>
      <p>新建生产订单</p>
    </div>
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" style="max-width: 600px;">
        <el-form-item label="产品编号" prop="productCode">
          <el-input v-model="form.productCode" placeholder="请输入产品编号" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="目标数量" prop="targetQuantity">
          <el-input-number v-model="form.targetQuantity" :min="1" :max="99999" />
        </el-form-item>
        <el-form-item label="分配设备">
          <el-select v-model="form.deviceId" placeholder="请选择设备" clearable>
            <el-option label="1号机" :value="1" />
            <el-option label="2号机" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="form.priority">
            <el-option label="普通" :value="5" />
            <el-option label="紧急" :value="9" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" :rows="3" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">创建</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'OrderCreate',
  data() {
    return {
      form: { productCode: '', productName: '', targetQuantity: 100, deviceId: null, priority: 5, remark: '' },
      rules: {
        productCode: [{ required: true, message: '请输入产品编号', trigger: 'blur' }],
        productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        targetQuantity: [{ required: true, message: '请输入目标数量', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 后续对接 createOrder 接口
          this.$message.success('创建成功（模拟）')
          this.$router.push('/order/list')
        }
      })
    }
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-box">
      <h1>nexCM - 管理系统</h1>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="'密\xa0\xa0\xa0码'" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captchacode">
          <div class="catcha-box">
            <el-input v-model="ruleForm.captchacode"></el-input>
            <img
              height="40"
              :src="captchaCodeSrc"
              @click="getCaptchaCode"
              style="cursor: pointer"
            />
          </div>
        </el-form-item>
        <el-form-item style="margin-left: -55px">
          <el-button
            class="loginBtn-box"
            type="primary"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item></el-form
      >
    </div>
  </div>
</template>

<script>
import { validateUsername } from "@/utils/index.validate.js";
import {
  requestCaptchaCodeAPI,
  requestLoginApi
} from "@/common/request/index.api.js";
export default {
  name: "UserLogin",
  components: {},
  data() {
    // 需要验证的字段定义
    return {
      ruleForm: {
        username: "",
        password: "",
        captchacode: ""
      },
      // 字段验证规则
      rules: {
        username: [
          {
            //必填项
            required: true,
            //提示信息
            message: "用户名不能为空",
            //触发时机
            trigger: "blur"
          },
          { validator: validateUsername, trigger: "blur" }
        ],
        password: [
          {
            //必填项
            required: true,
            //提示信息
            message: "密码不能为空",
            //触发时机
            trigger: "blur"
          }
        ],
        captchacode: [
          {
            //必填项
            required: true,
            //提示信息
            message: "验证码不能为空",
            //触发时机
            trigger: "blur"
          }
        ]
      },
      // 验证码验证
      captchaCodeSrc: ""
    };
  },
  computed: {},
  methods: {
    // 点击登录提交按钮
    async submitForm(formName) {
      const loginCode = await requestLoginApi({
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        code: this.ruleForm.captchacode,
        uuid: localStorage.getItem("nexCM-captcha-uuid")
      });
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (loginCode.code === 200) {
            console.log(loginCode.msg);
            this.getCaptchaCode();
          } else {
            console.log(loginCode.msg);
            this.getCaptchaCode();
          }
        } else {
          this.$message({
            message: "输入的信息有误，请重新输入。",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 获取 二维码 进行
    async getCaptchaCode() {
      const res = await requestCaptchaCodeAPI();
      try {
        if (res.code === 200) {
          const svgText = res.data.img;
          this.captchaCodeSrc = `data:image/svg+xml;utf8,${encodeURIComponent(
            svgText
          )}`;
          localStorage.setItem("nexCM-captcha-uuid", res.data.uuid);
          return;
        } else {
          this.$message.error("已连接服务器，但获取数据失败");
        }
      } catch (error) {
        this.$message.error("服务器获取数据失败，请稍后再试");
      }
    }
  },
  mounted() {
    //项目挂载就获取验证码
    this.getCaptchaCode();
  }
};
</script>

<style scoped lang="less">
.login-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(-45deg, #6a11cb, #2575fc, #36d1dc, #5b86e5);
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
  position: relative;
  .login-box {
    width: 400px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding-right: 40px;
    border-radius: 20px;
    h1 {
      text-align: center;
      margin-top: 20px;
      margin-bottom: 40px;
      padding-left: 20px;
      font-size: 1.6rem;
      color: gray;
    }
    .catcha-box {
      display: flex;
      img {
        margin-left: 10px;
      }
    }
    .loginBtn-box {
      width: 355px;
    }
  }
}
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

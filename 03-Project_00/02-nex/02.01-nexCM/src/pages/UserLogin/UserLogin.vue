<template>
  <div class="login-page">
    <div class="login-box">
      <h1>nexCM - 管理系统</h1>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="'密\xa0\xa0\xa0码'" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captchacode">
          <div class="catcha-box">
            <el-input v-model="ruleForm.captchacode"></el-input>
            <img
              height="40"
              v-if="captchaCodeSrc"
              :src="captchaCodeSrc"
              @click="getCaptchaCode"
              style="cursor: pointer"
            />
            <div v-else style="width: 120px; height: 40px; background: #eee; text-align: center; line-height: 40px">
              加载中
            </div>
          </div>
        </el-form-item>
        <el-form-item style="margin-left: -55px">
          <el-button class="loginBtn-box" type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validateUsername } from "@/utils/index.validate.js";
import { requestCaptchaCodeAPI, requestLoginApi } from "@/common/request/index.js";
export default {
  name: "UserLogin",
  components: {},
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
        captchacode: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          },
          { validator: validateUsername, trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        captchacode: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ]
      },
      captchaCodeSrc: ""
    };
  },
  computed: {},
  methods: {
    // 登录提交
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        // 如果本地数据格式校验成功
        if (valid) {
          try {
            // 提交服务器校验并返回校验结果
            const ServerValidateData = await requestLoginApi({
              username: this.ruleForm.username,
              password: this.ruleForm.password,
              code: this.ruleForm.captchacode,
              uuid: localStorage.getItem("nexCM-captcha-uuid")
            });
            console.log("@@ServerValidateData@@",ServerValidateData);
            
            // 校验结果成功
            this.formReset({
              isClearUsername: true,
              isClearPassword: true,
              isClearCode: true,
              isRefreshCaptcha: false
            });
            // 移除本地保存的数据
            localStorage.removeItem("nexCM-captcha-uuid");
            // 保存服务器给的token
            localStorage.setItem("nexCM-authorization-token", ServerValidateData.data.token);
            // 进入主页
            this.$router.push("/");
          } catch (err) {
            // 所有非200业务异常、网络异常全部进入catch
            this.formReset({
              isClearUsername: false,
              isClearPassword: true,
              isClearCode: true,
              isRefreshCaptcha: true
            });
          }
        } else {
          // 本地校验失败 表单内容校验失败
          this.formReset({
            isClearUsername: false,
            isClearPassword: true,
            isClearCode: true,
            isRefreshCaptcha: true
          });
        }
      });
    },

    // 获取验证码
    async getCaptchaCode() {
      try {
        const res = await requestCaptchaCodeAPI();
        // res 一定是code=200的数据，直接使用
        this.ruleForm.captchacode = "";
        const svgText = res.data.img;
        this.captchaCodeSrc = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
        localStorage.setItem("nexCM-captcha-uuid", res.data.uuid);
      } catch (err) {
        console.error("验证码异常：", err);
        // 验证码接口失败，清空旧图片
        this.captchaCodeSrc = "";
      }
    },

    // 状态重置 响应拦截器已经判定不是200代码的都进行了消息弹出
    formReset(clear = {}) {
      // 解析字段
      const { isClearUsername = false, isClearPassword = false, isClearCode = false, isRefreshCaptcha = false } = clear;
      // 根据字段的结果进行
      if (isClearUsername) this.ruleForm.username = "";
      if (isClearPassword) this.ruleForm.password = "";
      if (isClearCode) this.ruleForm.captchacode = "";
      if (isRefreshCaptcha) this.getCaptchaCode();
    }
  },
  created() {
    // 项目被启动时，获取二维码
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

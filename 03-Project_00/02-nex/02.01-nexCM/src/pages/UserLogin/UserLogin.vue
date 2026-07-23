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
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await requestLoginApi({
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            code: this.ruleForm.captchacode,
            uuid: localStorage.getItem("nexCM-captcha-uuid")
          });
          //如果没有成功，响应拦截器会将res重置为false
          if (!res) {
            //与服务器交互，数据有错误，代码！=200，commStatus=-1
            this.reset("-1", res.msg, {
              isClearUsername: false,
              isClearPassword: true,
              isClearCode: true
            });
            return;
          }
          //成功，代码=200，commStatus=1
          this.reset("1", res.msg, {
            isClearUsername: true,
            isClearPassword: false,
            isClearCode: true
          });
          //成功，清除localStorage里面的uuid
          localStorage.removeItem("nexCM-captcha-uuid");
          localStorage.setItem("nexCM-authorization-token", res.data.token);
          //成功，跳转主页
          this.$router.push("/");
        } else {
          //没有与服务器交互，commStatus=0
          this.reset("0", "填写字段错误，请重新输入", {
            isClearUsername: false,
            isClearPassword: true,
            isClearCode: true
          });
        }
      });
    },
    // 获取 二维码 进行
    async getCaptchaCode() {
      let res = await requestCaptchaCodeAPI();

      if (!res) {
        //与服务器交互，没有获取到二维码，代码！=200，commStatus=-1
        this.reset("-1", res.msg, {
          isClearUsername: false,
          isClearPassword: false,
          isClearCode: true
        });
        return;
      }
      this.ruleForm.captchacode = "";
      const svgText = res.data.img;
      this.captchaCodeSrc = `data:image/svg+xml;utf8,${encodeURIComponent(
        svgText
      )}`;
      localStorage.setItem("nexCM-captcha-uuid", res.data.uuid);
    },

    /**
     * 成功/失败后进行刷新
     * @param commStatus 11表示成功，01标识失败，00标识没有与服务器通讯
     * @param msg 提示消息内容
     * @param clear 是否清空对应字段的输入框内容
     */
    reset(commStatus, msg, clear = {}) {
      let {
        isClearUsername = false,
        isClearPassword = false,
        isClearCode = false
      } = clear;
      if (commStatus === "1") {
        this.$message.success(msg);
      } else if (commStatus === "0") {
        this.$message.warning(msg);
      }
      this.getCaptchaCode();

      if (isClearUsername) {
        this.ruleForm.username = "";
      }
      if (isClearPassword) {
        this.ruleForm.password = "";
      }
      if (isClearCode) {
        this.ruleForm.captchacode = "";
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

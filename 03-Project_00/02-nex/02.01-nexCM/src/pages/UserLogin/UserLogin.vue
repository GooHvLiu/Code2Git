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
              src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='40'><rect width='120' height='40' fill='%23f2f2f2'/><path d='M10,15 L110,25' stroke='%23666' stroke-width='1'/><path d='M20,30 L90,10' stroke='%23666' stroke-width='1'/><text x='15' y='28' font-size='26' fill='%23222' font-family='Arial'>7sK2</text></svg>"
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
      }
    };
  },
  computed: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: "恭喜你，这是一条成功消息",
            type: "success"
          });
        } else {
          this.$message({
            message: "输入的信息有误，请重新输入。",
            type: "warning"
          });
          return false;
        }
      });
    }
  },
  mounted() {}
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

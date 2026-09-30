// pages/auth/login.js
Page({
  data: {
    scene: "",
    status: "loading", // loading | needNickname | ok | err
    nickname: "",
    loginCode: "",
  },

  onLoad(options) {
    const scene = decodeURIComponent(options.scene || "");
    console.log("扫码带入的scene(uuid):", scene);
    this.setData({ scene });

    if (scene) {
      this.doLogin();
    } else {
      this.setData({ status: "err" });
    }
  },

  // 第一步：wx.login 拿 code
  doLogin() {
    wx.login({
      success: (loginRes) => {
        if (!loginRes.code) {
          this.setData({ status: "err" });
          return;
        }
        // 先存 code，等用户输入昵称后一起上报
        this.setData({
          loginCode: loginRes.code,
          status: "needNickname",
        });
      },
      fail: () => {
        this.setData({ status: "err" });
      },
    });
  },

  // 监听昵称输入
  onNicknameChange(e) {
    this.setData({ nickname: e.detail.value });
  },

  // 第二步：上报 code + uuid + nickname
  submitLogin() {
    if (!this.data.nickname) {
      wx.showToast({ title: "请输入昵称", icon: "none" });
      return;
    }

    wx.request({
      url: "https://4d4ef6d6.r27.cpolar.top/api/wx/login",
      method: "POST",
      data: {
        code: this.data.loginCode,
        uuid: this.data.scene,
        nickname: this.data.nickname,
      },
      success: (res) => {
        if (res.data && res.data.ok) {
          this.setData({ status: "ok" });
        } else {
          wx.showToast({
            title: (res.data && res.data.message) || "登录失败",
            icon: "none",
          });
          this.setData({ status: "err" });
        }
      },
      fail: (err) => {
        wx.showModal({
          title: "请求失败",
          content: "errMsg: " + err.errMsg,
          showCancel: false,
        });
      },
    });
  },
});

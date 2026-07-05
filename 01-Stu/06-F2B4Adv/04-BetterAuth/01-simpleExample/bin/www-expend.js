class ExpendFunction {
  /**
   * 新增，优雅关闭服务器
   */
  setupGracefulShutdown(server) {
    const signals = {
      SIGINT: "Terminal Interruption (Ctrl+C)",
      SIGTERM: "Termination Signal",
      SIGQUIT: "Exit Signal",
    };

    Object.keys(signals).forEach((signal) => {
      process.on(signal, () => {
        console.log(
          `\n ⚠️  ShutdownMsg:Get ${signals[signal]}, Shutting Down the Server...`,
        );

        // 停止接收新请求
        server.close(() => {
          console.log("\n ⚠️  ShutdownMsg:The HTTP Server Has Been Shut Down.");
        });

        // 设置超时，强制退出
        setTimeout(() => {
          console.error("\n ⚠️  ShutdownMsg:Close timeout, Force Exit");
          process.exit(1);
        }, 10000);

        // 拒绝新连接
        server.on("close", () => {
          console.log("\n ⚠️  ShutdownMsg:All Connections Have Been Closed.");
        });
      });
    });
  }

  /**
   * 新增，调试及提示信息
   */
  debugMsg(addr) {
    // 使用彩色日志
    const colors = {
      reset: "\x1b[0m",
      green: "\x1b[32m",
      blue: "\x1b[34m",
      yellow: "\x1b[33m",
      red: "\x1b[31m",
      cyan: "\x1b[36m",
    };
    console.log("\n" + "=".repeat(50));
    console.log(`${colors.green}🚀 Server Startup Successful!${colors.reset}`);
    console.log("=".repeat(50));

    console.log(
      `${colors.blue}📡 Environment: ${colors.reset}${process.env.NODE_ENV || "development"}`,
    );
    console.log(`${colors.blue}📡 Ports: ${colors.reset}${addr.port}`);
    console.log(`${colors.blue}📡 Process ID: ${colors.reset}${process.pid}`);
    console.log(`${colors.blue}📡 SERVER IP: ${process.env.LOCAL_IP}`);

    console.log(`\n${colors.cyan}📍 Access Address:${colors.reset}`);
    console.log(
      `   • Local Address:    ${colors.yellow}http://localhost:${addr.port}${colors.reset}`,
    );
    console.log(
      `   • Local IP:    ${colors.yellow}${process.env.SERVER_IP}${colors.reset}`,
    );
  }

  /**
   * 新增：添加请求超时配置，防止请求挂起
   */
  serverSetTimeOut(server) {
    server.setTimeout(120000); // 120秒
    server.keepAliveTimeout = 65000; // 65秒
    server.headersTimeout = 66000; // 66秒
  }
}

module.exports = new ExpendFunction();

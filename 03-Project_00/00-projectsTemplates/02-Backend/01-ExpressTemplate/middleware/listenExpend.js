class ExpendFunction {
  /**
   * 新增，优雅关闭服务器，放在function onListening(){}内
   */
  setupGracefulShutdown(server) {
    const signals = {
      SIGINT: "Terminal Interruption (Ctrl+C)",
      SIGTERM: "Termination Signal",
      SIGQUIT: "Exit Signal",
    };
    // server close 事件仅全局注册一次，避免多次监听堆积
    server.on("close", () => {
      console.log("\n ⚠️  ShutdownMsg:All Connections Have Been Closed.");
    });

    Object.keys(signals).forEach((signal) => {
      process.on(signal, () => {
        console.log(
          `\n ⚠️  ShutdownMsg:Get ${signals[signal]}, Shutting Down the Server...`,
        );

        // 设置超时，强制退出
        const forceExitTimer = setTimeout(() => {
          console.error("\n ⚠️  ShutdownMsg:Close timeout, Force Exit");
          process.exit(1);
        }, 10000);

        // 停止接收新请求
        server.close(() => {
          clearTimeout(forceExitTimer);
          console.log("\n ⚠️  ShutdownMsg:The HTTP Server Has Been Shut Down.");
          process.exit(0);
        });
      });
    });
  }

  /**
   * 新增，调试及提示信息，放在function onListening(){}内
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
      `- Local: ${colors.yellow}http://localhost:${addr.port}${colors.reset}`,
    );
    console.log(
      `- Network: ${colors.yellow}${process.env.SERVER_IP}${colors.reset}`,
    );
  }

  /**
   * 新增：添加请求超时配置，防止请求挂起，放在function onListening(){}内
   */
  serverSetTimeOut(server) {
    server.setTimeout(120000); // 120秒
    server.keepAliveTimeout = 65000; // 65秒
    server.headersTimeout = 66000; // 66秒
  }

  /**
   * 新增：服务器错误增强,放在www/function onError(error){}内
   */
  serverOnError(error, port) {
    if (error.syscall !== "listen") {
      console.error("❌ 服务器错误:", error);
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    const colors = {
      red: "\x1b[31m",
      reset: "\x1b[0m",
    };

    switch (error.code) {
      case "EACCES":
        console.error(`${colors.red}${bind} 需要管理员权限${colors.reset}`);
        console.error("💡 解决方法: 使用 sudo 运行或更换端口");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${colors.red}${bind} 端口已被占用${colors.reset}`);
        console.error("💡 解决方法:");
        console.error(
          "   1. 查找占用进程: lsof -i :1234 (macOS/Linux) 或 netstat -ano | findstr :1234 (Windows)",
        );
        console.error(
          "   2. 杀死进程: kill -9 <PID> 或 taskkill /PID <PID> /F",
        );
        console.error("   3. 或者修改端口号");
        process.exit(1);
        break;
      case "EADDRNOTAVAIL":
        console.error(`${colors.red}${bind} 地址不可用${colors.reset}`);
        process.exit(1);
        break;
      default:
        console.error(`${colors.red}未知错误: ${error.message}${colors.reset}`);
        throw error;
    }
  }
}

module.exports = new ExpendFunction();

const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3101,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3100',
        changeOrigin: true
      },
      '/licenses': {
        target: 'http://127.0.0.1:3100',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  }
});

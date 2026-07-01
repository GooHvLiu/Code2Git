0）因为使用到了消息订阅与发布，需要安装库：npm i pubsub-js
1）vue-resource是vue的数据请求的第三方插件库，在vue1.0时期应用非常广泛

2）第1步：安装插件库：
    npm i vue-resource

3) 第2步：在main.JS中引入插件：
    import Vue from 'vue'
    import App from './App.vue'
    //引入插件
    import VueResource from 'vue-resource'

4) 第3步：在main.JS中使用插件
    Vue.config.productionTip = false
    //使用插件
    Vue.use(VueResource)

5）第4步：若此前使用的是axios，则将导入的语句可以删除：import axios from 'axios'

6）第5步：使用如下语句进行数据请求
    //使用vue-resource第三方库方式，使用方法，返回值等等都是一致的，只是将axios.get更改为this.$http.get
    this.$http.get(...).then...

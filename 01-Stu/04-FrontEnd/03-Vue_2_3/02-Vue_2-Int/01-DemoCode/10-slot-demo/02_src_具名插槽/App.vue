<template>
  <div id="app">
    <ListCategory titles="美食">
      <img slot="top" src="https://p0.ifengimg.com/pmop/2018/0405/134D070813EA5B98DFB8036FDD1FEF3AC7140A14_size37_w640_h427.jpeg" alt="">
      <a slot="footer" href="http://www.baidu.com">美食推荐</a>
    </ListCategory>

    <ListCategory titles="游戏">
      <li slot="top" v-for="(item,index) in games" :key="index">{{item}}</li>
      
      <div class="center" slot="footer">
        <a href="http://www.baidu.com">单机游戏</a>
        <a href="http://www.baidu.com">网络游戏</a>
        <p>欢迎前来观影</p>
      </div>
    </ListCategory>
    
    <ListCategory titles="电影">
      <video controls slot="top" src="./assets/video(21).mp4"></video>

      <!-- 使用template时，可以直接通过v-slot:footer使用具名插槽，其他场景只能使用slot="footer" -->
      <template v-slot:footer>
        <a href="http://www.baidu.com">搞笑电影</a>
        <a href="http://www.baidu.com">经典电影</a>
      </template>
    </ListCategory>
  </div>
</template>

<script>
import ListCategory from './components/ListCategory'

export default {
  name: 'App',
  components: {
    ListCategory
  },
  data() {
    return {
      foods:['火锅','烧烤','小龙虾','牛排'],
      games:['红色警戒','穿越火线','劲舞团','超级玛丽'],
      films:['《教父》','《拆弹专家》','《你好，李焕英》','《战狼》']
    }
  },
}
</script>
<style>
body{
  display: flex;
  justify-content: center;
}
#app{
  width: 800px;
  display: flex;
  justify-content: space-around;
}
.center{
  display: flex;
  justify-content: space-around;
}

img{
  margin-left: -36px;
  width: 120%;
}
video{
  width: 120%;
  margin-left: -36px;
}

</style>

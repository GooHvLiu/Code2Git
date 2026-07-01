<template>
  <div id="app">
    <ListCategory titles="美食">
      <img src="https://p0.ifengimg.com/pmop/2018/0405/134D070813EA5B98DFB8036FDD1FEF3AC7140A14_size37_w640_h427.jpeg" alt="">
    </ListCategory>

    <ListCategory titles="游戏">
      <li v-for="(item,index) in games" :key="index">{{item}}</li>
    </ListCategory>
    
    <ListCategory titles="电影">
      <video controls src="./assets/video(21).mp4"></video>
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

img{
  margin-left: -36px;
  width: 120%;
}
video{
  width: 120%;
  margin-left: -36px;
}

</style>

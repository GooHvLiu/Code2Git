<template>
  <div id="app">
    <ListCategory>
      <!-- 
        *** 必须使用template进行包裹使用作用于插槽
        *** slot-scope="slotObj"，slotObj为对象，内部有传进来的参数
      -->
      <template slot-scope="slotObj">
        <ul>
          <li v-for="(item,index) in slotObj.games" :key="index">{{item}}</li>
        </ul>
      </template>
    </ListCategory>

    <ListCategory>
      <!-- 
        *** 必须使用template进行包裹使用作用于插槽
        *** slot-scope="{games}"，{games}为结构赋值，可以直接使用games
      -->
      <template slot-scope="{games}">
        <ol style="background-color: red;">
          <li v-for="(item,index) in games" :key="index">{{item}}</li>
        </ol>
      </template>
    </ListCategory>

    <ListCategory>
      <!-- 
        *** 必须使用template进行包裹使用作用于插槽
        *** scope="slotObj"，scope为之前api，slot-scope为新的api
      -->
      <template scope="slotObj">
        <ul>
          <li v-for="(item,index) in slotObj.games" :key="index">{{item}}</li>
        </ul>
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

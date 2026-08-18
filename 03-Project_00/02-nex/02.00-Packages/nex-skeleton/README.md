# nex-skeleton

Vue 2 骨架屏组件，支持头像、标题、段落占位和微光扫过动画。

## 安装

```bash
npm install nex-skeleton --save
```

## 全局注册

```js
import Skeleton from 'nex-skeleton'
Vue.component('Skeleton', Skeleton)
```

## 使用

```vue
<template>
  <div>
    <Skeleton :loading="loading" :rows="5" avatar title>
      <div class="real-content">
        <h2>{{ data.title }}</h2>
        <p>{{ data.content }}</p>
      </div>
    </Skeleton>
  </div>
</template>

<script>
export default {
  data() {
    return { loading: true, data: {} }
  },
  async mounted() {
    this.data = await fetchData()
    this.loading = false
  }
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| loading | 是否显示骨架 | Boolean | true |
| rows | 段落行数 | Number | 3 |
| avatar | 是否显示头像占位 | Boolean | false |
| avatarSize | 头像大小（px） | Number | 40 |
| title | 是否显示标题占位 | Boolean | false |
| animated | 是否开启动画 | Boolean | true |

## License

MIT

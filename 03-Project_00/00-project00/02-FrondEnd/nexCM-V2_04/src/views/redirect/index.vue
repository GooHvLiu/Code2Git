<script>
/* eslint-disable vue/multi-word-component-names */
/**
 * ==========================================
 * 路由重定向页（无刷新重载）
 * ==========================================
 * 用于标签页"刷新"功能：
 *   1. 从当前页跳转到 /redirect?path=xxx
 *   2. 本页面立即跳回 xxx
 *   3. 由于路由变化，目标组件会被销毁重建，实现无白屏刷新
 * 比 location.reload() 体验更好，不会整页白屏
 */
export default {
  name: 'Redirect',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const path = to.query.path || '/'
      vm.$router.replace(path)
    })
  },
  render(h) {
    return h()
  }
}
</script>

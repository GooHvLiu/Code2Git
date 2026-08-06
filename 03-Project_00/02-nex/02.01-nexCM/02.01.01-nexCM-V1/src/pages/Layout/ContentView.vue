<template>
  <div class="ContentView">
    <TransitionSlide direction="down" :duration="280" mode="out-in">
      <router-view></router-view>
    </TransitionSlide>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { TransitionSlide } from "@morev/vue-transitions";
export default {
  name: "ContentView",
  components: { TransitionSlide },
  data() {
    return {};
  },
  computed: {
    // 从state中获取到 navCollapse 变量
    ...mapState("navCollapse", ["isCollapse"])
  },
  watch: {
    isCollapse() {}
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="less">
.ContentView {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
}
</style>

<template>
  <div class="ContentView">
    <TransitionSlide direction="down" :duration="280" mode="out-in">
      <router-view></router-view>
    </TransitionSlide>
  </div>
</template>

<script>
import { TransitionSlide } from "@morev/vue-transitions";
export default {
  name: "ContentView",
  components: { TransitionSlide },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="less"></style>

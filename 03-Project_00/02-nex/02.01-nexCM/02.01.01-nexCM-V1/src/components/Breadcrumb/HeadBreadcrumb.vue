<template>
  <div class="HeadBreadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(list,id) in breadLists " :key=id>{{ list}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "HeadBreadcrumb",
  components: {},
  data() {
    return {
      breadLists :[],

    };
  },
  watch:{
    $route:{
      immediate:true,
      handler(to){
        this.breadLists =to.meta.titles || []        
      }
    }
  },
  computed: {},
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="less"></style>

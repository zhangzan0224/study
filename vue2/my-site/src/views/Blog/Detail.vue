<template>
  <Layout>
    <div class="main-container" v-loading="isLoading">
      <BlogDetail :blog="data" v-if="data"></BlogDetail>
    </div>
    <template v-slot:right>
      <div class="right-container" v-loading="isLoading">
        <BlogTOC></BlogTOC>
      </div>
    </template>
  </Layout>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import Layout from "@/components/Layout/index.vue";
import fetchData from "@/mixins/fetchData";
import { getBlogDetail } from "@/api/blog.js";
import BlogDetail from "@/views/Blog/components/BlogDetail.vue";
import BlogTOC from "@/views/Blog/components/BlogTOC.vue";
export default {
  name: "Detail",
  data() {
    // 这里存放数据
    return {};
  },
  mixins: [fetchData(null)],
  // import 引入的组件需要注入到对象中才能使用
  components: { BlogDetail, Layout, BlogTOC },
  props: {},
  // 方法集合
  methods: {
    async fetchData() {
      return await getBlogDetail(this.$route.params.id);
    },
  },
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  //过滤器
  filters: {},
  // 生命周期 - 创建之前
  beforeCreate() {},
  // 生命周期 - 创建完成（可以访问当前this 实例）
  created() {},
  // 生命周期 - 挂载之前
  beforeMount() {},
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {},
  // 生命周期 - 更新之前
  beforeUpdate() {},
  // 生命周期 - 更新之后
  updated() {},
  // 生命周期 - 销毁之前
  beforeDestroy() {},
  // 生命周期 - 销毁完成
  destroyed() {},
  // 如果页面有 keep-alive 缓存功能,这个函数会触发
  //进入的时候触发
  activated() {},
  //离开的时候触发
  deactivated() {},
};
</script>

<style scoped lang="less">
.main-container {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;
}
.right-container {
  height: 100%;
  width: 300px;
  overflow-y: scroll;
  box-sizing: border-box;
  position: relative;
  padding: 20px;
}
</style>

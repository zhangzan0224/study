<template>
  <Layout>
    <div class="main-container" v-loading="isLoading" ref="mainContainer">
      <BlogDetail :blog="data" v-if="data"></BlogDetail>
      <!--等文章加载完成之后再去加载评论-->
      <BlogComment v-if="!isLoading"></BlogComment>
    </div>
    <template v-slot:right>
      <div class="right-container" v-loading="isLoading">
        <BlogTOC :toc="data.toc" v-if="data"></BlogTOC>
      </div>
    </template>
  </Layout>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import Layout from "@/components/Layout/index.vue";
import fetchData from "@/mixins/fetchData";
import processMainScroll from "@/mixins/processMainScroll";
import { getBlogDetail } from "@/api/blog.js";
import BlogDetail from "@/views/Blog/components/BlogDetail.vue";
import BlogTOC from "@/views/Blog/components/BlogTOC.vue";
import BlogComment from "@/views/Blog/components/BlogComment.vue";
import { titleControl } from "@/utils";

export default {
  name: "Detail",
  data() {
    // 这里存放数据
    return {};
  },
  mixins: [fetchData(null), processMainScroll("mainContainer")],
  // import 引入的组件需要注入到对象中才能使用
  components: { BlogComment, BlogDetail, Layout, BlogTOC },
  props: {},
  // 方法集合
  methods: {
    async fetchData() {
      const resp = await getBlogDetail(this.$route.params.id);
      if (resp.title) {
        titleControl.setRouteTitle(resp.title);
      }
      return resp;
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
  // 生命周期 - 更新之前
  beforeUpdate() {},
  // 生命周期 - 更新之后
  updated() {
    // 数据加载完成之后,回运行updated函数,这个时候需要去判断一下hash值,如果有hash值,就跳转到对应的位置
    // ! 当刷新页面的时候,如果之前存在hash值,但是不跳转,为什么呢?刚开始dom元素是app,然后才是main-container,所以需要延迟一下,window只要监测到hash值变化才会去跳转
    const locationHash = window.location.hash;
    window.location.hash = "";
    setTimeout(() => {
      window.location.hash = locationHash;
    }, 0);
  },
  // 生命周期 - 销毁完成
  destroyed() {
    console.log("detail destroyed", this);
  },
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
  padding: 20px;
  box-sizing: border-box;
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

<template>
  <div class="blog-comment-container">
    <MessageArea
      title="评论列表"
      :subTitle="`(${data.total})` || '0'"
      :list="data.rows"
      :isListLoading="isLoading"
      @submit="handleSubmit"
    ></MessageArea>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';

import MessageArea from "@/components/MessageArea/index.vue";
import fetchData from "@/mixins/fetchData";
import { getBlogComments, postComment } from "@/api/blog.js";
export default {
  name: "BlogComment",
  data() {
    // 这里存放数据
    return {
      page: 1,
      limit: 10,
    };
  },
  mixins: [fetchData({ total: 0, rows: [] })],
  // import 引入的组件需要注入到对象中才能使用
  components: { MessageArea },
  props: {},
  // 方法集合
  methods: {
    // 监控滚动事件，加载更多评论
    handleScroll(dom) {
      if (this.isLoading || !dom) return; // 如果正在加载中，不监控滚动事件
      const range = 100; // 距离底部 100px 时触发
      const { clientHeight, scrollHeight, scrollTop } = dom; // dom 是滚动的容器 clentHeight 是可视区域的高度 scrollHeight 是滚动容器的高度 scrollTop 是滚动条的高度
      if (Math.abs(scrollHeight - clientHeight - scrollTop) < range) {
        this.getMoreComments();
      }
    },
    // 获取数据
    async fetchData() {
      return await getBlogComments(
        this.$route.params.id,
        this.page,
        this.limit
      );
    },
    // 获取更多评论
    async getMoreComments() {
      if (!this.hasMore || this.isLoading) return; // 如果没有更多数据或者正在加载中,就不再去请求
      this.isLoading = true;
      this.page++;
      const res = await getBlogComments(
        this.$route.params.id,
        this.page,
        this.limit
      );
      if (res) {
        this.data.total = res.total;
        this.data.rows.push(...res.rows);
        this.isLoading = false;
      }
    },
    // 提交评论
    async handleSubmit(formData, callback) {
      const res = await postComment({
        blogId: this.$route.params.id,
        ...formData,
      });
      // console.log(res, "res");
      if (res) {
        this.data.total++;
        this.data.rows.unshift(res);
        callback("评论成功"); // 告诉子组件我处理完了,去执行子组件中的函数
      } else {
        callback("评论失败");
      }
    },
  },
  // 计算属性 类似于 data 概念
  computed: {
    //  是否存在更多数据
    hasMore() {
      return this.data.total > this.data.rows.length;
    },
  },
  // 监控 data 中的数据变化
  watch: {},
  // 生命周期 - 创建之前
  beforeCreate() {},
  // 生命周期 - 创建完成（可以访问当前this 实例）
  created() {
    this.$bus.$on("mainScroll", this.handleScroll);
  },
  // 生命周期 - 挂载之前
  beforeMount() {},
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {},
  // 生命周期 - 更新之前
  beforeUpdate() {},
  // 生命周期 - 更新之后
  updated() {},
  // 生命周期 - 销毁之前
  beforeDestroy() {
    this.$bus.$off("mainScroll", this.handleScroll);
  },
  // 生命周期 - 销毁完成
  destroyed() {},
  // 如果页面有 keep-alive 缓存功能,这个函数会触发
  //进入的时候触发
  activated() {},
  //离开的时候触发
  deactivated() {},
};
</script>

<style scoped lang="less"></style>

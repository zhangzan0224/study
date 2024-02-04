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
z

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
    return {};
  },
  mixins: [fetchData({ total: 0, rows: [] })],
  // import 引入的组件需要注入到对象中才能使用
  components: { MessageArea },
  props: {},
  // 方法集合
  methods: {
    async fetchData() {
      return await getBlogComments(this.$route.params.id, 1, 10);
    },
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
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
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

<style scoped lang="less"></style>

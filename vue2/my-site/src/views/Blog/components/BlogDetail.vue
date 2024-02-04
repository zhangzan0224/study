<template>
  <div class="blog-detail-container">
    <h1>{{ blog.title }}</h1>
    <div class="aside">
      <span>日期：{{ blog.createDate }}</span>
      <span>浏览：{{ blog.scanNumber }}</span>
      <a href="#data-form-container">评论：{{ blog.commentNumber }}</a>
      <RouterLink
        :to="{
          name: 'BlogCategory',
          params: {
            categoryId: blog.category.id,
          },
        }"
        >{{ blog.category.name }}
      </RouterLink>
    </div>
    <div v-html="blog.htmlContent" class="markdown-body"></div>
  </div>
</template>

<script>
// 引入highlight.js样式
import "highlight.js/styles/github.css";
export default {
  name: "BlogDetail",
  props: {
    blog: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/styles/var.less";
// 使用markdown样式
@import "~@/styles/markdown.css";
.blog-detail-container {
  .aside {
    font-size: 12px;
    color: @gray;
    span,
    a {
      margin-right: 5px;
    }
  }
  .markdown-body {
    margin: 2em 0;
  }
}
</style>

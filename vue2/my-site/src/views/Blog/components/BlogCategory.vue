<template>
  <div class="blog-category-container" v-loading="isLoading">
    <h2>文章分类</h2>
    <RightList :list="list" @select="handleSelect"/>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import RightList from "@/views/Blog/components/RightList.vue";
import fetchData from "@/mixins/fetchData";
import { getBlogTypes } from "@/api/blog.js";
export default {
  name: "BlogCategory",
  data() {
    // 这里存放数据
    return {};
  },
  mixins: [fetchData([])],
  // import 引入的组件需要注入到对象中才能使用
  components: { RightList },
  props: {},
  // 方法集合
  methods: {
    async fetchData() {
      return await getBlogTypes();
    },
    handleSelect (item) {
      const query = {
        page: 1,
        limit: this.limit,
      }
      if (item.id === -1) {
        this.$router.push({
          name: "Blog",
          query,
        });
      } else {
        this.$router.push({
          name: "BlogCategory",
          params: {
            categoryId: item.id,
          },
          query,
        });
      }
    },
  },
  // 计算属性 类似于 data 概念
  computed: {
    // 文章分类
    categoryId() {
      return +this.$route.params.categoryId || -1;
    },
    limit () {
      return +this.$route.query.limit || 10;
    },
    // 用于展示的文章分类
    list() {
      const total = this.data.reduce((prev, next) => {
        return prev + next.articleCount;
      }, 0);
      const result  = [
        {
          name: "全部",
          id: -1,
          articleCount: total,
        },
        ...this.data,
      ]
      return result.map(it => {
        return {
          ...it,
          aside: `(${it.articleCount})篇`,
          isSelected: it.id === this.categoryId
        }
      })
    },
  },
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

<style scoped lang="less">
.blog-category-container {
  width: 300px;
  box-sizing: border-box;
  padding: 20px;
  position: relative;
  height: 100%;
  overflow-y: auto;
  h2 {
    font-weight: bold;
    letter-spacing: 2px;
    font-size: 1em;
    margin: 0;
  }
}
</style>

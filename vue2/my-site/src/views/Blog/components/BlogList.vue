<template>
  <div class="blog-list-container" ref="container" v-loading="isLoading">
    <ul v-if="data">
      <li v-for="item in data.rows" :key="item.id">
        <div class="thumb" v-if="item.thumb">
          <a href="">
            <img :src="item.thumb" :alt="item.title" :title="item.title" />
          </a>
        </div>
        <div class="main">
          <a href="">
            <h2>{{ item.title }}</h2>
          </a>
          <div class="aside">
            <span>日期：{{ formatDate(item.createDate) }}</span>
            <span>浏览：{{ item.scanNumber }}</span>
            <span>评论：{{ item.commentNumber }}</span>
            <a :href="`/article/cate/${item.category.id}`" class="">{{
              item.category.name
            }}</a>
          </div>
          <div class="desc">
            {{ item.description }}
          </div>
        </div>
      </li>
    </ul>
    <Pager
      v-if="data.total"
      :total="data.total"
      :current="routeInfo.page"
      :limit="routeInfo.limit"
      :visibleNumber="10"
      @pageChange="handlePageChange"
    ></Pager>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import Pager from "@/components/Pager/index.vue";
import fetchData from "@/mixins/fetchData";
import { getBlogs } from "@/api/blog.js";
import { formatDate } from "@/utils";
export default {
  name: "BlogList",
  data() {
    // 这里存放数据
    return {};
  },
  // import 引入的组件需要注入到对象中才能使用
  components: { Pager },
  props: {},
  // 计算属性 类似于 data 概念
  computed: {
    // 路由信息
    routeInfo() {
      const categoryId = +this.$route.params.categoryId || -1;
      const page = +this.$route.query.page || 1;
      const limit = +this.$route.query.limit || 10;
      return {
        categoryId,
        page,
        limit,
      };
    },
  },
  mixins: [fetchData(null)],
  // 方法集合
  methods: {
    formatDate,
    async fetchData() {
      return await getBlogs({
        page: this.routeInfo.page,
        limit: this.routeInfo.limit,
        categoryId: this.routeInfo.categoryId,
      });
    },
    // 处理分页
    handlePageChange(newPage) {
      const query = {
        page: newPage,
        limit: this.routeInfo.limit,
      };
      // 跳转到 当前的分类id  当前的页容量  newPage的页码
      if (this.routeInfo.categoryId === -1) {
        // 当前没有分类
        this.$router.push({
          name: "Blog",
          query,
        });
      } else {
        this.$router.push({
          name: "BlogCategory",
          query,
          params: {
            categoryId: this.routeInfo.categoryId,
          },
        });
      }
    },
  },
  // 监控 data 中的数据变化
  watch: {
    // 监控路由的变化,如果路由变化了,就重新获取数据
    async $route() {
      this.isLoading = true;
      // 滚动高度为0，否则影响loading的展示
      this.$refs.container.scrollTop = 0;
      this.data = await this.fetchData();
      this.isLoading = false;
    },
  },
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
@import "~@/styles/var.less";
.blog-list-container {
  line-height: 1.7;
  position: relative;
  padding: 20px;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  scroll-behavior: smooth;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
}
li {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid @gray;
  .thumb {
    flex: 0 0 auto;
    margin-right: 15px;
    img {
      display: block;
      max-width: 200px;
      border-radius: 5px;
    }
  }
  .main {
    flex: 1 1 auto;
    h2 {
      margin: 0;
    }
  }
  .aside {
    font-size: 12px;
    color: @gray;
    span {
      margin-right: 15px;
    }
  }
  .desc {
    margin: 15px 0;
    font-size: 14px;
  }
}
</style>

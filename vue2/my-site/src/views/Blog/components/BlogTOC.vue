<template>
  <div class="blog-toc-container">
    <h2>目录</h2>
    <RightList :list="processList" @select="handleSelect" />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';

import RightList from "@/views/Blog/components/RightList.vue";

export default {
  name: "BlogTOC",
  data() {
    // 这里存放数据
    return {
      activeAnchor: "",
    };
  },
  // import 引入的组件需要注入到对象中才能使用
  components: { RightList },
  props: {
    toc: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  // 方法集合
  methods: {
    handleSelect(item) {
      this.activeAnchor = item.anchor;
      window.location.hash = item.anchor;
    },
  },
  // 计算属性 类似于 data 概念
  computed: {
    processList() {
      // 递归调用
      const getTOC = (toc = []) => {
        return toc.map((item) => {
          return {
            ...item,
            isSelected: item.anchor === this.activeAnchor,
            children: getTOC(item.children),
          };
        });
      };
      return getTOC(this.toc);
    },
  },
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
.blog-toc-container {
  h2 {
    font-weight: bold;
    letter-spacing: 2px;
    font-size: 1em;
    margin: 0;
  }
}
</style>

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
// 导入防抖函数
import { debounce } from "@/utils";
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
      window.location.hash = item.anchor;
    },
    setSelect() {
      // 先把所有的元素都设置为非选中
      this.activeAnchor = "";
      const doms = this.tocDOMs;
      const range = 200; // 距离顶部的距离设置在这个范围内的时候，就认为是选中了
      for (let i = 0; i < doms.length; i++) {
        const dom = doms[i];
        // 看一下当前这个元素是不是应该被选中
        if (!dom) {
          continue;
        }
        // dom.getBoundingClientRect().top 距离顶部的距离
        const top = dom.getBoundingClientRect().top;
        // 在控制范围内
        if (top >= 0 && top < range) {
          this.activeAnchor = dom.id;
          break;
        } else if (top > range) {
          // 在规定的范围下面
          return;
        } else {
          // 在规定的范围上面,但是不在控制范围内
          this.activeAnchor = dom.id;
        }
      }
    },
  },
  // 计算属性 类似于 data 概念
  computed: {
    processList() {
      // 递归调用,需要处理children,并且需要处理是否选中
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
    // 根据toc得到它们对应的元素数组
    tocDOMs() {
      const doms = [];
      const addDOMs = (toc = []) => {
        for (const tocElement of toc) {
          doms.push(document.getElementById(tocElement.anchor));
          if (tocElement.children && tocElement.children.length > 0) {
            addDOMs(tocElement.children);
          }
        }
      };
      addDOMs(this.toc);
      return doms;
    },
  },
  // 监控 data 中的数据变化
  watch: {},
  //过滤器
  filters: {},
  // 生命周期 - 创建之前
  beforeCreate() {},
  // 生命周期 - 创建完成（可以访问当前this 实例）
  created() {
    this.$bus.$on("mainScroll", debounce(this.setSelect, 100));
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
  beforeDestroy() {},
  // 生命周期 - 销毁完成
  destroyed() {
    this.$bus.$off("mainScroll", debounce(this.setSelect, 50));
  },
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

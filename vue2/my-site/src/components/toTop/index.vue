<template>
  <div class="to-top-container" v-show="isShow" @click="handleClick">Top</div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';

export default {
  name: "ToTop",
  data() {
    // 这里存放数据
    return {
      isShow: false,
    };
  },
  // import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  // 方法集合
  methods: {
    handleScroll(dom) {
      // 如果被监控的元素都没有了，就不再监控
      if (!dom) {
        this.isShow = false;
        return;
      }
      this.isShow = dom.scrollTop > 500;
    },
    // 点击事件
    handleClick() {
      this.$bus.$emit("setMainScroll", 0);
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

<style scoped lang="less">
.to-top-container {
  position: fixed;
  z-index: 99;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #f40;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
}
</style>

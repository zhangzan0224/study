export default function (refValue) {
  return {
    methods: {
      // 处理滚动的函数
      handleMainScroll() {
        this.$bus.$emit("mainScroll", this.$refs[refValue]);
      },
      handleSetMainScroll(top) {
        this.$refs[refValue].scrollTop = top;
      },
    },
    // 生命周期 - 挂载完成（可以访问 DOM 元素）
    mounted() {
      this.$refs[refValue].addEventListener("scroll", this.handleMainScroll);
      // 监听top按钮的点击事件
      this.$bus.$on("setMainScroll", this.handleSetMainScroll);
    },
    // 生命周期 - 销毁之前
    beforeDestroy() {
      // 触发滚动事件，dom元素为未知的，主要用于top按钮的显示隐藏
      this.$bus.$emit("mainScroll", null);
      this.$refs[refValue].removeEventListener("scroll", this.handleMainScroll);
      this.$bus.$off("setMainScroll", this.handleSetMainScroll);
    },
  };
}

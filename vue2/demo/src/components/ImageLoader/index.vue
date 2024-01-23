<template>
  <div class="image-loader-container">
    <!-- 一个比较小的图 -->
    <img class="placeholder" v-if="!everyDown" :src="placeholder" alt="">
    <!-- 通过链接获取的图 -->
    <img :src="src" alt="" :style="{transition: `${duration}ms`, opacity: show ? 1 : 0}" @load="handleLoaded">
  </div>
</template>
<script>
export default {
  name: 'ImageLoader',
  components: {},
  props: {
    src: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 500,
    }
  },
  data () {
    return {
      show: false, // 原始图片是否展示
      everyDown: false // 是否图片加载完成，并且动画完成
    }
  },
  // 计算属性
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    handleLoaded () {
      this.show = true // 先改变图片的透明度
      setTimeout(() => {
        this.everyDown = true // 动画完成之后，将透明的图片去掉
      }, this.duration);
      this.$emit('load')
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/styles/mixin.less";
.image-loader-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  img {
    .self-fill();
    object-fit: cover;
  }

  .placeholder {
    filter: blur(2vw); /*虚化 https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter*/ 
  }
}
</style>

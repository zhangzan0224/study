<template>
  <div class="home-container" ref="container" @wheel="handleWheel" v-loading="isLoading">
    <ul
      class="carousel-container"
      :style="{ marginTop }"
      @transitionend="handleTransitionEnd"
    >
      <li v-for="(item, index) in banners" :key="item.id">
        <CarouselItem
          :ref="`item${index}`"
          :carouse="item"
        ></CarouselItem>
      </li>
    </ul>
    <div
      class="icon icon-up"
      v-show="currentIndex >= 1"
      @click="switchTo(currentIndex - 1)"
    >
      <Icon type="arrowUp"></Icon>
    </div>
    <div
      class="icon icon-down"
      v-show="currentIndex < banners.length - 1"
      @click="switchTo(currentIndex + 1)"
    >
      <Icon type="arrowDown"></Icon>
    </div>
    <!-- 指示器 -->
    <ul class="indicator">
      <li
        v-for="(item, i) in banners"
        :key="item.id"
        :class="{ active: i === currentIndex }"
        @click="switchTo(i)"
      ></li>
    </ul>
  </div>
</template>

<script>
import CarouselItem from "./CarouselItem";
import Icon from "@/components/Icon";
import { getBannerList } from "@/api/banner";
export default {
  components: {
    CarouselItem,
    Icon,
  },
  data() {
    return {
      isLoading: false, // 是否展示loading
      banners: [],
      currentIndex: 0, // 当前轮播图的索引
      clientHeight: 0, // 客户端高度
      swithching: false, // 是否正在切换
    };
  },
  watch: {
    currentIndex: {
      // 根据currentIndex的值，切换轮播图,来实现切换时,文字的加载效果,调用子组件的imgLoad方法
      handler(newVal) {
        this.$refs[`item${newVal}`] && this.$refs[`item${newVal}`][0].textRender();
      },
      immediate: true,
    },
  },
  methods: {
    // 切换轮播图的index
    switchTo(index) {
      this.currentIndex = index;
    },
    // 监听鼠标滚轮事件
    handleWheel(e) {
      if (this.swithching) return;
      if (e.deltaY < -15 && this.currentIndex > 0) {
        // 向上滚动
        this.swithching = true;
        this.currentIndex--;
      } else if (e.deltaY > 15 && this.currentIndex < this.banners.length - 1) {
        // 向下滚动
        this.swithching = true;
        this.currentIndex++;
      } else {
        return;
      }
    },
    // 监听轮播图切换完成
    handleTransitionEnd() {
      console.log("切换完成");
      this.swithching = false;
    },
    // 监听窗口大小变化
    handleResize() {
      this.clientHeight = this.$refs.container.clientHeight;
    },
  },
  async created() {
    this.isLoading = true;
    const res = await getBannerList();
    this.banners = res;
    this.isLoading = false;
  },
  computed: {
    // 轮播图容器的ulmarginTop的值，用于切换图片
    marginTop() {
      return -(this.clientHeight * this.currentIndex) + "px";
    },
  },
  mounted() {
    this.clientHeight = this.$refs.container.clientHeight;
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped lang="less">
@import "~@/styles/mixin.less";
@import "~@/styles/var.less";
.home-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden; // !隐藏超出部分，省的会找不到箭头和指示器，和下面的marginTop配合使用
  ul {
    margin: 0;
    list-style: none;
    padding: 0;
  }
  .carousel-container {
    width: 100%;
    height: 100%;
    transition: 500ms;
    li {
      width: 100%;
      height: 100%;
    }
  }
  .icon {
    .self-center();
    font-size: 30px;
    @gap: 25px;
    color: @gray;
    cursor: pointer;
    transform: translateX(-50%);
    &.icon-up {
      top: @gap;
      animation: jump-up 2s infinite;
    }
    &.icon-down {
      top: auto;
      bottom: @gap;
      animation: jump-down 2s infinite;
    }
    @jump: 5px;
    @keyframes jump-up {
      0% {
        transform: translate(-50%, @jump);
      }
      50% {
        transform: translate(-50%, -@jump);
      }
      100% {
        transform: translate(-50%, @jump);
      }
    }
    @keyframes jump-down {
      0% {
        transform: translate(-50%, -@jump);
      }
      50% {
        transform: translate(-50%, @jump);
      }
      100% {
        transform: translate(-50%, -@jump);
      }
    }
  }
  // 指示器
  .indicator {
    .self-center();
    transform: translateY(-50%);
    left: auto;
    right: 20px;
    li {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: @words;
      margin-bottom: 10px;
      border: 1px solid #fff;
      box-sizing: border-box;
      cursor: pointer;
      &.active {
        background: #fff;
      }
    }
  }
}
</style>

<template>
  <div
    class="carousel-item-container"
    ref="container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="carousel-img" ref="img" :style="imagePosition">
      <ImageLoader
        @load="handleLoad"
        :src="carouse.bigImg"
        :placeholder="carouse.midImg"
      />
    </div>
    <div class="title" ref="title">{{ carouse.title }}</div>
    <div class="desc" ref="desc">{{ carouse.description }}</div>
  </div>
</template>

<script>
import ImageLoader from "@/components/ImageLoader";
export default {
  components: {
    ImageLoader,
  },
  props: {
    carouse: {
      type: Object,
      required: true,
    },
    banners: {
      type: Array,
      required: true,
    },
    currentIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      titleWidth: 0,
      descWidth: 0,
      imgWidth: 0, // 图片宽度
      imgHeight: 0, // 图片高度
      containerWidth: 0, // 图片容器宽度
      containerHeight: 0, // 图片容器高度
      mouseX: 0, // 鼠标在容器中的x坐标
      mouseY: 0, // 鼠标在容器中的y坐标
    };
  },
  computed: {
    // 根据鼠标在容器中的x和y坐标，计算出图片的偏移量
    imagePosition() {
      if (
        !this.containerHeight ||
        !this.containerWidth ||
        !this.imgHeight ||
        !this.imgWidth
      ) {
        return;
      }
      const extraWidth = this.imgWidth - this.containerWidth; // 可以移动的最大的x距离 对应的应该是鼠标可移动的最大的距离是容器的宽度
      const extraHeight = this.imgHeight - this.containerHeight; //  可以移动的最大的y距离 对应的应该是鼠标可移动的最大的距离是容器的高度
      const left = this.mouseX * (extraWidth / this.containerWidth);
      const top = this.mouseY * (extraHeight / this.containerWidth);
      return {
        transform: `translate(-${left}px, -${top}px)`,
      };
    },
    // 容器的中心位置
    center() {
      return {
        x: this.containerWidth / 2,
        y: this.containerHeight / 2,
      };
    },
  },
  mounted() {
    this.titleWidth = this.$refs.title.clientWidth;
    this.descWidth = this.$refs.desc.clientWidth;
    this.setSize();
    window.addEventListener("resize", this.setSize);
  },
  methods: {
    // 处理图片加载完成之后函数，展示文字，使用动画
    handleLoad() {
      this.$refs.title.style.opacity = 1;
      this.$refs.title.style.width = 0;
      // 强制浏览器刷新
      this.$refs.title.clientWidth;
      this.$refs.title.style.transition = "width 1s";
      this.$refs.title.style.width = this.titleWidth + "px";

      // 描述同需求一样
      this.$refs.desc.style.opacity = 1;
      this.$refs.desc.style.width = 0;
      this.$refs.desc.clientWidth;
      this.$refs.desc.style.transition = "width 1s 1s";
      this.$refs.desc.style.width = this.descWidth + "px";
    },
    // 当切换currentIndex的时候,文字进行动画
    textRender() {
      this.$refs.title.style.opacity = 0;
      this.$refs.title.style.width = 0;
      this.$refs.title.style.transition = "none";
      this.$refs.desc.style.opacity = 0;
      this.$refs.desc.style.width = 0;
      this.$refs.desc.style.transition = "none";
      this.$nextTick(() => {
        this.$refs.desc.clientWidth;
        this.$refs.title.style.opacity = 1;
        this.$refs.title.style.width = this.titleWidth + "px";
        this.$refs.title.style.transition = "width 1s";
        this.$refs.desc.style.opacity = 1;
        this.$refs.desc.style.width = this.descWidth + "px";
        this.$refs.desc.style.transition = "width 1s 1s";
      });
    },
    // 获取图片和图片容器的宽度和高度，当页面大小发生变化时，需要重新计算
    setSize() {
      this.imgWidth = this.$refs.img.clientWidth;
      this.imgHeight = this.$refs.img.clientHeight;
      this.containerWidth = this.$refs.container.clientWidth;
      this.containerHeight = this.$refs.container.clientHeight;
    },
    // 当鼠标移动的时候，需要重新计算图片的位置
    handleMouseMove(e) {
      const reat = this.$refs.container.getBoundingClientRect();
      this.mouseX = e.clientX - reat.left; // 视口的x减去容器的定位x坐标
      this.mouseY = e.clientY - reat.top; // 视口的y减去容器的定位y坐标
    },
    // 当鼠标移出的时候，需要重新计算图片的位置
    handleMouseLeave() {
      this.mouseX = this.center.x;
      this.mouseY = this.center.y;
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setSize);
  },
};
</script>

<style lang="less" scoped>
@import "~@/styles/var.less";
.carousel-item-container {
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
  .carousel-img {
    width: 110%;
    height: 110%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .title,
  .desc {
    position: absolute;
    letter-spacing: 3px;
    left: 30px;
    color: #fff;
    text-shadow: 1px 0 0 rgba(0, 0, 0, 0.5), -1px 0 0 rgba(0, 0, 0, 0.5),
      0 1px 0 rgba(0, 0, 0, 0.5), 0 -1px 0 rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    overflow: hidden;
    opacity: 0;
    // 通过修改width来进行动画
  }
  .title {
    top: calc(50% - 40px);
    font-size: 2em;
  }
  .desc {
    top: calc(50% + 20px);
    font-size: 1.2em;
    color: lighten(@gray, 20%);
  }
}
</style>

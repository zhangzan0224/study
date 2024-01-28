<template>
  <div class="home-container" ref="container">
    <ul>
      <li v-for="item in banners" :key="item.id">
        <CarouselItem></CarouselItem>
      </li>
    </ul>
    <!-- <div class="icon icon-up"></div> -->
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
      banners: [],
    };
  },
  methods: {
    handleClick() {
      // this.$sayHello();
      this.$showMessage({
        content: "评论成功",
        type: "success",
        container: this.$refs.container,
        callback: function () {
          console.log("完成！！！");
        },
      });
    },
  },
  async created() {
    const res = await getBannerList();
    this.banners = res;
  },
};
</script>

<style scoped>
.home-container {
}
</style>

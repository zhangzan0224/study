<template>
  <div class="about-container" v-loading="loading || !srcLoaded">
    <iframe
      v-if="src"
      :src="src"
      frameborder="0"
      class="about-content"
      @load="srcLoaded = true"
    ></iframe>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "About",
  data() {
    return {
      srcLoaded: false,
    };
  },
  computed: mapState("about", {
    src: "data",
    loading: "loading",
  }),
  created() {
    this.$store.dispatch("about/fetchAbout");
  },
};
</script>

<style lang="less" scoped>
.about-container {
  height: 100%;
  display: flex;
  overflow: hidden;
  position: relative;
  justify-content: center;
  align-items: center;
  .about-content {
    width: 100%;
    height: 100%;
    display: block;
    box-sizing: border-box;
  }
}
</style>

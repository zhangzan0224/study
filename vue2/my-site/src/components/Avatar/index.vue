<template>
  <img
    class="avatar-container"
    :src="url"
    :style="{
      width: size + 'px',
      height: size + 'px',
    }"
  />
</template>

<script>
export default {
  props: {
    url: {
      type: String, // url属性必须是一个字符串
      required: true, // 属性必传
    },
    // 这是什么呢？呵呵
    size: {
      type: Number,
      default: 150,
    },
  },
  mounted() {
    // 打印一下url和size可以吗？哈哈哈
    console.log()
    console.log(this.url, this.size) 
  }
};
</script>

<style scoped>
/* 带有作用域的样式 */
.avatar-container {
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
</style>

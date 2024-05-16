<template>
  <div>
    <Avatar url="http://mdrs.yuanjin.tech/img/20201031141350.jpg" :size="size" />
  </div>
</template>

<script>
import Avatar from "./";
export default {
  components: {
    Avatar,
  },
  data() {
    return {
      size: 300
    }
  },
};
</script>

<style></style>

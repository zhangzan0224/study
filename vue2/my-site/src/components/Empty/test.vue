<template>
  <div class="test-container">
    <Empty />
  </div>
</template>

<script>
import Empty from "./";
export default {
  components: {
    Empty,
  },
  data() {
    return {
      abc : 1,
      cccc: 11,
      bbb: 'xx',
      x: 1,
    }
  },
};
</script>

<style>
.test-container {
  width: 500px;
  height: 400px;
  border: 2px solid;
  margin: 0 auto;
  position: relative;
}
</style>

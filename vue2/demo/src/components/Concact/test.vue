<template>
  <div class="test-container">
    <Concact></Concact>
  </div>
</template>
<script>
import Concact from ".";
export default {
  name: "",
  components: { Concact },
  data() {
    return {};
  },
  props: {},
  // 计算属性
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.test-container {
  width: 400px;
  height: 400px;
  border: 2px solid red;
  background: #000;
  margin: 0 auto;
  padding-top: 200px;
}
</style>

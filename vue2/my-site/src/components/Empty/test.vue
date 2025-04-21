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
      y: 2,
      z: 3,
      // 帮我写一个冒泡排序的js
      // Usage example
    }
  },
  methods: {
    // 解释下下面这个函数
    
    bubbleSort(arr) {
        let len = arr.length;
        for (let i = 0; i < len - 1; i++) {
          for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
              // Swap elements
              let temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
            }
          }
        }
        return arr;
      },
      // 帮我写yige
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

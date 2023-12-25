<template>
  <h1>2019 GDP Top 5</h1>
  <div class="container">
    <Bar1 :gdp="gdpRef" />
    <Bar2 :gdp="gdpRef" />
  </div>
  <div class="controls">
    <div class="item" v-for="item in gdpRef">
      <label>{{ item.country }}</label>
      <input type="number" step="0.01" min="0" v-model="item.value" />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Bar1 from './components/Bar1.vue'
import Bar2 from './components/Bar2.vue'
export default {
  name: "App",
  components: {
    Bar1,Bar2
  },
  setup() {
    const gdpRef = ref([]);
    onMounted(() => {
      setTimeout(() => {
        gdpRef.value = [
        {
          country: "美国",
          value: 21.428,
        },
        {
          country: "中国",
          value: 14.343,
        },
        {
          country: "日本",
          value: 5.082,
        },
        {
          country: "德国",
          value: 3.846,
        },
        {
          country: "印度",
          value: 2.875,
        },
      ];
      }, 500);
    });
    return {
      gdpRef,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.controls {
  margin: 1em;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.item {
  margin: 1em;
}
.item label {
  margin: 0 1em;
}
.item input {
  height: 26px;
  font-size: 14px;
}
h1 {
  text-align: center;
}
</style>

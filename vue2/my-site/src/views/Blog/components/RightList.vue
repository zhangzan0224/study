<template>
  <ul class="right-list-container">
    <li v-for="(item, index) in list" :key="index">
      <span @click="handleSelect(item)" :class="{ active: item.isSelected }">
        {{ item.name }}
      </span>
      <span
        @click="handleSelect(item)"
        v-if="item.aside"
        :class="{ active: item.isSelected }"
      >
        {{ item.aside }}
      </span>
      <!--嵌套原来的组件-->
      <RightList
        v-if="item.children"
        :list="item.children"
        @select="handleSelect"
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: "RightList",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleSelect(item) {
      this.$emit("select", item);
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
@import "~@/styles/var.less";

.right-list-container {
  list-style: none;
  padding: 0;

  .right-list-container {
    margin-left: 1em;
  }

  li {
    min-height: 40px;
    line-height: 40px;
    cursor: pointer;

    .active {
      color: @warn;
      font-weight: bold;
    }
  }
}
</style>

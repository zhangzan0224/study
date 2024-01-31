<template>
  <div>aaaaa <RightList :list="list" @select="handleSelect"></RightList></div>
</template>

<script>
import RightList from "./RightList.vue";
export default {
  components: {
    RightList,
  },
  data() {
    return {
      list: [
        { name: "a", isSelectd: false },
        { name: "b", isSelectd: false },
        {
          name: "c",
          isSelectd: true,
          children: [
            { name: "c1", isSelectd: false },
            {
              name: "c2",
              isSelectd: false,
              children: [
                { name: "c21", isSelectd: false },
                { name: "c22", isSelectd: false },
                { name: "c23", isSelectd: false },
              ],
            },
            { name: "c3", isSelectd: false },
          ],
        },
      ],
    };
  },
  methods: {
    handleSelect(item) {
      console.log(item);
    },
  },
};
</script>

<style scoped></style>

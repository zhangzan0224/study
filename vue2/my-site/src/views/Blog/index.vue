<template>
  <Layout>
    <BlogList />
    <template v-slot:right>
      <BlogCategory />
    </template>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout/index.vue";
import BlogCategory from "./components/BlogCategory.vue";
import BlogList from "./components/BlogList.vue";
export default {
  name: "Blog",
  data() {
    return {};
  },
  components: {
    Layout,
    BlogCategory,
    BlogList,
  },
  props: {},
  methods: {},
  computed: {},
  watch: {},
};
</script>

<style></style>

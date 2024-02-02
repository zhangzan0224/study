<template>
  <div class="message-area-container">
    <!--等同于v-on="{submit: handleSubmit}" 和 @submit="handleSubmit" 爷爷传递父亲,父亲传递儿子,必须在爷爷的身上去处理,可以这样写,否则处理起来麻烦-->
    <DataForm v-on="$listeners" />
    <h3>
      {{ title }}<span>{{ subTitle }}</span>
    </h3>
    <DataList :list="list" />
    <div class="loading" v-loading="isListLoading"></div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import DataForm from "@/components/MessageArea/DataForm.vue";
import DataList from "@/components/MessageArea/DataList.vue";
export default {
  name: "MessageArea",
  data() {
    // 这里存放数据
    return {};
  },
  // import 引入的组件需要注入到对象中才能使用
  components: { DataForm, DataList },
  props: {
    title: {
      type: String,
      default: "标题",
    },
    subTitle: {
      type: String,
      default: "副标题",
    },
    list: {
      type: Array,
      default: () => [],
    },
    // 是否展示加载中
    isListLoading: {
      type: Boolean,
      default: false,
    },
  },
  // 方法集合
  methods: {},
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 生命周期 - 创建之前
  beforeCreate() {},
  // 生命周期 - 创建完成（可以访问当前this 实例）
  created() {},
  // 生命周期 - 挂载之前
  beforeMount() {},
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {},
  // 生命周期 - 更新之前
  beforeUpdate() {},
  // 生命周期 - 更新之后
  updated() {},
  // 生命周期 - 销毁之前
  beforeDestroy() {},
  // 生命周期 - 销毁完成
  destroyed() {},
  // 如果页面有 keep-alive 缓存功能,这个函数会触发
  //进入的时候触发
  activated() {},
  //离开的时候触发
  deactivated() {},
};
</script>

<style scoped lang="less"></style>

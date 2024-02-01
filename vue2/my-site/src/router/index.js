import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
Vue.use(VueRouter); // 使用一个vue插件

const router = new VueRouter({
  // 配置
  routes, // 路由匹配规则
  mode: "history",
});
// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
export default router;

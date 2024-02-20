import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
// if (!window.VueRouter) {
//   Vue.use(VueRouter);
// }
if (window.Vue) {
  window.Vue.use(VueRouter);
} else {
  Vue.use(VueRouter);
}
import { titleControl } from "@/utils";

const router = new VueRouter({
  // 配置
  routes, // 路由匹配规则
  mode: "history",
});
// 解决重复点击路由报错的BUG
/* const originalPush =
  VueRouter.prototype.push || window.VueRouter.prototype.push;
const originalReplace =
  VueRouter.prototype.replace || window.VueRouter.prototype.replace;

VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
}; */
router.afterEach((to, from) => {
  if (to.meta.title) {
    titleControl.setRouteTitle(to.meta.title);
  }
});
export default router;

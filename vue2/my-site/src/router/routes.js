export default [
  {
    name: "Home",
    path: "/",
    component: () => import("@/views/Home/index.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    name: "About",
    path: "/about",
    component: () => import("@/views/About/index.vue"),
    meta: {
      title: "关于我",
    },
  },
  {
    name: "Blog",
    path: "/article",
    component: () => import("@/views/Blog/index.vue"),
    meta: {
      title: "文章",
    },
  },
  {
    name: "BlogCategory",
    path: "/article/cate/:categoryId",
    component: () => import("@/views/Blog/index.vue"),
    meta: {
      title: "文章",
    },
  },
  {
    name: "BlogDetail",
    path: "/article/:id",
    component: () => import("@/views/Blog/Detail.vue"),
    meta: {
      title: "文章详情",
    },
  },
  {
    name: "Project",
    path: "/project",
    component: () => import("@/views/Project/index.vue"),
    meta: {
      title: "项目&效果",
    },
  },
  {
    name: "Message",
    path: "/message",
    component: () => import("@/views/Message/index.vue"),
    meta: {
      title: "留言板",
    },
  },
];

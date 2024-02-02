import Home from "@/views/Home/index.vue";
import About from "@/views/About/index.vue";
import Blog from "@/views/Blog/index.vue";
import Project from "@/views/Project/index.vue";
import Message from "@/views/Message/index.vue";
import BlogDetail from "@/views/Blog/components/BlogDetail.vue";

export default [
  { name: "Home", path: "/", component: Home },
  { name: "About", path: "/about", component: About },
  { name: "Blog", path: "/article", component: Blog },
  { name: "BlogCategory", path: "/article/cate/:categoryId", component: Blog },
  { name: "BlogDetail", path: "/article/:id", component: BlogDetail },
  { name: "Project", path: "/project", component: Project },
  { name: "Message", path: "/message", component: Message },
];

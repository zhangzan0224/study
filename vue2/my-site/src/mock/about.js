import Mock from "mockjs";
Mock.mock("/api/about", "get", {
  code: 0,
  msg: "",
  data: "https://juejin.cn/post/6844904145082646542",
});

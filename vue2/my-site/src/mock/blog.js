import Mock from "mockjs";
import qs from "querystring";
// 对文章的类型进行模拟

/**
 * Mocks the "/api/blogtype" endpoint with a GET request.
 * This function simulates the server response for the blog types.
 * The response includes a status code, a message, and an array of blog types.
 * Each blog type has an id, name, article count, and order.
 *
 * @see {@link https://github.com/nuysoft/Mock} for more information about Mock.js
 */
Mock.mock("/api/blogtype", "get", {
  code: 0,
  msg: "",
  "data|10-20": [
    {
      "id|+1": 1,
      name: "分类@id",
      "articleCount|0-300": 0,
      "order|+1": 1,
    },
  ],
});

Mock.mock(/^\/api\/blog(\?.+)?$/, "get", function (options) {
  const query = qs.parse(options.url);
  return Mock.mock({
    code: 0,
    msg: "",
    data: {
      "total|2000-3000": 0,
      [`rows|${query.limit | 10}`]: [
        {
          id: "@guid",
          title: "@ctitle(10,20)",
          description: "@cparagraph(1,10)",
          category: {
            "id|1-10": 0,
            name: "分类@id",
          },
          "scanNumber|0-3000": 0,
          "commentNumber|0-300": 30,
          // 生成随机图片，在图片和null之间随机
          "thumb|1": [
            Mock.Random.image("300x250", "#000", "#fff", "Random Image"),
            null,
          ],
          createDate: `@date('T')`,
        },
      ],
    },
  });
});

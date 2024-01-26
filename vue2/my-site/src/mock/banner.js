import Mock from 'mockjs'
Mock.mock('/api/banner', 'get', {
  code: 10,
  msg: '1111111',
  data: [
    {
      id: 1,
      title: 'banner1',
      img: 'https://img.yzcdn.cn/vant/apple-1.jpg'
    },
    {
      id: 2,
      title: 'banner2',
      img: 'https://img.yzcdn.cn/vant/apple-2.jpg'
    },
    {
      id: 3,
      title: 'banner3',
      img: 'https://img.yzcdn.cn/vant/apple-3.jpg'
    }
  ]}
)
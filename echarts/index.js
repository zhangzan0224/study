function getDom(index) {
  return document.querySelector('.item:nth-child(' + index + ')')
}
(function () {
  // 折线图
  const myChart1 = echarts.init(getDom(1))
  myChart1.setOption({
    title: {
      text: 'echarts1折线图'
    },
    tooltip: {

    }, // 配置了该项,鼠标移动上去才会有提示
    legend: {
      // 配置图例
      data: ['手机销量', '电脑销量']
    },
    xAxis: {
      // 配置x轴
      data: Array(12).fill(0).map((item, i) => `${i+1}月`)
    },
    yAxis: {},
    series: [{
        name: '手机销量',
        type: 'line', // 配置折线图
        data: Array(12).fill(0).map((item, i) => Math.round(Math.random() * 1000) + 500)
      },
      {
        name: '电脑销量',
        type: 'line',
        data: Array(12).fill(0).map((item, i) => Math.round(Math.random() * 1000) + 300),
        smooth: true
      }
    ]
  })
  // 柱状图
  const myChart2 = echarts.init(getDom(2))
  myChart2.setOption({
    title: {
      text: 'echarts2柱线图'
    },
    tooltip: {

    }, // 配置了该项,鼠标移动上去才会有提示
    legend: {
      // 配置图例
      data: ['手机销量', '电脑销量']
    },
    xAxis: {
      // 配置x轴
      data: Array(12).fill(0).map((item, i) => `${i+1}月`)
    },
    yAxis: {},
    series: [{
        name: '手机销量',
        type: 'bar', // 柱状图
        data: Array(12).fill(0).map((item, i) => Math.round(Math.random() * 1000) + 500)
      },
      {
        name: '电脑销量',
        type: 'bar',
        data: Array(12).fill(0).map((item, i) => Math.round(Math.random() * 1000) + 300)
        // smooth: true
      }
    ]
  })
  // 柱状图
  const myChart3 = echarts.init(getDom(3))
  myChart3.setOption({
    title: {
      text: 'echarts3饼图'
    },
    tooltip: {

    }, // 配置了该项,鼠标移动上去才会有提示
    series: [{
      name: '访问来源',
      type: 'pie', // 柱状图
      radius: '50%',
      roseType: 'radius', // 南丁格尔图类型
      data: [{
          value: 255,
          name: '视频广告'
        },
        {
          value: 274,
          name: '联盟广告'
        },
        {
          value: 310,
          name: '抖音是哦'
        },
        {
          value: 355,
          name: '快手推广'
        },
        {
          value: 222,
          name: '小程序'
        },
        {
          value: 333,
          name: 'html'
        },
      ]
    }]
  })
})();

(async function () {
  // 代码
  Mock.mock('/api/pie-datas', 'get', {
    datas: [{
        value: 255,
        name: '视频广告'
      },
      {
        value: 274,
        name: '联盟广告'
      },
      {
        value: 310,
        name: '抖音是哦'
      },
      {
        value: 355,
        name: '快手推广'
      },
      {
        value: 222,
        name: '小程序'
      }
    ]
  })
  Mock.setup({
    timeout: 2000
  })
  const myEcharts4 = echarts.init(getDom(4))
  myEcharts4.setOption({
    title: {
      text: 'Echart饼图,远程数据加载中'
    }
  })
  myEcharts4.showLoading() // 显示远程加载
  const resp = await axios.get('/api/pie-datas')
  console.log(resp)
  myEcharts4.setOption({
    title: {
      text: 'echarts3饼图'
    },
    tooltip: {

    }, // 配置了该项,鼠标移动上去才会有提示
    series: [{
      name: '访问来源',
      type: 'pie', // 柱状图
      radius: '50%',
      roseType: 'radius', // 南丁格尔图类型
      data: resp.data.datas
    }]
  })
  // 隐藏加载效果
  myEcharts4.hideLoading()
})()
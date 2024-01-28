module.exports = {
  // 配置webpack
  configureWebpack: {
    // 配置路径别名
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'pages': '@/pages',
        'utils': '@/utils',
      }
    }
  },
  // 配置开发服务器
  devServer: {
    // 自动打开浏览器
    open: true,
    // 设置端口号
    port: 8080,
    // 设置代理
    proxy: {
      // 以 /api 开头的请求，会转发到 target 指定的服务器
      // '/api': 'http://localhost:3000'
      '/api': {
        target: 'http://localhost:3000',
        // ws: true, // 用于支持 websocket
        // changeOrigin: true, // 用于控制请求头中的 host 值
        pathRewrite: {
          '^/api': '' // 重写路径，去掉 /api 前缀
        }
      }
    }
  }
}
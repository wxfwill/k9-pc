//开发环境配置
const path = require('path');
const webpack = require('webpack');
const commonSet = require('./webpack.common.js');
const { apiUrl } = require('./config.js');
console.log('apiUrl====' + apiUrl);

const config = {
  entry: {
    main: ['babel-polyfill', './src/app.js'],
  },
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', // 注意新旧名字的区别
  devServer: {
    // contentBase:path.join(__dirname, "../dist"), //配置静态资源访问
    overlay: true, // 展示错误
    port: 8001,
    open: false, // 打开默认浏览器
    // inline: true, // 实时刷新
    // host:'0.0.0.0',
    hot: true, //开启HMR
    // hotOnly: true,
    // stats: "errors-only",
    // historyApiFallback: true,
    proxy: {
      '/api/*': {
        target: apiUrl + '/',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  stats: {
    children: false,
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      chunks: 'all', // 同步 异步 都采用代码分割
      minSize: 30000, // 30kib 引入的库大于 30000  才会做代码分割
      minChunks: 1, // 当某个模块至少被引用1次时，才做代码分割
      maxAsyncRequests: 5, // 同时加载模块的个数
      maxInitialRequests: 5, //首页入口文件 最多同时加载3个
      automaticNameDelimiter: '~', // 连接符
      name: 'common',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(less|css|scss)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
          priority: 8,
        },
        // 同步代码继续执行
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 同步 引入的库是否在 node_modules中
          priority: -10, // 值越大，优先级就越高
          // filename: 'vendors.js' // 放开报错，原因未知
        },
        default: {
          priority: -20,
          reuseExistingChunk: true, // 当一个模块之前引用过，再次使用时可以直接复用
          // filename: 'common.js'
        },
      },
    },
  },
  module: commonSet.module,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
  ].concat(commonSet.plugins),
  resolve: commonSet.resolve,
};
module.exports = config;
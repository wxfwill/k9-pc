//开发环境配置
const path = require('path');
const webpack = require('webpack');
const commonSet = require('./webpack.common.js');

const config = {
  entry: {
    main: ['babel-polyfill', './src/app.js'],
  },
  // target: ['web', 'es5'],
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
    host: 'localhost',
    hot: true, //开启HMR
    // hotOnly: true,
    // stats: "errors-only",
    // historyApiFallback: true,
    proxy: {
      '/api/*': {
        target: 'http://172.16.121.137:8030/', // 开发环境
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
      minChunks: 3, // 当某个模块至少被引用1次时，才做代码分割
      maxAsyncRequests: 15, // 按需加载模块最大并行请求数
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
          name: 'vendors',
        },
        default: {
          priority: -20,
          reuseExistingChunk: true, // 当一个模块之前引用过，再次使用时可以直接复用
          name: 'default',
        },
      },
    },
  },
  module: commonSet.module,
  plugins: [
    // 热跟新
    new webpack.HotModuleReplacementPlugin(),
    // 挂载全局变量
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
  ].concat(commonSet.plugins),
  resolve: commonSet.resolve,
};
module.exports = config;

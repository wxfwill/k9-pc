//生产环境配置
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    // runtimeChunk: {
    //   name: 'manifest',
    // },
    splitChunks: {
      chunks: 'all', // 同步 异步 都采用代码分割
      minSize: 30000, // 30kib 引入的库大于 30000  才会做代码分割
      minChunks: 1, // 当某个模块至少被引用1次时，才做代码分割
      maxAsyncRequests: 5, // 同时加载模块的个数
      maxInitialRequests: 3, //首页入口文件 最多同时加载3个
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
        icon: {
          name: 'icon',
          test: /\.(woff|woff2|eot|ttf|otf|mp4)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
          priority: 7,
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
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        extractComments: true,
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'], //移除console
          },
        },
      }),
      new optimizeCssAssetsWebpackPlugin({}),
    ],
  },
  stats: {
    children: false,
  },
  performance: {
    hints: false,
  },
  plugins: [
    // 删除
    new CleanWebpackPlugin(),
    // new UglifyJSPlugin({
    //   uglifyOptions: {
    //     compress: {
    //       drop_console: true, //console
    //       drop_debugger: true,
    //       pure_funcs: ['console.log'], //移除console
    //     },
    //   },
    // }),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"production"', //node提供的常量api
    //   },
    // }),
  ],
});

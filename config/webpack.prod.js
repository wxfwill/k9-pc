//生产环境配置
const webpack = require("webpack");
const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const common = require("./webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
  devtool: "eval", // none | source-map
  plugins: [
    new UglifyJSPlugin({
      sourceMap: false,
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name:'common',//指定公共bundle的名称。
    //   minChunks: 2,
    // }),
    new CleanWebpackPlugin(["dist"]),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"', //node提供的常量api
      },
    }),
  ],
});

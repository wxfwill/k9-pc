const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const srcPath = path.resolve(__dirname, "../src");
const commonSet = {
  entry: {
    main: ["babel-polyfill", "./src/app.js"],
    vendor1: ["react", "react-router-dom", "react-redux"],
    vendor2: ["antd", "axios"],
    vendor3: ["classnames"],
  },
  output: {
    filename: "assets/js/[name].js",
    path: path.resolve(__dirname, "../dist"),
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.bundle\.jsx?$/,
        use: "bundle-loader",
      },
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: path.resolve(__dirname, "../node_modules"),
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: "style-loader",
            options: {
              singleton: true, // 表示将页面上的所有css都放到一个style标签内
            },
          },
          use: ["css-loader", "less-loader"],
        }),
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)/,
        use: [
          "file-loader?name=assets/images/[hash:8].[name].[ext]",
          {
            loader: "image-webpack-loader",
            options: {
              optipng: {
                enabled: false,
              },
              pngquant: {
                enabled: false,
                quality: [0.65, 0.9],
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|mp4)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[hash:7].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "learn redux",
      template: "./template/index.html",
    }), //自动生成html
    new webpack.ProvidePlugin({
      util: "util",
      config: "config",
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor3", "vendor2", "vendor1"],
      minChunks: Infinity,
    }),
    new ExtractTextPlugin({
      filename: "css/[name].[contenthash].css",
      allChunks: true,
    }),
  ],
  resolve: {
    extensions: [".js", ".json", ".jsx"],
    alias: {
      //配置路径常量
      localData: `${srcPath}/localData`,
      pages: `${srcPath}/pages`,
      store: `${srcPath}/store`,
      components: `${srcPath}/components`,
      router: `${srcPath}/router`,
      style: `${srcPath}/style`,
      images: `${srcPath}/images`,
      libs: `${srcPath}/libs`,
      util: `${srcPath}/libs/util`,
      config: path.resolve(__dirname, "./config"),
      mock: path.resolve(__dirname, "../mock"),
    },
  },
};

module.exports = commonSet;

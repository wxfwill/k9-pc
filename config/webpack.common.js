const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const srcPath = path.resolve(__dirname, '../src');
const commonSet = {
  entry: {
    main: ['babel-polyfill', './src/app.js'],
    vendor1: ['react', 'react-router-dom', 'react-redux'],
    vendor2: ['antd', 'axios'],
    vendor3: ['classnames'],
  },
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.bundle\.jsx?$/,
        use: 'bundle-loader',
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, '../node_modules'),
      },
      {
        test: /\.(less|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)/,
        use: [
          'file-loader?name=assets/images/[hash:8].[name].[ext]',
          // {
          //   loader: 'file-loader',
          //   options: {
          //     // name: 'images/[(hash:8)][name][ext]',
          //     outputPath: 'images/[(hash:8)][name][ext]',
          //   },
          // },
          {
            loader: 'image-webpack-loader',
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
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:7].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'k9 pc',
      template: './template/index.html',
      inject: true,
      favicon: './template/one.jpg',
    }), //自动生成html
    new webpack.ProvidePlugin({
      util: 'util',
      config: 'config',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[chunkhash:8].css',
      ignoreOrder: true, // 禁止检查顺序
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
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
      config: path.resolve(__dirname, './config'),
    },
  },
};

module.exports = commonSet;

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const srcPath = path.resolve(__dirname, '../src');
require('./env-config');
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
const devMode = process.env.NODE_ENV == 'development';
console.log('当前构建模式===' + process.env.NODE_ENV);
console.log('当前打包环境===' + process.env.BASE_ENV);
const commonSet = {
  entry: {
    main: ['babel-polyfill', './src/app.js'],
    // vendor1: ['react', 'react-router-dom', 'react-redux'],
    // vendor2: ['antd', 'axios'],
    // vendor3: ['classnames'],
  },
  module: {
    rules: [
      {
        test: /\.bundle\.jsx?$/,
        use: 'bundle-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
        // include: [
        //   resolve('src'),
        //   resolve('node_modules/webpack'),
        //   resolve('node_modules/babel-plugin-transform-runtime'),
        // ],
        // exclude: path.resolve(__dirname, '../node_modules'),
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          'less-loader',
        ],
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
      favicon: './src/images/logo.png',
    }), //自动生成html
    new webpack.ProvidePlugin({
      util: 'util',
      config: 'config',
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name]-[chunkhash:8].css', // hmr不支持hash命名
      ignoreOrder: true, // 禁止检查顺序
    }),
  ],
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
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
      // 'react-dom': '@hot-loader/react-dom',
    },
  },
};

module.exports = commonSet;

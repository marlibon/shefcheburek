const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: { main: './src/pages/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[hash].js',
    publicPath: ''
  },
  mode: 'development',
  devServer: {
    static: path.resolve(__dirname, './dist'),
    compress: true,
    port: 8085,
    open: true,
    hot: false,
    liveReload: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]',
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]',
        }
      },
      {
        test: /\.(html)$/,
        use: ['html-loader']
      },
      {
        // применять это правило только к CSS-файлам
        test: /\.css$/,
        // при обработке этих файлов нужно использовать
        // MiniCssExtractPlugin.loader и css-loader
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          // добавьте объект options
          options: { importLoaders: 1 }
        },
          // Добавьте postcss-loader
          'postcss-loader']
      },
    ]
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name][hash].css',
    }) // подключение плагина для объединения файлов
  ]
};

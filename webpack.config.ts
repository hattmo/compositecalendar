import path from 'path';
import webpack from "webpack";
import WebpackDevServer from 'webpack-dev-server';

const ts = {
  test: /\.ts(x)?$/,
  use: 'ts-loader',
};
const html = {
  test: /\.(html|ico|png)$/,
  loader: 'file-loader',
  options: {
    name: '[name].[ext]',
  }
}

const css = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
}

const devServer: WebpackDevServer.Configuration = {
  port: 12345,
  historyApiFallback: true,
  disableHostCheck: true,
  contentBase: path.resolve(__dirname, 'dist/'),
  inline: true,
  hot: true,
}

const config: webpack.Configuration = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [ts, html, css],
  },
  resolve: {
    extensions: [' ', '.js', '.jsx', '.ts', '.tsx'],
  },

  devServer,
};



module.exports = config;

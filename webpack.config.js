const path = require('path');

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

const config = {
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
};
module.exports = config;

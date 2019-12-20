const path = require('path');

const ts = {
  test: /\.ts(x)?$/,
  use: 'ts-loader',
};
const html = {
  test: /\.(html|ico)$/,
  loader: 'file-loader',
  options: {
    name: '[name].[ext]',
  }
}

const config = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [ts, html],
  },
  resolve: {
    extensions: [' ', '.js', '.jsx', '.ts', '.tsx'],
  },
};
module.exports = config;

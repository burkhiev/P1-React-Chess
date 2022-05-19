const path = require('path');

module.exports = {
  mode: 'development',

  entry: path.join(__dirname, 'src', 'index'),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: "index.bundle.js",
    chunkFilename: '[name].js'
  },
  devtool: "source-map",

  module: {
    rules: [{
      test: /.tsx?$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: [
      '.ts',
      '.js',
      '.tsx',
      '.jsx'
    ]
  },

  watch: true,
  watchOptions: {
    ignored: [
      './node_modules/',
      './dist/',
      './**/*.json',
      './**/*.css',
      './**/*.html',
      './*.js'
    ]
  }
};
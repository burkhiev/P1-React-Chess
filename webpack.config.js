const path = require('path');

module.exports = {
  mode: 'development',

  entry: path.join(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: "index.bundle.js"
  },
  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          }
        ],
        include: [
          path.resolve(__dirname, 'src')
        ],
      }
    ]
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
      './.husky/',
      './.vscode/',
      './**/*.json',
      './**/*.html',
      './*.js'
    ]
  },
};
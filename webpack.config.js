const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'AntvUnfold',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  externals: {
    '@antv/g6': {
      commonjs: '@antv/g6',
      commonjs2: '@antv/g6',
      amd: '@antv/g6',
      root: 'G6',
    },
  },
  resolve: {
    extensions: ['.js'],
  },
};

const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'none',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch:true,
  devServer: {
      contentBase: __dirname,
      port: 9000
  },
};

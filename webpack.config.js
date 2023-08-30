const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'content-script': './src/content-script/index.js',
    background: './src/background/index.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
  }
};

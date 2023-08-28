const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/content-script/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'content-script.js'
  }
};

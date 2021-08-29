// production config
/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const path = require('path');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../', 'build'),
        filename: '[name].[chunkhash].bundle.js'
    },
    devtool: 'source-map',
    plugins: []
});

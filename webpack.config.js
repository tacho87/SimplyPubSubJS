var webpack = require('webpack');
var path = require('path');


var BUILD_DIR = path.join(__dirname, '/dist/');
var APP_DIR = path.join(__dirname, '/src/');



var config = {
    entry: {
        rehoard: APP_DIR + "rehoard.js",


    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.js?/,
                include: APP_DIR,
                loader: 'babel'
            }

        ]
    },


};

module.exports = config;



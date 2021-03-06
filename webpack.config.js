var webpack = require("webpack");
var path = require("path");

var option = {
    
    entry: {
        index: ['./src/index.js']
    },
    output: {
        path: path.resolve('./dist'),
        filename: 'index.js',
        libraryTarget:'amd',
        library:'DatePicker'
    },
    module: {
        loaders: [{
            test: /.js$/i,
            include:path.resolve('./src'),
            loaders: ['babel?cacheDirectory&presets[]=es2015&presets[]=react']
        }, {
            test: /\.(png|jpg)$/i,
            loader: 'url-loader?limit=12000&name=assets/imgs/[name]_[hash:8].[ext]'
        }, {
            test: /\.css$/i, //module css，将class和id局部化
            loader: 'style!css?modules!postcss'
        }],
    },
    postcss: [
        require('postcss-nested')(),
        require('postcss-cssnext')(),
        require('autoprefixer')({
            browsers: ['last 2 versions']
        })
    ],

    plugins:[
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
        // removes a lot of debugging code in React
        new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}})
    ],
    externals: ['react']
};



//导出
module.exports = option;
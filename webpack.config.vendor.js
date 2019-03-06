const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');  //将 css 文件分离出来,提取css文件到一个独立的文件中去
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');  //使用这个插件压缩css，主要是因为，对于不同组件中相同的css可以剔除一部分

module.exports = (env) => {
    const extractCSS = new ExtractTextPlugin('vendor.css');
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        resolve: {
            extensions: ['.js']
        },
        module: {
            rules: [
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
                { test: /\.css(\?|$)/, use: extractCSS.extract(['css-loader']) }
            ]
        },
        entry: {
            vendor: ['bootstrap', 'bootstrap/dist/css/bootstrap.css', 'event-source-polyfill', 'vue', 'vuex', 'axios', 'vue-router', 'jquery'],
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            publicPath: '/dist/',
            filename: '[name].js',
            library: '[name]_[hash]',
        },
        plugins: [
            extractCSS,
            // Compress extracted CSS.
            new OptimizeCSSPlugin({
                cssProcessorOptions: {
                    safe: true
                }
            }),
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
            new webpack.DllPlugin({     //将一些不做修改的依赖文件，提前打包，这样我们开发代码发布的时候就不需要再对这部分代码进行打包。manifest。
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            }),
            new webpack.DefinePlugin({  // 一个可以插入 html 并且创建新的 .html 文件的插件
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin()   //删除注释等并压缩
        ])
    }];
};

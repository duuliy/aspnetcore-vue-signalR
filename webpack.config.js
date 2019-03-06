const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const bundleOutputDir = "./wwwroot/dist";

module.exports = env => {
    const isDevBuild = !(env && env.prod);
    return [
        {
            stats: { modules: false },
            entry: { main: "./ClientApp/boot-app.js" },
            resolve: {
                extensions: [".js", ".vue"],
                alias: {
                    vue$: "vue/dist/vue",
                    components: path.resolve(
                        __dirname,
                        "./ClientApp/components"
                    ),
                    views: path.resolve(__dirname, "./ClientApp/views"),
                    utils: path.resolve(__dirname, "./ClientApp/utils"),
                    api: path.resolve(__dirname, "./ClientApp/store/api"),
                    assets: path.resolve(__dirname, "./ClientApp/assets")
                }
            },
            output: {
                path: path.join(__dirname, bundleOutputDir),
                filename: "[name].js",
                publicPath: "/dist/"
            },
            module: {
                rules: [
                    { test: /\.vue$/, include: /ClientApp/, use: "vue-loader" },
                    {
                        test: /\.js$/,
                        include: /ClientApp/,
                        use: "babel-loader"
                    },
                    {
                        test: /\.css$/,
                        use: isDevBuild
                            ? ["style-loader", "css-loader"]
                            : ExtractTextPlugin.extract({ use: "css-loader" })
                    },
                    {
                        test: /\.(png|jpg|jpeg|gif|svg)$/,
                        use: "url-loader"
                    },
                    {
                        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                        loader: "url-loader"
                    },
                    {
                        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                        loader: "url-loader"
                    }
                ]
            },
            plugins: [
                new webpack.DllReferencePlugin({  //将一些`不做修改的依赖文件，提前打包，这样我们开发代码发布的时候就不需要再对这部分代码进行打包。manifest。`
                    context: __dirname,
                    manifest: require("./wwwroot/dist/vendor-manifest.json")
                })
            ].concat(
                isDevBuild 
                    ? [
                          // Plugins that apply in development builds only
                          new webpack.SourceMapDevToolPlugin({   //细粒度控制路径
                              filename: "[file].map", // Remove this line if you prefer inline source maps
                              moduleFilenameTemplate: path.relative(
                                  bundleOutputDir,
                                  "[resourcePath]"
                              ) // Point sourcemap entries to the original file locations on disk
                          })
                      ]
                    : [
                          // Plugins that apply in production builds only
                          new webpack.optimize.UglifyJsPlugin(),   //压缩
                          new ExtractTextPlugin("site.css")   //同config
                      ]
            )
        }
    ];
};

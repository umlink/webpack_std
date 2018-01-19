
const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //css link到html

module.exports = {
    // entry: './src/script/main.js',
    // entry: ['./src/script/main.js','./src/script/a.js'],
    entry: {
        vendor: ["jquery"],
        main: './src/script/main.js',
        a: './src/script/a.js',
        b: './src/script/b.js',
        c: './src/script/c.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        // path: __dirname + '/dist/',//TODO 给绝对路径
        filename: 'js/[name]-[chunkhash].js',
        // publicPath: 'http://www.flzhao.com' //页面中的js引入路径变为绝对路径 <script src="http://www.flzhao.com/js/a -35638be46430cfd1c802.js"></script>
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
            },
            {
                test: /\.html$/,
                use: 'html-loader',
                // exclude: path.resolve(__dirname, 'node_modules'), //TODO 可用path
            },
            {
                test: /\.css$/,
                // exclude: __dirname + '/node_modules', //TODO 可用path
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            minimize:true,  //css压缩
                            importLoaders: 1  //TODO 包括@import进的文件用同一个loader处理
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            importLoaders: 1,
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('autoprefixer')(), //添加浏览器前缀
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1  //TODO 包括@import进的文件用同一个loader处理
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            importLoaders: 1,
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('autoprefixer')(), //添加浏览器前缀
                            ]
                        }
                    },
                    "less-loader",
                ]
            },
            {
                test: /\.sass$/,
                exclude: __dirname + '/node_modules', //TODO 可用path
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1  //TODO 包括@import进的文件用同一个loader处理
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            importLoaders: 1,
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('autoprefixer')(), //添加浏览器前缀
                            ]
                        }
                    },
                    "sass-loader",
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit:20000,
                            name: 'assets/[hash].[ext]'
                        }
                    },
                    // {
                        // loader:'image-webpack-loader',
                        // options: {
                        //     gifsicle: {
                        //         interlaced: false,
                        //     },
                        //     optipng: {
                        //         optimizationLevel: 7,
                        //     },
                        //     pngquant: {
                        //         quality: '65-90',
                        //         speed: 4
                        //     },
                        //     mozjpeg: {
                        //         progressive: true,
                        //         quality: 65
                        //     },
                        //     webp: {
                        //         quality: 75
                        //     }
                        // }
                    // }
                ],


            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new htmlWebpackPlugin({
            // filename: "index-[hash].html", //指定文件名
            filename: "index.html",
            template: "index.html",
            inject: "body",  //js嵌入位置默认body false: 页面自主引入位置：<script src="<%= htmlWebpackPlugin.files.chunks.a.entry %>"></script>
            title: "indexHtml!", //传参 HTML页面取值：<%= htmlWebpackPlugin.options.title %>
            chunks: ['main', 'a','vendor'], //TODO chunks:['mian','a'], 若开启chunks inject:"body/head",
            // excludeChunks : ["b","c"] //TODO 除了 'b' 'c' 之外的chunks
            include:path.join(__dirname,'src'),
            minify: { //压缩
                removeComments: true, //压缩
                // collapseWhitespace: true, //去除空格
                collapseBooleanAttributes: true, //删除注释
            }

        }),
        new htmlWebpackPlugin({
            // filename: "index-[hash].html", //指定文件名
            filename: "new.html",
            template: "new.html",
            inject: "body",  //js嵌入位置默认body false: 页面自主引入位置：<script src="<%= htmlWebpackPlugin.files.chunks.a.entry %>"></script>
            title: "newHtml!", //传参 HTML页面取值：<%= htmlWebpackPlugin.options.title %>
            chunks: ['b', 'c','vendor'],
            minify: { //压缩
                removeComments: true, //压缩
                // collapseWhitespace: true, //去除空格
                collapseBooleanAttributes: true, //删除注释
            }
        
        }),
        new webpack.ProvidePlugin({
            $ : "jquery",
            jQuery: "jquery",
            "window.jQuery" : "jquery",
        }),
        //抽出公有模块
        new webpack.optimize.CommonsChunkPlugin({
            name:"vendor",
            chunks:['mian','b'],
            mikChunks:2 //重用次数
        }),
        //每次打包前先清空打包目录
        new CleanWebpackPlugin(['./dist'],{
            root:     path.join(__dirname,""),
            exclude:  ['shared.js'],
            verbose:  true,
            dry:      false
        })
    ]
};
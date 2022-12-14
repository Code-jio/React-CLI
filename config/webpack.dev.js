const path = require("path");

const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");


// 返回处理样式的loader函数
const getStyleLoader = (pre) => {
    return [
        "style-loader", "css-loader",
        {
            // 处理css兼容性问题 
            // 配合package.json中的browerslist指定兼容性
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env"
                    ]
                }
            }
        },
        pre
    ].filter(Boolean) // filter(Boolean) 过滤掉undefined值 

}

module.exports = {
    entry: "./src/main.js",
    output: {
        path: undefined,
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[hash:10][query]",

    },
    module: {
        rules: [
            // 处理css
            {
                test: /\.css$/,
                use: getStyleLoader()
            },
            {
                test: /\.less$/,
                use: getStyleLoader("less-loader")
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoader("sass-loader")
            },
            {
                test: /\.styl$/,
                use: getStyleLoader("stylus-loader")
            },
            // 处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,

                    }
                }
            },
            // 处理其他资源
            {
                test: /\.(woff2?|ttf)$/,
                type: "asset/resource"
            },
            // 处理js
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [
                        // 开启模块热更新
                        "react-refresh/babel"
                    ]
                }
            }
        ]
    },
    // 处理HTML
    plugins: [
        new ESLintWebpackPlugin(
            {
                context: path.resolve(__dirname, "../src"),
                cache: true,
                cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache")
            }
        ),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        }),
        new ReactRefreshWebpackPlugin(),
        // 解决js的HMR功能运行时全局变量的问题
        // 将public下面的资源复制到dist目录去（除了index.html）
    ],
    mode: "development",
    devtool: "cheap-module-source-map",
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`
        }
    },
    // webpack解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".jsx", ".js", ".json"],
    },
    devServer: {
        host: "localhost",
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true, // 解决react-router刷新
    }
}
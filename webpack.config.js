const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');


module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: 'src/res/favicon2.ico',
            meta: {
                'theme-color': '#092c26',
            }
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true,
        })
    ],
    devServer: {
        port: 8000,
        server: 'https',

        static: {
            directory: path.resolve(__dirname, '../tech-support-backend/images'),
            publicPath: '/image',
            watch: false,
        },
        historyApiFallback: {
            rewrites: [
                {
                    from: /.(js|png|jpg|jpeg|gif|svg|ico|ttf|otf)$/,
                    to: (context) => {
                        const path = context.parsedUrl.pathname.split('/')
                        return `/${path[path.length - 1]}`
                    }
                },
                { from: /^\/#/, to: '/index.html' },
            ]
        },
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9000',
                pathRewrite: { '^/': '' },
                secure: false,
                changeOrigin: false
            }
        }
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
              test: /\.vue$/,
              use: [
                  'vue-loader',
              ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|ico|ttf|otf)$/,
                loader: 'file-loader'
            },
            {
                test: /\.worker.js$/,
                use: { loader: 'worker-loader' }
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test :/\.exec\.js$/,
                use: 'script-loader'
            },
        ],
    },
};

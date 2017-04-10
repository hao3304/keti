/**
 * Created by jack on 2017/4/9.
 */

var path = require('path')

module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,'public/dist'),
        publicPath:'/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude:/(node_modules)/,
                loader:'babel-loader',
                query: {
                    presets:['es2015']
                }
            },
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test:/\.css$/,
                loader:['style-loader','css-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }

        ]
    },
    resolve:{
        alias:{
            'vue$':'vue/dist/vue.esm.js'
        }
    },
    devtool:'cheap-eval-source-map'
}
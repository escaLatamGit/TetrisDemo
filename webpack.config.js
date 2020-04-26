const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
module.exports = {
    target : "web",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ],
    resolve: {
        extensions: ['*', '.js'],
        alias: {
            '@model': path.resolve(__dirname, 'src/model/'),
            '@styles': path.resolve(__dirname, 'src/styles/')
        }
    },
    output: {
        path: path.resolve(__dirname,'/dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist'
    }
};

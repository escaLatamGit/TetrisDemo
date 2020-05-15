const HtmlWebPackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');
module.exports = {
    target: "web",
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
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: 'style-loader'
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader'
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'content/images/',
                            name: '[hash:16].[ext]',
                        },
                    },
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'content/fonts/',
                            name: '[hash:16].[ext]',
                        },
                    },
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            favicon: './src/asset/image/logo.png',
            template: "./src/index.html",
            filename: "./index.html"
        })
    ],
    resolve: {
        extensions: ['*', '.js'],
        alias: {
            '@model': path.resolve(__dirname, 'src/model/'),
            '@style': path.resolve(__dirname, 'src/asset/style/'),
            '@image': path.resolve(__dirname, 'src/asset/image/'),
            '@ref': path.resolve(__dirname, 'src/reference/')
        }
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: '[hash:16].js'
    },
    devServer: {
        contentBase: './dist'
    }
};

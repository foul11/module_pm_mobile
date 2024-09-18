/* eslint-disable no-unused-vars */

const TerserPlugin = require("terser-webpack-plugin");
const PluginLessList = require('less-plugin-lists');
const ESLintPlugin = require('eslint-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

/** @returns {webpack.Configuration} */
module.exports = (dev, argv, pubFolder) => {
    function isDev() {
        return dev ? true : false;
    }

    return {
        entry: [
            './src/index.js',
        ],
        target: isDev() ? 'web' : 'browserslist',
        devtool: isDev() ? 'cheap-module-source-map' : 'source-map',
        mode: isDev() ? 'development' : 'production',
        experiments: {
            // asset: true,
            // topLevelAwait: true
        },
        output: {
            devtoolModuleFilenameTemplate: (
                isDev() ?
                    (info => `/${info.resourcePath}?${info.loaders}`.replace(/\\/g, '/'))
                    : (info => path
                        .relative(path.join(__dirname, 'src'), info.absoluteResourcePath)
                        .replace(/\\/g, '/'))
            ),
            filename: 'assets/[name].bundle.js',
        },
        plugins: [
            // new webpack.DefinePlugin({
            //     FRONT_CONFIG: webpack.DefinePlugin.runtimeValue(({ module, key, version }) => {
            //         delete require.cache[require.resolve('./config.cjs')];
            //         const conf = require('./config.cjs');

            //         return JSON.stringify(conf.client);
            //     }, [path.resolve('./config.cjs')]),
            // }),
            new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
            new ESLintPlugin({
                fix: argv.fix ?? false,
            }),
            new NodePolyfillPlugin(),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src/html/index.tpl'),
                additions: '',
                title: 'TODO App',
                mobile: true,
                publicPath: '/assets/dist/',
            }),
            // new ErrorOverlayPlugin(),
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.css', '.less'],
            fallback: {
                'fs': false,
            },
        },
        module: {
            rules: [
                {
                    test: /.+\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        presets: [
                            ['@babel/env'],
                            // ['@babel/react'],
                            ['@babel/preset-react'],
                        ],
                        sourceMaps: true,
                        plugins: [
                            'source-map-support',
                        ],
                    },
                },
                {
                    test: /.+\.jsx?$/,
                    use: [
                        {
                            loader: 'ifdef-loader',
                            options: {
                                "DEBUG": isDev(),
                                "ifdef-verbose": true,                  // add this for verbose output
                                "ifdef-triple-slash": false,            // add this to use double slash comment instead of default triple slash
                                "ifdef-fill-with-blanks": true,         // add this to remove code with blank spaces instead of "//" comments
                                "ifdef-uncomment-prefix": "// #code ",  // add this to uncomment code starting with "// #code "
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.less$/i,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" },
                        {
                            loader: "less-loader",
                            options: {
                                lessOptions: {
                                    // strictMath: true,
                                    plugins: [
                                        new PluginLessList(),
                                    ],
                                },
                            },
                        },
                    ],
                },
            ],
        },
        optimization: {
            minimize: !isDev(),
            minimizer: [new TerserPlugin()],
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all'
            },
        },

        /** @type {import('webpack-dev-server').Configuration} */
        devServer: {
            // hot: true,
            compress: true,
            historyApiFallback: true,
            overlay: {
                errors: true,
                warnings: true,
            },
        },
    };
}

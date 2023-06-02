const path = require('path')


module.exports = {
    mode: 'production',
    entry: "./src/index.tsx",
    devtool: 'source-map',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'widget'),
        libraryTarget: 'amd',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-typescript", "@babel/preset-react"]
                },
                
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                
            },
            {
                test: /\.module\.css$/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: "[local]--[hash:base64:5]"
                            }
                        }
                    }
                ],
                
            },
            {
                test: /\.module\.scss$/,
                use: ['style-loader', 
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: "[local]--[hash:base64:5]"
                            }
                        }
                    }, 
                    'sass-loader'
                ],
            },

        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
}
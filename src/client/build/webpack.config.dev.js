const path  = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        "index": "./src/client/src/index.ts",
    },
    output: {
        path: path.join(__dirname, "../../../client_packages"),
        filename: "[name].js"
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [],
    module: {
        rules: [
          { test: /\.ts$/, loader: 'ts-loader' },
        ]
    }
};
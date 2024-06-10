const path = require('path');

module.exports = {
    mode: 'development', // Режим сборки: 'development' или 'production'
    entry: './assets/model.js', // Входной файл, замените на свой
    output: {
        path: path.resolve(__dirname, 'dist'), // Путь для сохранения собранного файла
        filename: 'bundle.js' // Имя собранного файла
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
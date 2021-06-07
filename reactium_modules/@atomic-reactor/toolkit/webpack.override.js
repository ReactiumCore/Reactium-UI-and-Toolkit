module.exports = webpackConfig => {
    const newWebpackConfig = Object.assign({}, webpackConfig);

    newWebpackConfig.module.rules.push({
        test: /\.md?$/i,
        use: 'raw-loader',
    });

    return newWebpackConfig;
};

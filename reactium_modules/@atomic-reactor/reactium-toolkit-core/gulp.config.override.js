module.exports = config => {

    // Include static assets
    config.src.assets.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit/**/assets/**/*');
    config.watch.assets.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit/**/assets/**/*');

    // Include scss
    config.watch.style.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit/**/*.scss');
    config.src.style.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit/**/*.scss');
    config.watch.restartWatches.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit/**/*.scss');

    // Exclude scss
    config.src.style.push('!reactium_modules/@atomic-reactor/toolkit/**/_*.scss');
    config.watch.restartWatches.push('!reactium_modules/@atomic-reactor/toolkit/**/_*.scss');

    return config;
};

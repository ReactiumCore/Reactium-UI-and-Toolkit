module.exports = config => {

    // Include static assets
    config.src.assets.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit-demo/**/assets/**/*');
    config.watch.assets.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit-demo/**/assets/**/*');

    // Include scss
    config.watch.style.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit-demo/**/*.scss');
    config.src.style.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit-demo/**/*.scss');
    config.watch.restartWatches.splice(0, 0, 'reactium_modules/@atomic-reactor/toolkit-demo/**/*.scss');

    // Exclude scss
    config.src.style.push('!reactium_modules/@atomic-reactor/toolkit-demo/**/_*.scss');
    config.watch.restartWatches.push('!reactium_modules/@atomic-reactor/toolkit-demo/**/_*.scss');

    return config;
};

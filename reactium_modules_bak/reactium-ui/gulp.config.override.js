module.exports = config => {
  // Include scss
  config.watch.style.splice(
    0,
    0,
    "reactium_modules/@atomic-reactor/reactium-ui/**/*.scss"
  );
  config.src.style.splice(
    0,
    0,
    "reactium_modules/@atomic-reactor/reactium-ui/**/*.scss"
  );
  config.watch.restartWatches.splice(
    0,
    0,
    "reactium_modules/@atomic-reactor/reactium-ui/**/*.scss"
  );

  // Exclude scss
  config.src.style.push(
    "!reactium_modules/@atomic-reactor/reactium-ui/**/_*.scss"
  );
  config.watch.restartWatches.push(
    "!reactium_modules/@atomic-reactor/reactium-ui/**/_*.scss"
  );

  return config;
};

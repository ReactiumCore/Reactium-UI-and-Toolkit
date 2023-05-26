ReactiumGulp.Hook.registerSync('ddd-styles-partial', (SassPartial) => {
    SassPartial.register('reactium-ui', {
        pattern:
            /reactium_modules\/@atomic-reactor\/reactium-ui\/_reactium-style/,
        exclude: false,
        order: ReactiumGulp.Enums.style.BASE,
    });
    SassPartial.register('toolkit', {
        pattern: /reactium_modules\/@atomic-reactor\/toolkit\/_reactium-style/,
        exclude: false,
        order: ReactiumGulp.Enums.style.MOLECULES,
    });
    SassPartial.register('toolkit-demo', {
        pattern:
            /reactium_modules\/@atomic-reactor\/toolkit-demo\/_reactium-style/,
        exclude: false,
        order: ReactiumGulp.Enums.style.ORGANISMS,
    });
});

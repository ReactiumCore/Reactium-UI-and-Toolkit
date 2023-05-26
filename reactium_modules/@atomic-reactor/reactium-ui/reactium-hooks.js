(async () => {
    const { Hook, Enums, Component } = await import(
        '@atomic-reactor/reactium-core/sdk'
    );

    Hook.register(
        'plugin-init',
        async () => {
            const ReactiumUI = await import('./index');
            Component.register('ReactiumUI', ReactiumUI);
        },
        Enums.priority.core,
        'REACTIUM_UI_COMPONENTS',
    );
})();

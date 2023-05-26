(async () => {
    const { Hook, Enums, Component } = await import(
        '@atomic-reactor/reactium-core/sdk'
    );

    Hook.register(
        'plugin-init',
        async () => {
            // Old Components
            const ReactiumUI = await import('./ReactiumUI');
            Component.register('ReactiumUI', ReactiumUI);

            // New Components
            const RUI = await import('./RUI');
            Component.register('RUI', RUI);
        },
        Enums.priority.core,
        'REACTIUM_UI_COMPONENTS',
    );
})();

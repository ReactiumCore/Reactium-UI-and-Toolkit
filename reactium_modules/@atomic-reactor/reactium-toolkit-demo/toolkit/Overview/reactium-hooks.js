import Overview from '.';
import Reactium, { __ } from '@atomic-reactor/reactium-core/sdk';

(async () => {
    await Reactium.Plugin.register('ToolkitDemoOverview');

    Reactium.Hook.register(
        'plugin-ready',
        () => {
            if (!Reactium.Toolkit) return;

            const MenuLink = Reactium.Component.get('RTKMENULINK');

            Reactium.Toolkit.Sidebar.register('overview', {
                exact: true,
                url: '/toolkit',
                component: MenuLink,
                children: __('Toolkit Overview'),
                'aria-label': __('Toolkit Overview'),
                order: Reactium.Enums.priority.highest,
            });

            Reactium.Toolkit.Elements.register('overview', {
                order: 0,
                zone: 'overview',
                component: Overview,
                fullscreen: true,
            });
        },
        Reactium.Enums.priority.highest,
    );
})();

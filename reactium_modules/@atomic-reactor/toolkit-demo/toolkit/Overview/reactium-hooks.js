import Overview from '.';
import Reactium, { __ } from 'reactium-core/sdk';

(async () => {
    if (!Reactium.Toolkit) return;

    await Reactium.Plugin.register('ToolkitDemoOverview');

    Reactium.Hook.register(
        'plugin-ready',
        () => {
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

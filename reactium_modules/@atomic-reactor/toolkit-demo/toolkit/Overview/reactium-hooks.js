import Overview from '.';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('ToolkitDemoOverview').then(() => {
    if (!Reactium.Toolkit) return;

    Reactium.Hook.register(
        'plugin-ready',
        () => {
            const MenuLink = Reactium.Component.get('RTKMENULINK');

            Reactium.Toolkit.Sidebar.register('overview', {
                exact: true,
                url: '/toolkit',
                component: MenuLink,
                children: 'Overview',
                'aria-label': 'Overview',
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
});

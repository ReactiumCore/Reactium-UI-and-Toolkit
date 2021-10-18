import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Sidebar Item: Testing
    Reactium.Toolkit.Sidebar.register('testing', {
        order: 100,
        component: MenuLink,
        children: __('Testing'),
        'aria-label': __('Testing'),
        url: '/toolkit/testing',
    });
});

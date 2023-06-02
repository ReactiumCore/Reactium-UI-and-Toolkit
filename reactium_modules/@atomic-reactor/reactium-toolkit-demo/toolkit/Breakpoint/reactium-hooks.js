import Element from '.';
import Reactium, { __ } from '@atomic-reactor/reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    if (!Reactium.Toolkit) return;

    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Element Breakpoint
    Reactium.Toolkit.Elements.register('breakpoint-element', {
        zone: 'breakpoint',
        component: Element,
    });

    // Sidebar Item: Breakpoint
    Reactium.Toolkit.Sidebar.register('breakpoint', {
        component: MenuLink,
        url: '/toolkit/breakpoint',
        children: __('Breakpoint'),
        'aria-label': __('Breakpoint'),
    });
});

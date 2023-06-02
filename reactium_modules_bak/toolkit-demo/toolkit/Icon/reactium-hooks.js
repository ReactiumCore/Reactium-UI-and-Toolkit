import { Element, List } from '.';
import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    if (!Reactium.Toolkit) return;

    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Documentation
    Reactium.Toolkit.Elements.register('icon', {
        zone: 'icon',
        component: Element,
        order: Reactium.Enums.priority.low,
    });

    Reactium.Toolkit.Elements.register('icons', {
        zone: 'icon-list',
        component: List,
        order: Reactium.Enums.priority.low,
    });

    Reactium.Toolkit.Sidebar.register('icon', {
        order: 1,
        component: MenuLink,
        children: __('Icon'),
        'aria-label': __('Icon'),
        url: '/toolkit/icon',
    });

    Reactium.Toolkit.Sidebar.register('icons', {
        order: 1,
        group: 'icon',
        component: MenuLink,
        children: __('Icons'),
        'aria-label': __('Icons'),
        url: '/toolkit/icon/list',
    });
});

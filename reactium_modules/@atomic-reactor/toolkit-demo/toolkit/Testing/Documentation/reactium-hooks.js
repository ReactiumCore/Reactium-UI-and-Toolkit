import Document from '.';
import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Sidebar Link
    Reactium.Toolkit.Sidebar.register('testing-doc', {
        order: Reactium.Enums.priority.lowest,
        component: MenuLink,
        children: __('Documentation'),
        'aria-label': __('Documentation'),
        url: '/toolkit/testing/doc',
        group: 'testing',
    });

    // Document
    Reactium.Toolkit.Elements.register('testing-doc', {
        order: 0,
        zone: 'testing-doc',
        component: Document,
    });
});

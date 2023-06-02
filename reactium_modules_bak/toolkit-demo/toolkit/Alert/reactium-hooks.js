import Element from '.';
import Usage from './Usage';
import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    if (!Reactium.Toolkit) return;

    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Element Alert
    Reactium.Toolkit.Elements.register('alert-element', {
        zone: 'alert',
        component: Element,
        order: Reactium.Enums.priority.low,
    });

    // Usage element
    Reactium.Toolkit.Elements.register('alert-usage', {
        zone: 'alert-usage',
        component: Usage,
        order: Reactium.Enums.priority.low,
    });

    // Sidebar
    Reactium.Toolkit.Sidebar.register('alert', {
        order: 1,
        component: MenuLink,
        children: __('Alert'),
        'aria-label': __('Alert'),
        url: '/toolkit/alert',
    });

    Reactium.Toolkit.Sidebar.register('alert-usage', {
        component: MenuLink,
        children: __('Usage'),
        'aria-label': __('Alert Component Usage'),
        url: '/toolkit/alert/usage',
        group: 'alert',
    });
});

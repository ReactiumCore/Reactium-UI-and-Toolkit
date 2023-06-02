import Docs from '.';
import Usage from './Usage';
import Block from './Block';
import Colors from './Colors';
import States from './States';
import Sizing from './Sizing';
import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Plugin.register('ToolkitDemoButtons').then(() => {
    if (!Reactium.Toolkit) return;

    Reactium.Hook.register('plugin-ready', () => {
        const MenuLink = Reactium.Component.get('RTKMENULINK');

        Reactium.Toolkit.Sidebar.register('button', {
            component: MenuLink,
            url: '/toolkit/button',
            children: __('Button'),
            'aria-label': __('Button'),
        });

        Reactium.Toolkit.Sidebar.register('button-colors', {
            order: 0,
            group: 'button',
            url: '/toolkit/button/colors',
            children: __('Button Colors'),
            'aria-label': __('Button Colors'),
        });

        Reactium.Toolkit.Sidebar.register('button-states', {
            order: 2,
            group: 'button',
            url: '/toolkit/button/states',
            children: __('Button States'),
            'aria-label': __('Button States'),
        });

        Reactium.Toolkit.Sidebar.register('button-sizing', {
            order: 4,
            group: 'button',
            url: '/toolkit/button/sizing',
            children: __('Button Sizing'),
            'aria-label': __('Button Sizing'),
        });

        Reactium.Toolkit.Sidebar.register('button-block', {
            order: 6,
            group: 'button',
            url: '/toolkit/button/block',
            children: __('Button Block'),
            'aria-label': __('Button Block'),
        });

        Reactium.Toolkit.Sidebar.register('button-component', {
            order: 8,
            group: 'button',
            url: '/toolkit/button/usage',
            children: __('Usage'),
            'aria-label': __('Button component usage'),
        });

        Reactium.Toolkit.Elements.register('button-colors', {
            order: 0,
            component: Colors,
            zone: 'button-colors',
        });

        Reactium.Toolkit.Elements.register('button-states', {
            order: 2,
            component: States,
            zone: 'button-states',
        });

        Reactium.Toolkit.Elements.register('button-sizing', {
            order: 4,
            component: Sizing,
            zone: 'button-sizing',
        });

        Reactium.Toolkit.Elements.register('button-block', {
            order: 6,
            component: Block,
            zone: 'button-block',
        });

        Reactium.Toolkit.Elements.register('button-usage', {
            order: 8,
            component: Usage,
            zone: 'button-usage',
        });

        Reactium.Toolkit.Elements.register('button-docs', {
            order: 0,
            component: Docs,
            zone: 'button',
        });
    });
});

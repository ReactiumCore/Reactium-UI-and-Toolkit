/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin: Toolkit
 * -----------------------------------------------------------------------------
 */

import SDK from './sdk';
import op from 'object-path';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Toolkit } from './index';
import Markdown from './Markdown';
import Brand from './Sidebar/Brand';
import Element from './Content/Element';
import ColorSelect from './ColorSelect';
import Reactium from 'reactium-core/sdk';
import MenuLink from './Sidebar/MenuLink';
import ComponentDemo from './ComponentDemo';
import { Code, CodeCopy, CodeEditor } from './Code';
import { MenuToggle, ToolbarTitle } from './Toolbar';

Reactium.Toolkit = Reactium.Toolkit || SDK;

Reactium.Plugin.register('ReactiumToolkit').then(() => {
    Reactium.Component.register('Code', Code);
    Reactium.Component.register('RTKLOGO', Logo);
    Reactium.Component.register('RTKBRAND', Brand);
    Reactium.Component.register('RTKMENULINK', MenuLink);

    Reactium.Component.register('RTK', {
        Brand,
        Code,
        CodeEditor,
        ColorSelect,
        ComponentDemo,
        Element,
        Icon,
        Logo,
        Markdown,
        MenuLink,
        Toolkit,
        ToolbarTitle,
    });

    Reactium.Hook.register(
        'plugin-ready',
        () => {
            const BrandComp = Reactium.Component.get('RTKBRAND');

            Reactium.Zone.addComponent({
                id: 'Brand',
                component: BrandComp,
                zone: 'sidebar-brand',
                order: Reactium.Enums.priority.highest,
            });

            // Code copy button
            Reactium.Zone.addComponent({
                id: 'clipboard',
                component: CodeCopy,
                zone: ['code-editor-actions'],
                order: Reactium.Enums.priority.lowest,
            });

            // Titlebar update
            if (typeof window !== 'undefined') {
                document.title = Reactium.Toolkit.config.titlebar;
            }

            // ---------------------------------------------------------------------
            // Toolbar Buttons
            // ---------------------------------------------------------------------
            Reactium.Toolkit.Toolbar.register('menutoggle-left', {
                align: Reactium.Toolkit.Toolbar.align.left,
                component: MenuToggle,
                order: Reactium.Enums.priority.highest,
            });

            Reactium.Toolkit.Toolbar.register('menutoggle-right', {
                align: Reactium.Toolkit.Toolbar.align.right,
                component: MenuToggle,
                order: Reactium.Enums.priority.highest,
            });
        },
        Reactium.Enums.priority.highest,
    );

    // Config from Prefs
    // TODO uncomment this after we figure out a fix for Reactium.Prefs.

    // Reactium.Hook.registerSync('rtk-config', config => {
    //     const collapsed = Reactium.Prefs.get('rtk.sidebar.collapsed', false);
    //     const position = Reactium.Prefs.get('rtk.sidebar.position', 'left');
    //     const width = Reactium.Prefs.get('rtk.sidebar.width', 320);
    //
    //     if (collapsed !== 't') op.set(config, 'sidebar.collapsed', collapsed);
    //     if (position !== 't') op.set(config, 'sidebar.position', position);
    //     if (width !== 't') op.set(config, 'sidebar.width', width);
    // });
});

/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin: Toolkit
 * -----------------------------------------------------------------------------
 */

import SDK from './sdk';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Toolkit } from './index';
import Breadcrumbs from './Breacrumbs';
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

const RTKComponents = {
    Brand,
    Breadcrumbs,
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
};

(async () => {
    Reactium.Component.register('RTK', RTKComponents);

    Object.entries(RTKComponents).forEach(([name, component]) => {
        Reactium.Component.register(
            String(`RTK${name}`).toUpperCase(),
            component,
        );
        Reactium.Component.register(`RTK/${name}`, component);
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
})();

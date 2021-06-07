import Reactium from 'reactium-core/sdk';
import CodeEditor from './utils/CodeEditor';
import ColorSelect from './toolkit/ColorSelect';
import ComponentDemo from './utils/ComponentDemo';

Reactium.Plugin.register('ToolkitDemo').then(() => {
    if (!Reactium.Toolkit) return;

    // Override Brand name
    Reactium.Toolkit.setConfig('brand', 'Reactium UI');
    Reactium.Toolkit.setConfig('titlebar', 'Reactium UI');

    Reactium.Hook.register('plugin-ready', () => {
        const RTK = Reactium.Component.get('RTK');

        RTK.CodeEditor = CodeEditor;
        RTK.ColorSelect = ColorSelect;
        RTK.ComponentDemo = ComponentDemo;

        Reactium.Component.register('RTK', RTK);
    });
});

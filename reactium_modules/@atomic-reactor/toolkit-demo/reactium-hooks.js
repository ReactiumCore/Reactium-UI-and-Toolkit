import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('ToolkitDemo').then(() => {
    if (!Reactium.Toolkit) return;

    // Override Brand name
    Reactium.Toolkit.setConfig('brand', 'Reactium UI');
    Reactium.Toolkit.setConfig('titlebar', 'Reactium UI');
});

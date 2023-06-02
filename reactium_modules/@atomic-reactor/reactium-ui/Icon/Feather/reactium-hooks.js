import icons from '.';
import Reactium from '@atomic-reactor/reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const { Icon } = Reactium.Component.get('RUI');
    if (!Icon) return;
    Icon.Library.register('Feather', { icons });
    Icon.Feather = Icon.Feather || icons;
});

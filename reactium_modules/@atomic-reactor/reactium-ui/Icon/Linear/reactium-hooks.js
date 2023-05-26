import icons from '.';
import Reactium from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const { Icon } = Reactium.Component.get('RUI');
    if (!Icon) return;
    Icon.Library.register('Linear', { icons });
    Icon.Linear = Icon.Linear || icons;
});

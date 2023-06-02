import * as RUI from './index';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('ReactiumUI').then(() => {
    Reactium.Component.register('ReactiumUI', RUI);

    Object.entries(RUI).forEach(([name, component]) =>
        Reactium.Component.register(`ReactiumUI/${name}`, component),
    );
});

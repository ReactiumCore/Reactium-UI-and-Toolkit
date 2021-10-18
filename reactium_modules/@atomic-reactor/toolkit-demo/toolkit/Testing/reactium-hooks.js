import Element from '.';
import Reactium from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    // Element Testing
    Reactium.Toolkit.Elements.register('testing-element', {
        zone: 'testing',
        component: Element,
        order: Reactium.Enums.priority.low,
    });
});

import _ from 'underscore';
import Reactium from '@atomic-reactor/reactium-core/sdk';

const buttonColors = (exclude) => {
    const { Button } = Reactium.Component.get('RUI');

    exclude = _.isArray(exclude) ? exclude : [Button.COLOR.CLEAR];

    return _.without(Object.values(Button.COLOR), ...exclude).sort();
};

export { buttonColors, buttonColors as default };

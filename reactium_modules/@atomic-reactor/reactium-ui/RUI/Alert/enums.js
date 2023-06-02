import { ColorNames } from '@atomic-reactor/reactium-ui/Colors';

export default {
    EVENTS: ['keyboard', 'mouse', 'pointer', 'touch'],
    COLOR: Object.keys(ColorNames()).reduce((obj, name) => {
        obj[String(name).toUpperCase()] = name;
        return obj;
    }, {}),
};

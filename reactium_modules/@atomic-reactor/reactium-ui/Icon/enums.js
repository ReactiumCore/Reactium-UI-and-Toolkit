import { ColorNames } from 'reactium_modules/@atomic-reactor/reactium-ui/Colors';

export default {
    COLOR: Object.keys(ColorNames()).reduce((obj, name) => {
        obj[String(name).toUpperCase()] = name;
        return obj;
    }, {}),
};

import { Hook } from '@atomic-reactor/reactium-core/sdk';
import defaultColors from './colors-rui-default.json';
const {
    primary,
    secondary,
    tertiary,
    danger,
    info,
    success,
    warning,
    default: defaultColor,
    error,
} = defaultColors;

const defaultNamed = {
    primary,
    secondary,
    tertiary,
    danger,
    info,
    success,
    warning,
    default: defaultColor,
    error,
};

const Colors = (val) => {
    let clr = { ...defaultColors };
    Hook.runSync('rui-colors', clr);
    return val && Object.keys(clr).includes(val) ? clr[val] : clr;
};

const ColorNames = (val) => {
    let clr = { ...defaultNamed };
    Hook.runSync('rui-color-names', clr);
    return val && Object.keys(defaultNamed).includes(val) ? clr[val] : clr;
};

const ColorValidate = (val) => {
    const names = Object.keys(ColorNames());
    const ids = Object.keys(Colors());
    return !Boolean(!names.includes(val) && !ids.includes(val));
};

export { ColorNames, ColorValidate, Colors };

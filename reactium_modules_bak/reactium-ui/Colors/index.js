import Reactium from 'reactium-core/sdk';

const defaultColors = {
    black: '#000000',
    grayDark: '#333333',
    gray: '#999999',
    grey: '#cfcfcf',
    greyLight: '#f7f7f7',
    white: '#ffffff',
    whiteDark: '#fdfdfd',
    yellow: '#f4f19c',
    orange: '#e69840',
    pink: '#d877a0',
    red: '#e09797',
    redDark: '#bb514d',
    purple: '#7a7cef',
    blue: '#4f82ba',
    green: '#659a3f',
    greenLight: '#b2bb50',
};

const defaultNamed = {
    primary: defaultColors.blue,
    secondary: defaultColors.grayDark,
    tertiary: defaultColors.black,
    danger: defaultColors.red,
    info: defaultColors.purple,
    success: defaultColors.green,
    warning: defaultColors.orange,
    default: defaultColors.gray,
    error: defaultColors.redDark,
};

const Colors = (val) => {
    let clr = { ...defaultColors };
    Reactium.Hook.runSync('rui-colors', clr);
    return val && Object.keys(clr).includes(val) ? clr[val] : clr;
};

const ColorNames = (val) => {
    let clr = { ...defaultNamed };
    Reactium.Hook.runSync('rui-color-names', clr);
    return val && Object.keys(clr).includes(val) ? clr[val] : clr;
};

const ColorValidate = (val) => {
    const names = Object.keys(ColorNames());
    const ids = Object.keys(Colors());
    return !Boolean(!names.includes(val) && !ids.includes(val));
};

export { ColorNames, ColorValidate, Colors };

import Reactium from 'reactium-core/sdk';

const buttonProps = ({ style = {} }) => {
    const { Button } = Reactium.Component.get('ReactiumUI');

    return [
        {
            style,
            css: 'btn-%color',
        },
        {
            style,
            outline: true,
            css: 'btn-%color-outline',
        },
        {
            style,
            css: 'btn-%color-pill',
            appearance: Button.APPEARANCE.PILL,
        },
        {
            style,
            outline: true,
            css: 'btn-%color-outline-pill',
            appearance: Button.APPEARANCE.PILL,
        },
    ];
};

export { buttonProps, buttonProps as default };

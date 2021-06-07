import Reactium from 'reactium-core/sdk';

const buttonProps = ({ style = {} }) => {
    const { Button } = Reactium.Component.get('ReactiumUI');

    return [
        {
            style,
            css: 'btn-%color',
            children: 'Button',
        },
        {
            style,
            outline: true,
            css: 'btn-%color-outline',
            children: 'Button',
        },
        {
            style,
            css: 'btn-%color-pill',
            appearance: Button.APPEARANCE.PILL,
            children: 'Button',
        },
        {
            style,
            outline: true,
            css: 'btn-%color-outline-pill',
            appearance: Button.APPEARANCE.PILL,
            children: 'Button',
        },
    ];
};

export { buttonProps, buttonProps as default };

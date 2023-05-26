import { __ } from 'reactium-core/sdk';

const buttonStates = [
    {
        label: __('Default'),
        className: '',
    },
    {
        label: __('Hover'),
        className: 'hover',
    },
    {
        label: __('Active'),
        className: 'active',
    },
    {
        label: __('Focus'),
        className: 'focus',
    },
    {
        label: __('Disabled'),
        className: 'disabled',
    },
];

export { buttonStates, buttonStates as default };

const ENUMS = {
    MANIFEST: {
        theme: {
            id: 'theme',
            order: -1,
            required: true,
            styles: ['./Base/theme'],
        },
        reboot: {
            id: 'reboot',
            order: 0,
            required: true,
            styles: ['./Base/reboot'],
        },
        hooks: {
            id: 'hooks',
            order: -2,
            named: '*',
            required: true,
            from: './hooks',
        },
        colors: {
            id: 'colors',
            order: 1,
            required: true,
            from: './Colors',
            styles: ['./Colors/style'],
            named: '{ ColorNames, ColorValidate, Colors }',
        },
        grid: { id: 'grid', order: 2, styles: ['./Grid/style'] },
        breakpoint: {
            id: 'breakpoint',
            order: 10,
            from: './Breakpoint',
            styles: ['./Breakpoint/style'],
            named: '{ Breakpoint, getBreakpoints }',
        },
        text: {
            id: 'text',
            order: 100,
            from: './Text',
            styles: ['./Text/style'],
        },
        form: {
            id: 'form',
            order: 100,
            from: 'Form',
            styles: ['./Form/style'],
        },
        button: {
            id: 'button',
            order: 100,
            from: './Button',
            named: '{ Button }',
            styles: ['./Button/style'],
        },
        alert: {
            id: 'alert',
            order: 900,
            from: './Alert',
            named: '{ Alert }',
            styles: ['./Alert/style'],
        },
        icon: {
            id: 'icon',
            order: 900,
            named: '*',
            from: './Icon',
            styles: ['./Icon/style'],
            required: true,
        },
        toggle: {
            id: 'toggle',
            order: 900,
            from: './Toggle',
            named: '{ Toggle }',
            styles: ['./Toggle/style'],
        },
        x: { id: 'x', from: './X', named: '{ X, Check }', required: true },
        portal: { id: 'portal', from: './Portal', named: '{ Portal }' },
    },
};

module.exports = ENUMS;

const ENUMS = {
    MANIFEST: {
        theme: { order: -1, required: true, styles: ['./Base/theme'] },
        reboot: { order: 0, required: true, styles: ['./Base/reboot'] },
        hooks: { order: -2, named: '*', required: true, from: './hooks' },
        colors: {
            order: 1,
            required: true,
            from: './Colors',
            styles: ['./Colors/style'],
            named: '{ ColorNames, ColorValidate, Colors }',
        },
        grid: { order: 2, styles: ['./Grid/style'] },
        breakpoint: {
            order: 10,
            from: './Breakpoint',
            styles: ['./Breakpoint/style'],
            named: '{ Breakpoint, getBreakpoints }',
        },
        text: { order: 100, from: './Text', styles: ['./Text/style'] },
        form: { order: 100, from: 'Form', styles: ['./Form/style'] },
        button: {
            order: 100,
            from: './Button',
            named: '{ Button }',
            styles: ['./Button/style'],
        },
        alert: {
            order: 900,
            from: './Alert',
            named: '{ Alert }',
            styles: ['./Alert/style'],
        },
        icon: {
            order: 900,
            named: '*',
            from: './Icon',
            styles: ['./Icon/style'],
            required: true,
        },
        toggle: {
            order: 900,
            from: './Toggle',
            named: '{ Toggle }',
            styles: ['./Toggle/style'],
        },
        x: { from: './X', named: '{ X, Check }', required: true },
        portal: { from: './Portal', named: '{ Portal }' },
    },
};

module.exports = ENUMS;

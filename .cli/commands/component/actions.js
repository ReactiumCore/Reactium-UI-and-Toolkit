const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');
const zip = require('folder-zipper');
const prettier = require('prettier');
const homedir = require('os').homedir();
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    const isFile = path => fs.existsSync(path);

    const generate = ({ action, params, props, templateFile, fileName }) => {
        const { cwd } = props;
        const { destination, command, name, oname, overwrite } = params;

        const filepath = path.normalize(path.join(destination, fileName));

        const actionType = overwrite === true ? 'Overwritting' : 'Creating';

        message(`${actionType} ${oname || name} ${chalk.cyan(fileName)}...`);

        fs.ensureDirSync(path.normalize(destination));

        // Template content
        const template = path.normalize(
            `${__dirname}/template/${templateFile}.hbs`,
        );
        const content = handlebars(fs.readFileSync(template, 'utf-8'))(params);

        fs.writeFileSync(filepath, content);

        return new Promise(resolve =>
            setTimeout(() => resolve({ action, status: 200 }), 1000),
        );
    };

    return {
        init: args => {
            args.params.overwrite = isFile(args.params.destination);
        },
        create: ({ action, params, props }) => {
            const { destination, name, overwrite } = params;
            const actionType = overwrite === true ? 'Overwritting' : 'Creating';

            message(`${actionType} ${chalk.cyan(name)}...`);

            return new Promise((resolve, reject) => {
                fs.ensureDir(destination);
                setTimeout(() => resolve({ action, status: 200 }), 2000);
            });
        },

        index: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: `index-${params.type}`,
                fileName: 'index.js',
            }),

        redux: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'index-redux',
                fileName: 'index.js',
            }),

        subclass: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: `index-${params.type}`,
                fileName: `${params.name}.js`,
            }),

        actions: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'actions',
                fileName: 'actions.js',
            }),

        actionTypes: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'actionTypes',
                fileName: 'actionTypes.js',
            }),

        reducers: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'reducers',
                fileName: 'reducers.js',
            }),

        route: ({ action, params, props }) => {
            if (Array.isArray(params.route)) {
                params.route = JSON.stringify(params.route);
            }

            return generate({
                action,
                params,
                props,
                templateFile: 'route',
                fileName: 'route.js',
            });
        },

        services: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'services',
                fileName: 'services.js',
            }),

        state: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'state',
                fileName: 'state.js',
            }),

        domain: ({ action, params, props }) =>
            generate({
                action,
                params: {
                    ...params,
                    oname: params.name,
                    name:
                        params.type === 'rui'
                            ? `RUI${params.name}`
                            : params.name,
                },
                props,
                templateFile: 'domain',
                fileName: 'domain.js',
            }),

        plugin: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'reactium-hooks',
                fileName: 'reactium-hooks.js',
            }),

        style: ({ action, params, props }) => {
            if (!params.stylesheet) return;

            return generate({
                action,
                params,
                props,
                templateFile: 'style',
                fileName: '_style.scss',
            });
        },

        ruiENUMS: ({ params, props }) => {
            if (params.type !== 'rui') return;

            message('Updating Reactium UI manifest...');

            let { ID, name, order, required, stylesheet } = params;
            const { cwd } = props;

            ID = String(ID).toLowerCase();
            order = Number(order);

            const enumsPath = arcli.normalizePath(
                cwd,
                'reactium_modules',
                '@atomic-reactor',
                'reactium-ui',
                'enums.js',
            );

            const obj = {
                order,
                required,
                from: `./${name}`,
                named: `{ ${name} }`,
            };

            if (stylesheet === true) {
                obj.styles = [`./${name}/style`];
            }

            const enums = require(enumsPath);

            enums.MANIFEST[ID] = obj;

            const enumsTemp = prettier.format(
                `const ENUMS = ${JSON.stringify(enums)};

                module.exports = ENUMS;`,
                {
                    parser: 'babel',
                    singleQuote: true,
                    jsxSingleQuote: true,
                    jsxBracketSameLine: true,
                    trailingComma: 'all',
                    tabWidth: 4,
                },
            );

            fs.writeFileSync(enumsPath, enumsTemp);

            return new Promise(resolve => setTimeout(() => resolve(), 1000));
        },

        ruiMANIFEST: async ({ params, props }) => {
            if (params.type !== 'rui') return;

            if (spinner && spinner.isSpinning) spinner.stop();
            await arcli.runCommand('arcli', ['rui-manifest', '-u']);
            if (spinner) spinner.start();
        },
    };
};

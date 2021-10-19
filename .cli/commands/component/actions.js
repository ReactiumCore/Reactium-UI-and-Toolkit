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

    const generate = ({ action, params, props, templateFile, fileName }) => {
        const { cwd } = props;
        const { destination, command, name, overwrite } = params;

        const filepath = path.normalize(path.join(destination, fileName));

        const actionType = overwrite === true ? 'overwritting' : 'creating';

        message(`${actionType} command ${command} ${chalk.cyan(name)}...`);

        fs.ensureDirSync(path.normalize(destination));

        // Template content
        const template = path.normalize(
            `${__dirname}/template/${templateFile}.hbs`,
        );
        const content = handlebars(fs.readFileSync(template, 'utf-8'))(params);

        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, content, error => {
                if (error) {
                    reject(error.Error);
                } else {
                    resolve({ action, status: 200 });
                }
            });
        });
    };

    return {
        create: ({ action, params, props }) => {
            const { destination, name } = params;

            message(`creating ${chalk.cyan('name')}...`);

            return new Promise((resolve, reject) => {
                fs.ensureDir(destination, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
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

        ruiENUMS: ({ params, props }) => {
            if (params.type !== 'rui') return;

            let { ID, name, order, required, style } = params;
            const { cwd, destination } = props;

            message('updating reactium-ui manifest');

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

            if (style === true) {
                obj.styles = `['./${name}/style']`;
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
        },

        ruiMANIFEST: async ({ params, props }) => {
            if (params.type !== 'rui') return;

            spinner.stop();
            await arcli.runCommand('arcli', ['rui-manifest']);
            spinner.start();
        },
    };
};

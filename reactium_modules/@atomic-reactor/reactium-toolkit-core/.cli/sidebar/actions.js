const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const cc = require('camelcase');
const _ = require('underscore');
const op = require('object-path');
const { codeFormat } = require('../utils');
const handlebars = require('handlebars').compile;

module.exports = ({ Spinner }) => {
    Spinner = Spinner || arcli.Spinner;

    const message = text => {
        if (Spinner) {
            if (!Spinner.isSpinning) Spinner.start();
            Spinner.text = text;
        }
    };

    const template = ({ file, context }) => {
        const tmp = arcli.normalizePath(__dirname, 'template', file);
        const content = handlebars(fs.readFileSync(tmp, 'utf-8'))(context);
        return codeFormat(content);
    };

    const write = ({ content, directory, file }) => {
        file = arcli.normalizePath(directory, file);
        fs.ensureFileSync(file);
        fs.writeFileSync(file, content);
    };

    return {
        init: ({ params }) => {
            message('Creating sidebar', chalk.magenta(params.name) + '...');
            params.directory = String(params.directory)
                .toLowerCase()
                .endsWith('sidebar')
                ? params.directory
                : arcli.normalizePath(params.directory, 'Sidebar');

            fs.ensureDirSync(params.directory);
        },
        hooks: ({ params, props }) => {
            write({
                content: template({
                    file: 'reactium-hooks.hbs',
                    context: params,
                }),
                directory: params.directory,
                file: 'reactium-hooks.js',
            });
        },
        domain: ({ params }) => {
            const { prettier } = arcli;
            const { cwd } = arcli.props;
            const { directory, id, label } = params;
            const domainFilePath = arcli.normalizePath(directory, 'domain.js');

            const isNew = !fs.existsSync(domainFilePath);
            const domainObj = isNew ? {} : require(domainFilePath);

            if (!op.get(domainObj, 'name')) {
                domainObj.name = cc(`toolkit-sidebar-${id}`, {
                    pascalCase: true,
                });
            }

            if (!op.get(domainObj, 'reactiumToolkit')) {
                domainObj.reactiumToolkit = { group: {} };
            }

            if (!op.get(domainObj, 'reactiumToolkit.group')) {
                domainObj.reactiumToolkit.group = {};
            }

            op.set(domainObj, 'reactiumToolkit.group.id', id);
            op.set(domainObj, 'reactiumToolkit.group.label', label);

            const content = prettier.format(
                `
                /**
                 * -----------------------------------------------------------------------------
                 * DDD Domain ${
                     domainObj.name
                 } - Change name to place domain artifacts in this directory
                 * in a different domain.
                 * -----------------------------------------------------------------------------
                 */
                module.exports = ${JSON.stringify(domainObj)};
            `,
                {
                    parser: 'babel',
                    trailingComma: 'all',
                    singleQuote: true,
                    tabWidth: 4,
                    useTabs: false,
                },
            );
            write({ content, directory, file: 'domain.js' });
        },
    };
};

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const cc = require('camelcase');
const _ = require('underscore');
const op = require('object-path');
const { codeFormat } = require('../utils');
const handlebars = require('handlebars').compile;

module.exports = ({ Spinner }) => {
    const message = (text) => {
        if (Spinner) {
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
        empty: ({ params }) => {
            message('Creating element', chalk.magenta(params.name) + '...');

            fs.emptyDirSync(params.directory);
        },
        element: ({ params }) => {
            write({
                content: template({ file: 'element.hbs', context: params }),
                directory: params.directory,
                file: 'index.js',
            });
        },
        domain: ({ params }) => {
            const context = {
                ...params,
                name: cc(`toolkit-element-${params.id}`, { pascalCase: true }),
            };

            write({
                content: template({ file: 'domain.hbs', context }),
                directory: params.directory,
                file: 'domain.js',
            });
        },
        sidebar: ({ params }) => {
            if (!op.get(params, 'label')) return;
            const actions = require('../sidebar/actions')({ Spinner });
            const id = _.compact([params.group, params.id]).join('-');

            const p = {
                ...params,
                id,
                type: 'link',
                url: `/toolkit/${id.split('-').join('/')}`,
            };

            Object.keys(actions).forEach((key, i) =>
                actions[key]({ params: p }),
            );
        },
        document: ({ params }) => {
            if (!op.get(params, 'doc')) return;

            const { directory } = params;

            fs.ensureFileSync(arcli.normalizePath(directory, 'readme.md'));

            // const group = _.compact([params.group, params.id]).join('-');
            // const id = _.compact([group, 'docs']).join('-');

            // const actions = require('../document/actions')({ Spinner });

            // const args = {
            //     params: {
            //         ...params,
            //         id,
            //         group,
            //         zone: id,
            //         order: params.docOrder || 100,
            //         label: params.docLabel || 'Documentation',
            //         url: `/toolkit/${id.split('-').join('/')}`,
            //         directory: arcli.normalizePath(directory, 'Documentation'),
            //     },
            // };

            // Object.keys(actions).forEach((key, i) => actions[key](args));
        },
        hooks: ({ params }) => {
            const { id, group } = params;
            params.zone = !!group ? `${group}-${id}` : id;

            write({
                content: template({
                    file: 'reactium-hooks.hbs',
                    context: params,
                }),
                directory: params.directory,
                file: 'reactium-hooks.js',
            });
        },
    };
};

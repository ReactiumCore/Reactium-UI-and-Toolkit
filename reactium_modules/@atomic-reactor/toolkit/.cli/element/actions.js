const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const { codeFormat } = require('../utils');
const handlebars = require('handlebars').compile;

module.exports = ({ Spinner }) => {
    const message = text => {
        if (Spinner) {
            Spinner.text = text;
        }
    };

    const template = ({ file, context }) => {
        const tmp = path.normalize(`${__dirname}/template/${file}`);
        const content = handlebars(fs.readFileSync(tmp, 'utf-8'))(context);
        return codeFormat(content);
    };

    const write = ({ content, directory, file }) => {
        file = path.normalize(path.join(directory, file));
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
        document: ({ params }) => {
            if (!op.get(params, 'doc')) return;

            const { directory, id } = params;

            const actions = require('../document/actions')({ Spinner });

            const args = {
                params: {
                    ...params,
                    group: id,
                    id: `${id}-doc`,
                    zone: `${id}-doc`,
                    label: 'Documentation',
                    url: `/toolkit/${id}/doc`,
                    order: 'Reactium.Enums.priority.lowest',
                    directory: path.normalize(
                        path.join(directory, 'Documentation'),
                    ),
                },
            };

            Object.keys(actions).forEach((key, i) => actions[key](args));
        },
        sidebar: ({ params }) => {
            if (!op.get(params, 'sidebar')) return;

            const { directory } = params;

            const actions = require('../sidebar/actions')({ Spinner });

            const args = {
                params: {
                    ...params,
                    directory: path.normalize(path.join(directory, 'Sidebar')),
                },
            };

            Object.keys(actions).forEach((key, i) => actions[key](args));
        },
        hooks: ({ params }) => {
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

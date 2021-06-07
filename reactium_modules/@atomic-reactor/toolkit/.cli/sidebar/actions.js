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
            message('Creating sidebar', chalk.magenta(params.name) + '...');

            fs.emptyDirSync(params.directory);
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
    };
};

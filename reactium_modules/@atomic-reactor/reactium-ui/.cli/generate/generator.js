const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const hbs = require('handlebars');
const inquirer = require('inquirer');

const normalize = (...args) => path.normalize(path.join(...args));

const dir = (...args) =>
    normalize(
        process.cwd(),
        'reactium_modules',
        '@atomic-reactor',
        'reactium-ui',
        ...args,
    );

const ENUMS = require(dir('enums.js'));

const prefix = ' > ';

const manifest = async () => {
    const choices = _.chain(
        Object.entries(ENUMS.MANIFEST).map(([value, obj]) => {
            if (obj.required === true) return;
            if (typeof obj.from === 'undefined') return;

            const name = String(obj.from).replace(/\.\//g, '');
            return { name, value, short: name };
        }),
    )
        .sortBy('from')
        .compact()
        .value();

    const { excludes = [] } = await inquirer.prompt([
        {
            prefix,
            choices,
            name: 'excludes',
            type: 'checkbox',
            message: 'Exclude Components:',
        },
    ]);

    const MANIFEST = Object.keys(ENUMS.MANIFEST).reduce((obj, key) => {
        if (!excludes.includes(key)) {
            obj[key] = ENUMS.MANIFEST[key];
        }

        return obj;
    }, {});

    const M = JSON.stringify(MANIFEST, null, 4);
    const F = dir('manifest.json');

    // Remove directories & write new manifest
    await Promise.all(
        _.flatten([
            excludes.map(item => fs.remove(dir(item))),
            fs.writeFile(F, M),
        ]),
    );

    console.log('');
    console.log(
        chalk.green(' ✔ '),
        chalk.cyan('Generated'),
        chalk.magenta('manifest.js'),
    );
};

const injector = async () => {
    let scss = [];
    let components = [];

    const indexFile = dir('index.js');
    const styleFile = dir('_style.scss');

    const MANIFEST = require(dir('manifest.json'));

    _.sortBy(Object.values(MANIFEST), 'order').forEach(
        ({ from, named, styles = [] }) => {
            if (named && from) {
                components.push(`export ${named} from '${from}';`);
            }

            styles = typeof styles === 'string' ? [styles] : styles;
            styles.forEach(style => scss.push(`@import '${style}';`));
        },
    );

    scss = scss.join('\n');
    components = components.sort().join('\n');

    // create the handlebars templates
    const tmp = hbs.compile('// Reactium UI\n{{{components}}}')({ components });

    await Promise.all([
        fs.writeFile(indexFile, tmp),
        fs.writeFile(styleFile, scss),
    ]);

    console.log(
        chalk.green(' ✔ '),
        chalk.cyan('Generated'),
        chalk.magenta('index.js'),
    );
    console.log(
        chalk.green(' ✔ '),
        chalk.cyan('Generated'),
        chalk.magenta('_style.scss'),
    );
};

const generator = async () => {
    await manifest();
    await injector();
    console.log('');
};

module.exports = generator;

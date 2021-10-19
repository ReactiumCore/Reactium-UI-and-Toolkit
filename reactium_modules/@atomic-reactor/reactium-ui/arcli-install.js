const cwd = process.cwd();
const path = require('path');
const _ = require('underscore');
const ENUMS = require('./enums');
const hbs = require('handlebars');

const { fs, op, prefix } = arcli;

const normalize = (...args) => path.normalize(path.join(...args));

// prettier-ignore
const dir = (...args) => normalize(cwd, 'reactium_modules', '@atomic-reactor', 'reactium-ui', ...args);

const indexTmp = `// Reactium UI
{{{components}}}
`;

module.exports = spinner => {
    let inject, inquirer;
    const MANIFEST = require(dir('manifest.json'));

    return {
        unattended: ({ params = {} }) => {
            inject = !op.get(params, 'unattended', false);
        },
        manifest: async () => {
            if (inject === false) return;

            if (spinner.isSpinning) spinner.stop();

            const { excludes = [] } = await inquirer.prompt([
                {
                    prefix,
                    name: 'excludes',
                    type: 'checkbox',
                    message: 'Exclude components?:',
                    choices: _.sortBy(
                        Object.entries(ENUMS.MANIFEST),
                        'order',
                    ).map(([value, obj]) => {
                        const name = String(obj.from).replace(/\.\//g, '');
                        return { name, value, short: name };
                    }),
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
        },
        generator: async () => {
            if (inject === false) return;

            let scss = [];
            let components = [];

            const indexFile = dir('index.js');
            const styleFile = dir('_reactium-style.scss');

            _.sortBy(Object.values(MANIFEST), 'order').forEach(
                ({ from, named, styles = [] }) => {
                    components.push(`export ${named} from '${from}';`);
                    styles = typeof styles === 'string' ? [styles] : styles;
                    styles.forEach(style => {
                        scss.push(`@import '${style}';`);
                    });
                },
            );

            scss = scss.join('\n');
            components = components.sort().join('\n');

            // create the handlebars templates
            const tmp = hbs.compile(indexTmp)({ components });

            await Promise.all([
                fs.writeFile(indexFile, tmp),
                fs.writeFile(styleFile, scss),
            ]);
        },
        complete: () => {
            if (inject === false) return;
            if (!spinner.isSpinning) spinner.start();
        },
    };
};

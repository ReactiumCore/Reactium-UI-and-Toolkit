const cwd = process.cwd();
const path = require('path');
const _ = require('underscore');
const hbs = require('handlebars');

const { fs, op, prefix } = arcli;

const resolve = (...args) => path.resolve(normalize(...args));

const normalize = (...args) => path.normalize(path.join(...args));

// prettier-ignore
const dir = (...args) => normalize(cwd, 'reactium_modules', '@atomic-reactor', 'reactium-ui', ...args);

const indexTmp = `// Reactium UI
{{{components}}}
`;

const excludePath = p => {
    if (p.startsWith(resolve(cwd, 'src'))) return false;

    return (
        p.endsWith('.tmp') ||
        p.includes('.Trash') ||
        p.startsWith('/Volumes/') ||
        p.includes('node_modules') ||
        p.includes('reactium_modules') ||
        p.startsWith(resolve(cwd, '.git')) ||
        p.startsWith(resolve(cwd, '.cli')) ||
        p.startsWith(resolve(cwd, 'docs')) ||
        p.startsWith(resolve(cwd, '.core')) ||
        p.startsWith(resolve(cwd, 'build')) ||
        p.startsWith(resolve(cwd, 'public')) ||
        p.startsWith(resolve(cwd, 'markdown')) ||
        p.startsWith(resolve(cwd, 'flow-typed'))
    );
};

module.exports = spinner => {
    let inject, inquirer;
    const MANIFEST = require(dir('manifest.json'));

    return {
        unattended: ({ params = {} }) => {
            inject = !op.get(params, 'unattended', false);
        },
        init: async ({ props }) => {
            if (inject === false) return;

            inquirer = props.inquirer;

            if (spinner.isSpinning) spinner.stop();

            const answers = await inquirer.prompt([
                {
                    prefix,
                    default: true,
                    name: 'inject',
                    type: 'confirm',
                    message: 'Inject Reactium UI styles?:',
                },
            ]);

            inject = op.get(answers, 'inject', false);
        },
        inject: async () => {
            if (inject === false) return;

            const { file } = await inquirer.prompt([
                {
                    prefix,
                    excludePath,
                    name: 'file',
                    rootPath: cwd,
                    depthLimit: 10,
                    itemType: 'file',
                    type: 'fuzzypath',
                    message: 'Select .scss file:',
                    excludeFilter: p =>
                        !String(p)
                            .toLowerCase()
                            .endsWith('.scss'),
                },
            ]);

            let scss = fs.readFileSync(file);
            scss += '@import \'+@atomic-reactor/reactium-ui/style\';';
            scss += '\n';

            fs.writeFileSync(file, scss);
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
            let scss = [];
            let components = [];

            const indexFile = dir('index.js');
            const styleFile = dir('_style.scss');

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

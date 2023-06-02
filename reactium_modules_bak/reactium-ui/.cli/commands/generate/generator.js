const hbs = require('handlebars');

const cwd = process.cwd();
const { inquirer } = arcli.props;
const { _, chalk, fs, normalizePath, op, path, prefix } = arcli;

let ENUMS = require(arcli.normalizePath(
    cwd,
    'reactium_modules',
    '@atomic-reactor',
    'reactium-ui',
    'enums.js',
));

ENUMS.MANIFEST = Object.entries(ENUMS.MANIFEST).reduce((obj, [key, val]) => {
    const k = String(key).toLowerCase(key);
    obj[k] = { id: k, ...val };
    return obj;
}, {});

const normalize = normalizePath;
const pkgPath = normalize(cwd, 'package.json');
const pkg = require(pkgPath);
const config = op.get(pkg, 'reactium.reactium-ui', { excludes: [] }) || {
    excludes: [],
};
op.set(pkg, 'reactium.reactium-ui', config);

const dir = (...args) =>
    normalize(
        process.cwd(),
        'reactium_modules',
        '@atomic-reactor',
        'reactium-ui',
        ...args,
    );

const manifest = async (params, spinner) => {
    let { excludes, unattended } = params;

    if (spinner && (spinner.isSpinning || unattended === true)) {
        spinner.stop();
    }

    let del = [];

    Object.keys(ENUMS.MANIFEST).forEach((key) => {
        if (!excludes.includes(key)) return;
        const obj = ENUMS.MANIFEST[key];

        let { from, styles = [] } = obj;

        styles = _.isString(styles) ? [styles] : styles;
        styles = styles.map((i) =>
            String(i).endsWith('.scss') ? i : String(`${i}.scss`),
        );

        del.push(
            _.chain([from, styles])
                .flatten()
                .uniq()
                .compact()
                .value()
                .reverse(),
        );

        delete ENUMS.MANIFEST[key];
    });

    del = _.chain(del)
        .flatten()
        .compact()
        .value()
        .map((i) => dir(i));

    del.sort().reverse();

    // Update package.json manifest
    op.set(pkg, 'reactium.reactium-ui.manifest', ENUMS.MANIFEST);
    fs.writeFileSync(
        normalize(cwd, 'package.json'),
        JSON.stringify(pkg, null, 2),
    );

    // Remove files
    if (pkg.name !== '@atomic-reactor/reactium-ui-toolkit') {
        del.map((p) => fs.removeSync(p));
    }

    console.log('');
    console.log(
        chalk.green(' ✔ '),
        chalk.cyan('Generated'),
        chalk.magenta('Reactium UI manifest'),
    );
};

const injector = async (params) => {
    let scss = [];
    let components = [];

    const indexFile = dir('index.js');
    const styleFile = dir('_reactium-style.scss');

    _.sortBy(Object.values(ENUMS.MANIFEST), 'order').forEach(
        ({ from, named, styles = [] }) => {
            if (named && from && fs.existsSync(dir(from))) {
                components.push(`export ${named} from '${from}';`);
            }

            styles = !_.isArray(styles) ? [styles] : styles;
            styles.forEach((style) => {
                const farr = style.split('/');
                farr.shift();

                const fname = farr.pop();
                const fpath = dir(...farr, `_${fname}.scss`);

                if (!fs.existsSync(fpath)) return;
                scss.push(`@import '${style}';`);
            });
        },
    );

    scss = scss.join('\n');
    components = components.sort().join('\n');

    // create the handlebars templates
    const tmp = hbs.compile(
        '// Generated by arcli rui-manifest\n// DO NOT DIRECTLY EDIT THIS FILE\n\n{{{components}}}\n',
    )({
        components,
    });

    await Promise.all([
        fs.writeFile(indexFile, tmp),
        fs.writeFile(styleFile, scss),
    ]);

    console.log(
        chalk.green(' ✔ '),
        chalk.cyan('Generated'),
        chalk.magenta('Reactium UI index.js'),
    );
    console.log(
        chalk.green(' ✔ '),
        chalk.cyan('Generated'),
        chalk.magenta('Reactium UI _reactium-style.scss'),
    );
};

const generator = async ({ params }) => {
    await manifest(params);
    await injector(params);
    console.log('');
};

module.exports = generator;

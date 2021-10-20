module.exports = async ({ params = {} }) => {
    const cwd = process.cwd();
    const { _, fs, op, prefix } = arcli;
    const { inquirer } = arcli.props;

    let ENUMS = require(arcli.normalizePath(
        cwd,
        'reactium_modules',
        '@atomic-reactor',
        'reactium-ui',
        'enums.js',
    ));

    ENUMS.MANIFEST = Object.entries(ENUMS.MANIFEST).reduce(
        (obj, [key, val]) => {
            const k = String(key).toLowerCase(key);
            obj[k] = val;
            return obj;
        },
        {},
    );

    const pkgPath = arcli.normalizePath(cwd, 'package.json');
    const pkg = require(pkgPath);
    const config = op.get(pkg, 'reactium.reactium-ui', { excludes: [] }) || {
        excludes: [],
    };

    if (params.unattended !== true) {
        const choices = _.sortBy(
            Object.entries(ENUMS.MANIFEST).reduce((arr, [key, val]) => {
                arr.push({
                    ...val,
                    short: key,
                    key: String(key).toLowerCase(),
                    name: String(val.from || key).replace(/\.\//g, ''),
                });
                return arr;
            }, []),
            'name',
        ).filter(obj => Boolean(obj.required !== true));

        const { excludes } = await inquirer.prompt([
            {
                prefix,
                choices,
                loop: false,
                pageSize: 10,
                name: 'excludes',
                type: 'checkbox',
                default: config.excludes,
                message: 'Exclude components?:',
            },
        ]);

        config.excludes = excludes;
    }

    op.set(pkg, 'reactium.reactium-ui', config);
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

    params.excludes = config.excludes.map(i => String(i).toLowerCase());

    return params.excludes;
};

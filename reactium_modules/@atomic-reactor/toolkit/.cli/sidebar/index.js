/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const { _, chalk, fs, op, path, prefix, props } = arcli;
const { cwd, inquirer } = arcli.props;

const cc = require('camelcase');
const GENERATOR = require('./generator');

const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);

const {
    directoryName,
    excludePath,
    isEmpty,
    mergeParams,
    normalize,
    resolve,
    slug,
    sidebarGroups,
} = require('../utils');

const NAME = 'toolkit <sidebar>';

const DESC = 'Create a Reactium Toolkit sidebar item';

const CANCELED =
    'Reactium Toolkit sidebar creation ' + chalk.magenta('canceled!');

const VALIDATE = {};
const PROMPT = {};
const FILTER = {};

const HELP = () => {
    console.log('');
};

const CONFORM = params => {
    Hook.runSync('toolkit-sidebar-conform', { arcli, params, props });

    return Object.keys(params).reduce((obj, key) => {
        let val = params[key];
        switch (key) {
            case 'id':
            case 'group':
                if (val) {
                    obj[key] = slug(val);
                }
                break;

            case 'order':
                if (val) {
                    obj[key] = Number(val);
                }
                break;

            default:
                obj[key] = val;
                break;
        }
        return obj;
    }, {});
};

VALIDATE.REQUIRED = (key, val, msg) =>
    _.chain([val])
        .flatten()
        .compact()
        .isEmpty()
        .value()
        ? msg || `${chalk.magenta(key)} is required`
        : true;

FILTER.FORMAT = (key, val) => CONFORM({ [key]: val })[key];

PROMPT.DIR = async params => {
    const inq = await inquirer.prompt(
        [
            {
                prefix,
                excludePath,
                depthLimit: 10,
                type: 'fuzzypath',
                name: 'directory',
                message: 'Directory:',
                itemType: 'directory',
                rootPath: normalize(cwd),
                validate: (val, answers) =>
                    VALIDATE.REQUIRED('directory', val, answers),
            },
        ],
        params,
    );

    mergeParams(params, CONFORM(inq));

    const domainFilePath = normalize(params.directory, 'domain.js');
    const domain = fs.existsSync(domainFilePath) ? require(domainFilePath) : {};

    params.group = op.get(domain, 'reactiumToolkit.group.id');
    params.directory = normalize(params.directory);
};

PROMPT.OVERWRITE = async params => {
    if (!isEmpty(params.directory) && !params.overwrite) {
        message(chalk.magenta('The selected directory is not empty!'));

        const { overwrite } = await inquirer.prompt(
            [
                {
                    prefix,
                    default: false,
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'Overwrite?',
                },
            ],
            params,
        );

        if (overwrite !== true) {
            message(CANCELED);
            process.exit();
        }
    }
};

PROMPT.SIDEBAR = async params => {
    const inq = await inquirer.prompt(
        [
            {
                prefix,
                name: 'id',
                type: 'input',
                message: 'Sidebar ID:',
            },
            {
                prefix,
                name: 'label',
                type: 'input',
                default: params.name,
                message: 'Sidebar Label:',
            },
            {
                prefix,
                name: 'group',
                type: 'list',
                message: 'Sidebar Parent:',
                choices: sidebarGroups(),
                default: params.group,
                askAnswered: true,
            },
            {
                prefix,
                default: 100,
                name: 'order',
                type: 'number',
                message: 'Sidebar Order:',
            },
        ],
        params,
    );

    mergeParams(params, CONFORM(inq));

    const { url } = await inquirer.prompt(
        [
            {
                prefix,
                name: 'url',
                type: 'input',
                message: 'Sidebar URL:',
                default: _.compact(['/toolkit', params.group, params.id]).join(
                    '/',
                ),
            },
        ],
        params,
    );

    if (String(url).length > 0) {
        params.url = url;
    }

    params.directory = !params.group
        ? normalize(params.directory, directoryName(params.id), 'Sidebar')
        : normalize(params.directory, 'Sidebar');
};

PROMPT.PREFLIGHT = async params => {
    // Transform the preflight object instead of the params object
    const preflight = { ...params };
    delete preflight.debug;

    const isDebug = op.get(params, 'debug', false);

    // Output messge

    if (!isDebug) {
        message(
            'A new toolkit sidebar item will be created using the following configuration:',
        );
    } else {
        message(
            'A new toolkit sidebar item would be created using the following configuration:',
        );
    }

    console.log(JSON.stringify(preflight, null, 2));
    console.log('');

    let confirm;

    if (!isDebug) {
        const answers = await inquirer.prompt(
            [
                {
                    prefix,
                    name: 'confirm',
                    type: 'confirm',
                    message: 'Proceed?:',
                    default: false,
                },
            ],
            params,
        );

        confirm = op.get(answers, 'confirm');
    }

    if (confirm !== true) {
        if (!isDebug) {
            message(CANCELED);
        } else {
            message('Debug ' + chalk.cyan('complete!'));
        }
        process.exit();
    }
};

const ACTION = async (action, initialParams) => {
    console.log('');

    props.command = action;

    // 0.0 - prep params that came from flags
    let params = CONFORM(initialParams);

    // 1.0 - Get Directory
    await PROMPT.DIR(params);

    // 2.0 - Get id & group
    await PROMPT.SIDEBAR(params);

    // 3.0 - Check directory
    await PROMPT.OVERWRITE(params);

    // 4.0 - Preflight
    params.id = _.compact([params.group, params.id]).join('-');

    await PROMPT.PREFLIGHT(CONFORM(params));

    // 5.0 - Execute actions
    if (op.get(params, 'debug') !== true) {
        await GENERATOR({ arcli: global, params, props });
    }

    console.log('');
};

const FLAGS_TO_PARAMS = opt =>
    FLAGS().reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) obj[key] = val;

        return obj;
    }, {});

const FLAGS = () => {
    let flags = [
        'name',
        'directory',
        'overwrite',
        'id',
        'group',
        'url',
        'label',
        'order',
        'debug',
        'type',
    ];
    Hook.runSync('toolkit-sidebar-flags', flags);
    return flags;
};

const COMMAND = ({ program, ...args }) =>
    program
        .command(NAME)
        .description(DESC)
        .action((action, opt) => ACTION(action, FLAGS_TO_PARAMS(opt)))
        .usage('sidebar [options]')
        .option(
            '-d, --directory [directory]',
            'The path to create the sidebar item',
        )
        .option('-i, --id [id]', 'The unique id of the sidebar item')
        .option('-g, --group [group]', 'The sidebar link group')
        .option('-l, --label [label]', 'The sidebar link label')
        .option('-u, --url [url]', 'The sidebar link url')
        .option('-o, --order [order]', 'The sidebar link order')
        .option('-t, --type [type]', 'The sidebar link type')
        .option('-D, --debug [debug]', 'Debug mode')
        .option(
            '-O, --overwrite [overwrite]',
            'Overwrite existing sidebar item',
        )
        .on('--help', HELP);

module.exports = {
    ACTION,
    CANCELED,
    COMMAND,
    CONFORM,
    ID: NAME,
    FILTER,
    VALIDATE,
    PROMPT,
};

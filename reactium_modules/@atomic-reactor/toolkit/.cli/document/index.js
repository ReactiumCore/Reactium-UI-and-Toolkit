/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const cc = require('camelcase');
const GENERATOR = require('./generator');

const { _, chalk, fs, op, path, prefix, props } = arcli;
const { cwd, inquirer } = arcli.props;

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

const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);

const NAME = 'toolkit <document>';

const DESC = 'Create a new Reactium Toolkit documentation element';

const CANCELED =
    'Reactium Toolkit document creation ' + chalk.magenta('canceled!');

const VALIDATE = {};
const PROMPT = {};
const FILTER = {};

const HELP = () => {
    console.log('');
};

const CONFORM = params => {
    return Object.keys(params).reduce((obj, key) => {
        let val = params[key];
        switch (key) {
            case 'name':
                obj[key] = directoryName(val);
                break;

            case 'id':
            case 'group':
                obj[key] = val ? slug(val) : null;
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

VALIDATE.REQUIRED = (key, val) =>
    !val ? `${chalk.magenta(key)} is required` : true;

FILTER.FORMAT = (key, val) => CONFORM({ [key]: val })[key];

PROMPT.NAME = async params => {
    const questions = [];

    const { id } = await inquirer.prompt(
        [
            {
                prefix,
                name: 'id',
                type: 'input',
                message: 'Document ID:',
                filter: val => FILTER.FORMAT('id', val),
                valiate: val => VALIDATE.REQUIRED('id', val),
                default: op.get(params, 'name') ? slug(params.name) : null,
            },
        ],
        params,
    );

    params.id = id;

    questions.push({
        prefix,
        name: 'name',
        type: 'input',
        message: 'Document Name:',
        filter: val => FILTER.FORMAT('name', val),
        default: cc(params.id, { pascalCase: true }),
        validate: val => VALIDATE.REQUIRED('name', val),
    });

    const answers = await inquirer.prompt(questions, params);
    mergeParams(params, CONFORM(answers));
};

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

    params.directory = normalize(params.directory, directoryName(params.name));
    params.group = op.get(domain, 'reactiumToolkit.group.id');
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
                when: answers => !!answers.label,
            },
            {
                prefix,
                default: 100,
                name: 'order',
                type: 'number',
                message: 'Sidebar Order:',
                when: answers => !!answers.label,
            },
        ],
        params,
    );

    const { url } = await inquirer.prompt([
        {
            prefix,
            name: 'url',
            type: 'input',
            message: 'Sidebar URL:',
            default: _.compact(['/toolkit', inq.group, params.id]).join('/'),
        },
    ]);

    inq.url = url;

    mergeParams(params, CONFORM(inq));
};

PROMPT.PREFLIGHT = async params => {
    mergeParams(params, CONFORM(params));

    // Transform the preflight object instead of the params object
    const preflight = { ...params };
    delete preflight.debug;

    const isDebug = op.get(params, 'debug', false);

    // Output messge

    if (!isDebug) {
        message(
            'A new toolkit document will be created using the following configuration:',
        );
    } else {
        message(
            'A new toolkit document would be created using the following configuration:',
        );
    }

    console.log(JSON.stringify(preflight, null, 2));
    console.log('');

    let confirm;

    if (!isDebug) {
        const answers = await inquirer.prompt([
            {
                prefix,
                name: 'confirm',
                type: 'confirm',
                message: 'Proceed?:',
                default: false,
            },
        ]);

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

    // 0.0 - prep params that came from flags
    let params = CONFORM(initialParams);

    // 1.0 - Get name
    await PROMPT.NAME(params);

    // 2.0 - Get Directory
    await PROMPT.DIR(params);

    // 3.0 - Check directory
    await PROMPT.OVERWRITE(params);

    // 4.0 - Sidebar
    await PROMPT.SIDEBAR(params);

    // 5.0 - Preflight
    await PROMPT.PREFLIGHT(params);

    // 6.0 - Execute actions
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
        'sidebar',
        'group',
        'url',
        'label',
        'order',
        'debug',
    ];
    Hook.runSync('toolkit-document-flags', flags);
    return flags;
};

const COMMAND = ({ program, ...args }) =>
    program
        .command(NAME)
        .description(DESC)
        .action((action, opt) => ACTION(action, FLAGS_TO_PARAMS(opt)))
        .usage('document [options]')
        .option('-n, --name [name]', 'The documentation name')
        .option(
            '-d, --directory [directory]',
            'The path to create the documentation',
        )
        .option('-i, --id [id]', 'The unique id of the documentation')
        .option('-s, --sidebar [sidebar]', 'Include sidebar item')
        .option('-g, --group [group]', 'The sidebar item group')
        .option('-l, --label [label]', 'The sidebar item label')
        .option('-u, --url [url]', 'The sidebar item url')
        .option('-o, --order [order]', 'The sidebar item order')
        .option('-D, --debug [debug]', 'Debug mode')
        .option(
            '-O, --overwrite [overwrite]',
            'Overwrite existing documentation',
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

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const cwd = process.cwd();
const path = require('path');
const chalk = require('chalk');
const _ = require('underscore');
const op = require('object-path');
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
} = require('../utils');

const { arcli, Hook } = global;
const prefix = arcli.prefix;
const props = arcli.props;

const { inquirer } = props;

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
    Hook.runSync('toolkit-document-conform', { arcli, params, props });

    return Object.keys(params).reduce((obj, key) => {
        let val = params[key];
        switch (key) {
            case 'name':
                obj[key] = directoryName(val);
                break;

            case 'id':
            case 'group':
                obj[key] = slug(val);
                break;

            case 'url':
                val = val === true ? FILTER.URL(val, params) : val;
                if (val) {
                    obj[key] = val;
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

VALIDATE.REQUIRED = (key, val) =>
    !val ? `${chalk.magenta(key)} is required` : true;

FILTER.FORMAT = (key, val) => CONFORM({ [key]: val })[key];

FILTER.URL = (val, params, answers = {}) =>
    val === true
        ? _.compact([
              '/toolkit',
              op.get(params, 'group', op.get(answers, 'group')),
              op.get(params, 'id'),
          ]).join('/')
        : null;

PROMPT.NAME = async params => {
    const questions = [];

    if (!op.get(params, 'name')) {
        questions.push({
            prefix,
            name: 'name',
            type: 'input',
            message: 'Document Name:',
            filter: val => FILTER.FORMAT('name', val),
            validate: val => VALIDATE.REQUIRED('name', val),
        });
    }

    if (!op.get(params, 'id')) {
        questions.push({
            prefix,
            name: 'id',
            type: 'input',
            message: 'Document ID:',
            filter: val => FILTER.FORMAT('id', val),
            valiate: val => VALIDATE.REQUIRED('id', val),
            default: op.get(params, 'name') ? slug(params.name) : null,
        });
    }

    if (questions.length > 0) {
        const answers = await inquirer.prompt(questions);
        mergeParams(params, CONFORM(answers));
    }
};

PROMPT.DIR = async params => {
    if (op.get(params, 'directory')) return;

    let { directory } = await inquirer.prompt([
        {
            prefix,
            excludePath,
            depthLimit: 10,
            type: 'fuzzypath',
            name: 'directory',
            suggestOnly: true,
            message: 'Directory:',
            itemType: 'directory',
            rootPath: resolve(cwd),
            default: resolve(cwd, 'src', 'app', 'components', 'Toolkit'),
            validate: (val, answers) =>
                VALIDATE.REQUIRED('directory', val, answers),
        },
    ]);

    directory = resolve(directory, directoryName(params.name));

    mergeParams(params, { directory });
};

PROMPT.OVERWRITE = async params => {
    if (!op.get(params, 'overwrite') && !isEmpty(params.directory)) {
        const { overwrite } = await inquirer.prompt([
            {
                prefix,
                default: false,
                type: 'confirm',
                name: 'overwrite',
                message:
                    chalk.magenta('The selected directory is not empty!') +
                    '\n\t  ' +
                    chalk.cyan(params.directory) +
                    '\n\t  Overwrite?:',
            },
        ]);

        if (overwrite !== true) {
            message(CANCELED);
            process.exit();
        }
    }
};

PROMPT.HOOK = async params => {
    const questions = [];

    if (!op.get(params.sidebar)) {
        questions.push({
            prefix,
            default: true,
            name: 'sidebar',
            type: 'confirm',
            message: 'Sidebar?:',
        });
    }

    if (questions.length > 0) {
        const answers = await inquirer.prompt(questions);
        mergeParams(params, CONFORM(answers));
    }
};

PROMPT.SIDEBAR = async params => {
    if (!op.get(params, 'sidebar')) return;

    const questions = [];

    if (!op.get(params.group)) {
        questions.push({
            prefix,
            name: 'group',
            type: 'input',
            message: 'Sidebar Group ID',
            suffix: ' (optional):',
            filter: val => FILTER.FORMAT('group', val),
        });
    }

    if (!op.get(params.label)) {
        questions.push({
            prefix,
            name: 'label',
            type: 'input',
            default: 'Documentation',
            message: 'Sidebar Label:',
            validate: (val, answers) =>
                VALIDATE.REQUIRED('label', val, answers),
        });
    }

    if (!op.get(params.url)) {
        questions.push({
            prefix,
            name: 'url',
            type: 'confirm',
            message: 'Sidebar URL?:',
        });
    }

    if (!op.get(params.order)) {
        questions.push({
            prefix,
            default: 100,
            name: 'order',
            type: 'number',
            message: 'Sidebar Order:',
        });
    }

    if (questions.length > 0) {
        const answers = await inquirer.prompt(questions);

        if (op.get(answers, 'url') === true) {
            answers.url = FILTER.URL(answers.url, params, answers);
        }

        mergeParams(params, CONFORM(answers));
    }
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

    //props.command = action;

    // 0.0 - prep params that came from flags
    let params = CONFORM(initialParams);

    // 1.0 - Get name
    await PROMPT.NAME(params);

    // 2.0 - Get Directory
    await PROMPT.DIR(params);

    // 3.0 - Check directory
    await PROMPT.OVERWRITE(params);

    // 4.0 - Hook
    await PROMPT.HOOK(params);

    // 5.0 - Sidebar
    await PROMPT.SIDEBAR(params);

    // 6.0 - Preflight
    await PROMPT.PREFLIGHT(params);

    // 7.0 - Execute actions
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

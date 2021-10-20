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

PROMPT.TYPE = async params => {
    if (op.get(params, 'type')) return;

    const answers = await inquirer.prompt([
        {
            prefix,
            type: 'list',
            name: 'type',
            message: 'Type:',
            choices: [
                {
                    name: 'Child Link',
                    value: 'link',
                    short: 'Child Link',
                    checked: true,
                },
                { name: 'Top-Level', value: 'group', short: 'Top-Level' },
            ],
        },
    ]);

    mergeParams(params, answers);
};

PROMPT.DIR = async params => {
    if (op.get(params, 'directory')) return;

    const inputs = [
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
    ];

    let directory = '';

    while (String(directory).length < 1) {
        const inq = await inquirer.prompt(inputs);
        directory = op.get(inq, 'directory');
    }

    const parts = [directory];

    if (params.group) {
        parts.push(directoryName(params.group));
    }

    if (params.id) {
        parts.push(directoryName(params.id));
    }

    directory = normalize(...parts);

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

PROMPT.LINK = async params => {
    if (op.get(params, 'type') !== 'link') return;

    const questions = [];

    if (!op.get(params, 'group')) {
        questions.push({
            prefix,
            name: 'group',
            type: 'input',
            message: 'Parent ID:',
            filter: val => FILTER.FORMAT('group', val),
            valiate: val => VALIDATE.REQUIRED('id', val),
        });
    }

    if (!op.get(params, 'id')) {
        questions.push({
            prefix,
            name: 'id',
            type: 'input',
            message: 'Link ID:',
            filter: val => FILTER.FORMAT('id', val),
            valiate: val => VALIDATE.REQUIRED('id', val),
        });
    }

    const answers = await inquirer.prompt(questions);

    mergeParams(params, CONFORM(answers));
};

PROMPT.GROUP = async params => {
    const questions = [];

    if (!op.get(params, 'id')) {
        questions.push({
            prefix,
            name: 'id',
            type: 'input',
            message: 'ID:',
            valiate: val => VALIDATE.REQUIRED('id', val),
            filter: value => FILTER.FORMAT('id', value),
        });
    }

    if (!op.get(params, 'label')) {
        questions.push({
            prefix,
            name: 'label',
            type: 'input',
            message: 'Label:',
            valiate: val => VALIDATE.REQUIRED('label', val),
        });
    }

    if (!op.get(params, 'url')) {
        questions.push({
            prefix,
            name: 'url',
            type: 'confirm',
            message: 'URL?:',
        });
    }

    if (!op.get(params.order)) {
        questions.push({
            prefix,
            default: 100,
            name: 'order',
            type: 'number',
            message: 'Order:',
        });
    }

    const answers = await inquirer.prompt(questions);

    if (op.get(answers, 'url') === true) {
        answers.url = FILTER.URL(answers.url, params);
    }

    mergeParams(params, CONFORM(answers));
};

PROMPT.PREFLIGHT = async params => {
    // Transform the preflight object instead of the params object
    const preflight = CONFORM({ ...params });
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

    props.command = action;

    // 0.0 - prep params that came from flags
    let params = CONFORM(initialParams);

    // 1.0 - Get Type of menu link
    await PROMPT.TYPE(params);

    // 2.0.1 - Link
    await PROMPT.LINK(params);

    // 2.0.2 - Group
    await PROMPT.GROUP(params);

    // 3.0 - Get Directory
    await PROMPT.DIR(params);

    // 4.0 - Check directory
    await PROMPT.OVERWRITE(params);

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
        'group',
        'url',
        'label',
        'order',
        'debug',
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

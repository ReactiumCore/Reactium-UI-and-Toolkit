/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const cwd = process.cwd();
const path = require('path');
const chalk = require('chalk');
const cc = require('camelcase');
const _ = require('underscore');
const op = require('object-path');
const GENERATOR = require('./generator');
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);

const {
    directoryName,
    excludePath,
    hasLiveEditor,
    isEmpty,
    mergeParams,
    normalize,
    resolve,
    slug,
} = require('../utils');

const isLiveEditor = hasLiveEditor();
const { arcli, Hook } = global;
const prefix = arcli.prefix;
const props = arcli.props;

const { inquirer } = props;

const NAME = 'toolkit <element>';

const DESC = 'Create a new Reactium Toolkit element';

const CANCELED =
    'Reactium Toolkit element creation ' + chalk.magenta('canceled!');

const VALIDATE = {};
const PROMPT = {};
const FILTER = {};

const HELP = () => {
    console.log('');
};

const CONFORM = params => {
    Hook.runSync('toolkit-element-conform', { arcli, params, props });

    return Object.keys(params).reduce((obj, key) => {
        let val = params[key];
        switch (key) {
            case 'name':
                obj[key] = val ? directoryName(val) : val;
                break;

            case 'id':
            case 'group':
                obj[key] = val ? slug(val) : val;
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

PROMPT.ID = async params => {
    const questions = [];

    if (!op.get(params, 'id')) {
        const { id } = await inquirer.prompt([
            {
                prefix,
                name: 'id',
                type: 'input',
                message: 'Element ID:',
                filter: val => FILTER.FORMAT('id', val),
                valiate: val => VALIDATE.REQUIRED('id', val),
            },
        ]);

        mergeParams(params, CONFORM({ id }));
    }

    if (!op.get(params, 'name')) {
        questions.push({
            prefix,
            name: 'name',
            type: 'input',
            message: 'Element Name:',
            default: directoryName(params.id),
            filter: val => FILTER.FORMAT('name', val),
            validate: val => VALIDATE.REQUIRED('name', val),
        });
    }

    if (questions.length > 0) {
        const answers = await inquirer.prompt(questions);
        mergeParams(params, CONFORM(answers));
    }
};

PROMPT.DIR = async params => {
    if (op.get(params, 'directory')) return;

    const inputs = [
        {
            prefix,
            excludePath,
            depthLimit: 10,
            suggestOnly: true,
            name: 'directory',
            type: 'fuzzypath',
            message: 'Directory:',
            itemType: 'directory',
            rootPath: resolve(cwd),
        },
    ];

    let { directory } = await inquirer.prompt(inputs);

    // directory = resolve(directory, directoryName(params.name));

    while (String(directory).length < 1) {
        const inq = await inquirer.prompt(inputs);
        directory = op.get(inq, 'directory');
        // directory = resolve(directory, directoryName(params.name));
    }

    directory = normalize(directory, cc(params.id, { pascalCase: true }));

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

    if (!op.get(params.label)) {
        questions.push({
            prefix,
            name: 'label',
            type: 'input',
            default: params.name,
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

    if (!op.get(params.group)) {
        questions.push({
            prefix,
            name: 'group',
            type: 'input',
            suffix: ' (optional):',
            message: 'Sidebar Parent ID',
            filter: val => FILTER.FORMAT('group', val),
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

PROMPT.DOC = async params => {
    const questions = [];

    if (!op.get(params, 'doc') && !op.get(params, 'group')) {
        questions.push({
            prefix,
            name: 'doc',
            default: true,
            type: 'confirm',
            message: 'Documentation?:',
        });
    }

    if (questions.length > 0) {
        const answers = await inquirer.prompt(questions);
        mergeParams(params, CONFORM(answers));
    }
};

PROMPT.EDITOR = async params => {
    const questions = [];

    if (!op.get(params, 'editor') && isLiveEditor) {
        questions.push({
            prefix,
            name: 'editor',
            default: false,
            type: 'confirm',
            message: 'Live Editor?:',
        });
    }

    if (questions.length > 0) {
        const answers = await inquirer.prompt(questions);
        mergeParams(params, CONFORM(answers));
    }
};

PROMPT.PREFLIGHT = async params => {
    // Transform the preflight object instead of the params object
    const preflight = CONFORM({ ...params });
    delete preflight.debug;

    const isDebug = op.get(params, 'debug', false);

    // Output messge
    if (!isDebug) {
        message(
            'A new toolkit element will be created using the following configuration:',
        );
    } else {
        message(
            'A new toolkit element would be created using the following configuration:',
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
    await PROMPT.ID(params);

    // 2.0 - Get Directory
    await PROMPT.DIR(params);

    // 3.0 - Check directory
    await PROMPT.OVERWRITE(params);

    // 4.0 - Hook
    await PROMPT.HOOK(params);

    // 5.0 - Sidebar
    await PROMPT.SIDEBAR(params);

    // 6.0 - Documentation
    await PROMPT.DOC(params);

    // 7.0 - Live editor
    await PROMPT.EDITOR(params);

    // 8.0 - Preflight
    await PROMPT.PREFLIGHT(params);

    // 9.0 - Execute actions
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
        'doc',
        'editor',
    ];
    Hook.runSync('toolkit-element-flags', flags);
    return flags;
};

const COMMAND = ({ program, ...args }) =>
    program
        .command(NAME)
        .description(DESC)
        .action((action, opt) => ACTION(action, FLAGS_TO_PARAMS(opt)))
        .usage('element [options]')
        .option('-n, --name [name]', 'The element name')
        .option('-d, --directory [directory]', 'The path to create the element')
        .option('-i, --id [id]', 'The unique id of the element')
        .option('-s, --sidebar [sidebar]', 'Include sidebar item')
        .option('-g, --group [group]', 'The sidebar item group')
        .option('-l, --label [label]', 'The sidebar item label')
        .option('-u, --url [url]', 'The sidebar item url')
        .option('-o, --order [order]', 'The sidebar item order')
        .option('-e, --editor [editor]', 'Create as Live Editor element')
        .option('-D, --debug [debug]', 'Debug mode')
        .option('-O, --overwrite [overwrite]', 'Overwrite existing element')
        .option('--doc [doc]', 'Add documentation element')
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

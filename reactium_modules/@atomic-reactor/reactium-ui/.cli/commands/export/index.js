const { cwd, inquirer } = arcli.props;
const { chalk, flagsToParams, message, normalizePath, op, prefix } = arcli;

const NAME = 'rui-export';
const CANCELED = 'rui-export canceled!';
const DESC = 'Updated manifest item named export value';

const GENERATOR = require('./generator');
const ENUMS = require(normalizePath(
    cwd,
    'reactium_modules',
    '@atomic-reactor',
    'reactium-ui',
    'enums.js',
));

// prettier-ignore
const HELP = () => console.log(`
Example:
  $ arcli rui-export -h
`);

const CONFORM = (input, props) =>
    Object.keys(input).reduce((output, key) => {
        let val = input[key];

        output[key] = val;

        return output;
    }, {});

const PROMPT = {};

PROMPT.KEY = async params => {
    if (params.key) {
        params.selected = op.get(ENUMS.MANIFEST, params.key);
        if (params.selected) return;
    }

    delete params.key;

    const choices = Object.keys(ENUMS.MANIFEST).sort();

    const { key } = await inquirer.prompt(
        [
            {
                prefix,
                choices,
                name: 'key',
                loop: false,
                pageSize: 10,
                type: 'list',
                required: true,
                message: 'Component:',
            },
        ],
        params,
    );

    params.key = Array.isArray(key) ? key[0] : key;
    params.selected = op.get(ENUMS.MANIFEST, params.key);
};

PROMPT.EXPORT = async params => {
    const result = await inquirer.prompt(
        [
            {
                prefix,
                type: 'input',
                name: 'export',
                suffix: ' →',
                message: `Change ${chalk.magenta(params.selected.named)}`,
            },
        ],
        params,
    );

    params.selected.named = result.export;
    params.export = result.export;
};

PROMPT.CONFIRM = async params => {
    const { confirm } = await inquirer.prompt(
        [
            {
                prefix,
                default: false,
                type: 'confirm',
                name: 'confirm',
                message: 'Proceed?:',
            },
        ],
        params,
    );

    params.confirm = confirm;
};

const ACTION = async ({ opt, props }) => {
    const flags = ['confirm', 'export', 'key'];

    let params = CONFORM(flagsToParams({ opt, flags }), props);

    await PROMPT.KEY(params);
    await PROMPT.EXPORT(params);
    await PROMPT.CONFIRM(params);

    if (!params.confirm) {
        message(CANCELED);
        return;
    }

    params = CONFORM(params);

    return GENERATOR({ params, props }).catch(err => {
        console.log(err);
        message(op.get(err, 'message', CANCELED));
    });
};

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }))
        .option('-k, --key [key]', 'The manifest key')
        .option('-e, --export [export]', 'The named export value')
        .option('-c, --confirm [confirm]', 'Bipass the confirm prompt')
        .on('--help', HELP);

module.exports = {
    COMMAND,
    NAME,
};

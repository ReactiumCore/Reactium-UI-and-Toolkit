const INPUT = require('./input');
const GENERATOR = require('./generator');

const NAME = 'rui-manifest';
const CANCELED = 'Reactium UI generate canceled!';
const DESC = 'Generate Reactium UI manifest.js, index.js, & _style.scss files';

// prettier-ignore
const HELP = () => console.log(`
Example:
  $ arcli rui-manifest
`);

const FLAGS = ['unattended'];
const FLAGS_TO_PARAMS = (opt) =>
    FLAGS.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) obj[key] = val;

        return obj;
    }, {});

const PROMPT = { INPUT };

const ACTION = async (initialParams) => {
    console.log('');

    let params = { unattended: false, excludes: [], ...initialParams };

    await PROMPT.INPUT({ params });

    await GENERATOR({ params }).catch(console.log);

    console.log('');
};

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .usage('rui-manifest [options]')
        .action((opt) => ACTION(FLAGS_TO_PARAMS(opt)))
        .option('-u, --unattended [unattended]', 'Skip prompt input')
        .on('--help', HELP);

module.exports = {
    COMMAND,
    NAME,
};

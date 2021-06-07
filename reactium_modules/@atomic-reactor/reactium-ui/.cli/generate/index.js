const ACTION = require('./generator');

const NAME = 'rui-manifest';
const CANCELED = 'Reactium UI generate canceled!';
const DESC = 'Generate Reactium UI manifest.js, index.js, & _style.scss files';

// prettier-ignore
const HELP = () => console.log(`
Example:
  $ arcli rui-manifest
`);

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .usage('')
        .action(ACTION)
        .on('--help', HELP);

module.exports = {
    COMMAND,
    NAME,
};

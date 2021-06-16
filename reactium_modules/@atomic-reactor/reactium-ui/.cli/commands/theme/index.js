const ACTION = require('./generator');

const NAME = 'rui-theme';
const CANCELED = 'Theme action canceled!';
const DESC = 'Customize Reactium UI theme';

// prettier-ignore
const HELP = () => console.log(`
Example:
  $ arcli rui-theme set /path/to/_theme.scss

  $ arcli rui-theme create /path/to/new/_theme.scss
`);

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .arguments('<action> <file>')
        .usage('<action> <file>')
        .action((action, file) => ACTION({ action, props, file }))
        .on('--help', HELP);

module.exports = {
    COMMAND,
    NAME,
};

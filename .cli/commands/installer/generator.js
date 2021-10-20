const ora = require('ora');
const path = require('path');
const op = require('object-path');
const mod = path.dirname(require.main.filename);
const ActionSequence = require('action-sequence');

module.exports = ({ params, props }) => {
    const spinner = ora({ spinner: 'dots', color: 'cyan' });

    spinner.start();

    const name = op.get(params, 'name');
    const actions = require('./actions')(spinner);

    if (!name) {
        params.unattended === true;
    }

    return ActionSequence({ actions, options: { params, props } })
        .then(success => {
            if (!spinner.isSpinning) spinner.start();
            spinner.succeed('all actions complete!');
            console.log('');
        })
        .catch(error => {
            spinner.fail('error!');
            console.log(error);
            return error;
        });
};

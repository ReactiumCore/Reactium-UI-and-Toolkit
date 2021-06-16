const ora = require('ora');
const ActionSequence = require('action-sequence');

module.exports = ({ action, params, props, value }) => {
    console.log('');

    let actions;

    switch (action) {
        case 'create':
            actions = require('./create/actions')(spinner);
            break;

        case 'set':
            actions = require('./set/actions')(spinner);
            break;
    }

    if (!actions) process.exit();

    const spinner = ora({
        spinner: 'dots',
        color: 'cyan',
    });

    spinner.start();

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            spinner.succeed('complete!');
            console.log('');
            return success;
        })
        .catch(error => {
            spinner.fail('error!');
            console.error(error);
            return error;
        });
};

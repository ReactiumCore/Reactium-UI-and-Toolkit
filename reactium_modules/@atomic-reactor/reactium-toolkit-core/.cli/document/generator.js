const _ = require('underscore');
const ActionSequence = require('action-sequence');

module.exports = ({ arcli, params, props }) => {
    console.log('');

    const { Hook, Spinner } = arcli;

    Spinner.start();

    const actions = require('./actions')(arcli);
    const options = { arcli, params, props };

    const onError = error => {
        if (_.isError(error)) {
            Spinner.fail(error.message);
        } else {
            Spinner.fail(Object.values(error).join('\n  '));
        }

        return error;
    };

    return ActionSequence({ actions, options })
        .then(success => {
            const message = 'complete!';
            Spinner.succeed(message);
            return success;
        })
        .catch(onError);
};

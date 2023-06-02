import _ from 'underscore';
import { useEffect } from 'react';

const useStateFromProps = ({ state, props, exclude = [] }) => {
    if (!state.get('previous')) state.set('previous', props, false);

    const updateState = () => {
        if (!state.get('controlled', false)) return;

        const isChanged = !_.isEqual(state.get('previous'), props);
        if (!isChanged) return;

        const changed = Object.keys(props)
            .filter((key) => !exclude.includes(key))
            .reduce((obj, key) => {
                const val = props[key];
                if (!_.isEqual(val, state.get(key))) {
                    obj[key] = val;
                }
                return obj;
            }, {});

        changed.previous = props;
        state.set(changed);
    };

    useEffect(updateState, [Object.values(props)]);
};

export { useStateFromProps, useStateFromProps as default };

import _ from 'underscore';
import cn from 'classnames';
import ENUMS from './enums';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
    useHookComponent,
    useRefs,
    useSyncState,
} from '@atomic-reactor/reactium-core/sdk';

const excludeProps = [
    'active',
    'appearance',
    'block',
    'className',
    'color',
    'controlled',
    'debug',
    'element',
    'events',
    'outline',
    'previous',
    'size',
    'style',
];

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Button
 * -----------------------------------------------------------------------------
 */

let Button = ({ children, ...props }, ref) => {
    const refs = useRefs();

    const { useStateFromProps, useSyntheticEvents } = useHookComponent('RUI');

    const state = useSyncState({ ...props, element: null, previous: props });

    const { dispatch, prune } = useSyntheticEvents({
        selected: state.get('events', Button.EVENTS),
        state,
    });

    const _cn = () => {
        const c = _.compact([
            'btn',
            state.get('color', ENUMS.COLOR.PRIMARY),
            state.get('size', ENUMS.SIZE.SM),
            state.get('outline', false) === true ? 'outline' : null,
            state.get('appearance', null),
        ]).join('-');

        return cn(c, state.get('className'), {
            active: state.get('active'),
            'btn-block': state.get('block'),
        });
    };

    const propsFromState = () => {
        const readOnly = state.get('readOnly');

        let output = Object.keys(state.get()).reduce((obj, key) => {
            obj[key] = state.get(key);
            return obj;
        }, {});

        Object.keys(output).forEach((key) => {
            if (key === 'onChange') return;

            if (/^on[A-Z]/.test(key)) {
                const callback = state.get(key);
                output[key] = (e) => dispatch(e, null, callback);
            }
        });

        excludeProps.forEach((key) => {
            if (key === 'readOnly' && readOnly === true) {
                delete output.onClick;
                delete output.type;
            } else {
                delete output[key];
            }
        });

        return output;
    };

    const updateElement = () => {
        const element = refs.get('element');
        state.set('element', element);
    };

    const render = () => {
        const { readOnly, style, type } = state.get();
        const s = { ...style };

        if (readOnly) {
            s['pointerEvents'] = 'none';
            s['userSelect'] = 'none';
            return (
                <span
                    style={s}
                    {...propsFromState()}
                    className={_cn()}
                    tabIndex={-1}
                    children={children}
                    ref={(elm) => refs.set('element', elm)}
                />
            );
        }

        const Element = ENUMS.ELEMENT[String(type).toUpperCase()];

        return (
            <Element
                style={s}
                {...propsFromState()}
                className={_cn()}
                children={children}
                ref={(elm) => refs.set('element', elm)}
            />
        );
    };

    useStateFromProps({ state, props });

    useEffect(updateElement, [refs.get('element')]);

    useEffect(() => {
        return () => {
            const element = refs.get('element');

            refs.set('element', null);
            state.set('element', null);
            prune(element);
        };
    }, []);

    // External Interface
    const extend = () => {
        let elm = state.get('element');

        Object.entries(propsFromState()).forEach(
            ([key, val]) => (state[key] = val),
        );

        if (!elm) {
            state.extend('blur', _.noop());
            state.extend('click', _.noop());
            state.extend('focus', _.noop());
        } else {
            state.extend('blur', () => elm.blur());
            state.extend('click', () => elm.click());
            state.extend('focus', () => elm.focus());
        }
    };

    extend();
    useEffect(extend, [state.get('element')]);
    useImperativeHandle(ref, () => state, []);

    return render();
};

Button = forwardRef(Button);

Object.entries(ENUMS).forEach(([key, val]) => {
    Button[key] = val;
});

Button.ENUMS = ENUMS;

Button.propTypes = {
    active: PropTypes.bool,
    appearance: PropTypes.oneOf(Object.values(ENUMS.APPEARANCE)),
    block: PropTypes.bool,
    color: PropTypes.oneOf(Object.values(ENUMS.COLOR)),
    controlled: PropTypes.bool,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    outline: PropTypes.bool,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOf(Object.values(ENUMS.SIZE)),
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    type: PropTypes.oneOf(Object.values(ENUMS.TYPE)),
};

Button.defaultProps = {
    active: false,
    appearance: null,
    block: false,
    color: ENUMS.COLOR.PRIMARY,
    controlled: false,
    debug: false,
    disabled: false,
    outline: false,
    readOnly: false,
    size: ENUMS.SIZE.SM,
    style: {},
    tabIndex: 0,
    type: ENUMS.TYPE.BUTTON,
};

export { Button, Button as default };

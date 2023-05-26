import _ from 'underscore';
import cn from 'classnames';
import op from 'object-path';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import ENUMS from './enums';

import {
    ComponentEvent,
    useHookComponent,
    useRefs,
    useSyncState,
} from '@atomic-reactor/reactium-core/sdk';

const noop = () => {};

const Ico = (props) => {
    const ico = op.get(props, 'icon');
    const { Icon } = useHookComponent('RUI');

    if (!ico || !Icon) return null;

    if (_.isString(ico)) {
        if (Icon) {
            return (
                <div className='ar-alert-icon'>
                    <Icon value={ico} />
                </div>
            );
        } else {
            return null;
        }
    } else {
        return <div className='ar-alert-icon'>{ico}</div>;
    }
};

const Dismiss = ({ dismissible, ...props }) => {
    const { X } = useHookComponent('RUI');
    return !dismissible ? null : (
        <div className='ar-alert-dismiss'>
            <button {...props} children={<X size={14} />} />
        </div>
    );
};

let Alert = (initialProps, ref) => {
    const {
        autoDismiss,
        children,
        className,
        color,
        controlled = false,
        dismissible,
        icon,
        onDismiss,
        onHide,
        onShow,
        onToggle,
        style = {},
        visible,
        ...props
    } = initialProps;

    const { ColorValidate, useStateFromProps, useSyntheticEvents } =
        useHookComponent('RUI');

    const refs = useRefs();

    const state = useSyncState({
        autoDismiss,
        children,
        className,
        color: ColorValidate(color) ? color : Alert.COLOR.PRIMARY,
        controlled,
        dismissible,
        element: null,
        icon,
        onDismiss,
        onHide,
        onShow,
        onToggle,
        style,
        timer: null,
        visible,
        previous: initialProps,
    });

    useSyntheticEvents({ state, events: Alert.EVENTS });

    useStateFromProps({ state, props: initialProps });

    const dispatch = (type, obj) => {
        type = String(type);
        obj = obj || state.get();
        const evt = new ComponentEvent(type, obj);
        state.dispatchEvent(evt);

        const on = `on${type.charAt(0).toUpperCase()}${type.substr(1)}`;
        const callback = state.get(on);
        if (_.isFunction(callback)) {
            const synth = new ComponentEvent(`${type}-${Date.now()}`, obj);
            state.addEventListener(synth.type, callback);
            state.dispatchEvent(synth);
            state.removeEventListener(synth.type, callback);
        }
    };

    const dismiss = () => {
        hide();
        clearTimer();
        dispatch('dismiss');
    };

    const hide = () => {
        clearTimer(true);
        state.set({ visible: false, timer: null });
    };

    const show = () => {
        clearTimer(true);

        const autoDismiss = state.get('autoDismiss');

        const time = autoDismiss === true ? 5000 : autoDismiss;
        const timer = autoDismiss ? setTimeout(() => dismiss(), time) : null;

        state.set({ visible: true, timer });
    };

    const toggle = () => {
        clearTimer(true);
        state.set({ visible: !state.get('visible') });
    };

    const clearTimer = (noUpdate) => {
        const timer = state.get('timer');
        if (timer) {
            clearTimeout(timer);
            if (noUpdate !== true) state.set({ timer: null });
        }
    };

    state.extend('show', show);
    state.extend('hide', hide);
    state.extend('toggle', toggle);
    state.extend('dismiss', dismiss);

    useImperativeHandle(ref, () => state);

    useEffect(() => {
        const visible = state.get('visible');
        const evt = visible === true ? 'show' : 'hide';
        dispatch(evt);
        dispatch('toggle');
    }, [state.get('visible')]);

    useEffect(() => {
        const newState = {};
        if (state.get('autoDismiss') === true) {
            newState.autoDismiss = 5000;
        } else {
            newState.autoDismiss = state.get('autoDismiss');
        }

        if (newState.autoDismiss) {
            if (state.get('timer')) clearTimeout(state.get('timer'));
            newState.timer = setTimeout(() => dismiss(), newState.autoDismiss);
        }

        if (Object.keys(newState).length > 0) state.set(newState);
    }, [state.get('autoDismiss')]);

    useEffect(() => {
        state.set('element', refs.get('element'));
    }, [refs.get('element')]);

    return (
        <div
            {...props}
            ref={(elm) => refs.set('element', elm)}
            style={{
                ...style,
                display: state.get('visible') === false ? 'none' : null,
            }}
            className={cn(
                'ar-alert',
                `ar-alert-${state.get('color')}`,
                className,
            )}
        >
            <Ico icon={state.get('icon')} />
            <div className='ar-alert-content'>{children}</div>
            <Dismiss
                dismissible={state.get('dismissible')}
                onClick={() => dismiss()}
            />
        </div>
    );
};

Alert = forwardRef(Alert);

Object.entries(ENUMS).forEach(([key, val]) => {
    Alert[key] = val;
});

// Depricated
Alert.ENUMS = ENUMS;

Alert.propTypes = {
    autoDismiss: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    color: PropTypes.string,
    controlled: PropTypes.bool,
    children: PropTypes.node,
    dismissible: PropTypes.bool,
    icon: PropTypes.node,
    onDismiss: PropTypes.func,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    onToggle: PropTypes.func,
    style: PropTypes.object,
    visible: PropTypes.bool,
};

Alert.defaultProps = {
    autoDismiss: false,
    color: Alert.COLOR.PRIMARY,
    controlled: false,
    dismissible: true,
    onDismiss: noop,
    onHide: noop,
    onShow: noop,
    onToggle: noop,
    style: {},
    visible: true,
};

export { Alert };

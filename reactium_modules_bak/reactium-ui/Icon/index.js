import _ from 'underscore';
import cn from 'classnames';
import op from 'object-path';
import Linear from './Linear';
import Feather from './Feather';
import PropTypes from 'prop-types';
import Reactium, {
    ComponentEvent,
    useHookComponent,
    useRefs,
    useSyncState,
} from 'reactium-core/sdk';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
} from 'react';

import ENUMS from './enums';

delete ENUMS.COLOR.CLEAR;

const excludeProps = [
    'namespace',
    'color',
    'controlled',
    'element',
    'namespace',
    'previous',
    'size',
];

const Ico = forwardRef(({ className, value, ...props }, ref) => {
    const narr = _.compact(value.split('.'));
    if (narr.length < 2) return null;
    const g = _.first(value.split('.'));
    const n = _.last(value.split('.'));
    const I = op.get(Icon.Library.listById, [g, 'icons', n]);

    const mapProps = useCallback(
        Object.keys(props).reduce((obj, key) => {
            if (!excludeProps.includes(key)) obj[key] = props[key];
            return obj;
        }, {}),
    );

    return I ? (
        <span className={className} ref={ref}>
            <I {...mapProps} />
        </span>
    ) : null;
});

let Icon = ({ name, value, ...props }, ref) => {
    const refs = useRefs();
    const { useStateFromProps } = useHookComponent('ReactiumUI');

    if (name) {
        console.warn(
            `ReactiumUI.Icon 'name' property deprecated. Use 'value' property instead. <Icon value='${name}' />`,
        );
    }

    const state = useSyncState({
        ...props,
        name: undefined,
        value: value || name,
        element: null,
    });
    state.value = state.get('value');

    useStateFromProps({ state, props, exclude: excludeProps });

    const cname = () => {
        const { className, color, namespace } = state.get();
        return cn({
            [color]: !!color,
            [className]: !!className,
            [namespace]: !!namespace,
        });
    };

    const attr = () => {
        const size = state.get('size');
        return {
            ...state.get(),
            width: size,
            height: size,
            className: cname(),
        };
    };

    const _onChange = (newValue) => {
        state.value = newValue || state.get('value');
        if (newValue) state.set('value', state.value, true);

        const onChange = state.get('onChange');
        const evt = new ComponentEvent('change', {});
        const syn = new ComponentEvent(`change-${Date.now()}`, {});

        state.addEventListener(syn.type, onChange);
        state.dispatchEvent(evt);
        state.dispatchEvent(syn);
        state.removeEventListener(syn.type, onChange);
    };

    useEffect(() => {
        const elm = refs.get('element');
        state.set('element', elm, false);
        state.element = elm;
    }, [refs.get('element')]);

    useEffect(_onChange, [state.get('value')]);

    useEffect(() => {
        if (state.get('controlled') === true) state.set('value', value || name);
    }, [name, value]);

    // External interface
    useImperativeHandle(ref, () => state);

    return <Ico {...attr()} ref={(elm) => refs.set('element', elm)} />;
};

Icon = forwardRef(Icon);

Icon.ENUMS = ENUMS;

Object.entries(ENUMS).forEach(([key, val]) => {
    Icon[key] = val;
});

Icon.Library = Reactium.Utils.registryFactory('RUIcons');

Icon.propTypes = {
    className: PropTypes.string,
    color: PropTypes.oneOf(Object.values(ENUMS.COLOR)),
    controlled: PropTypes.bool,
    name: PropTypes.string,
    namespace: PropTypes.string,
    onChange: PropTypes.func,
    size: PropTypes.number,
    value: PropTypes.string,
};

Icon.defaultProps = {
    controlled: true,
    namespace: 'ar-icon',
    onChange: _.noop,
    size: 24,
    value: null,
};

export { Icon, Feather, Linear };

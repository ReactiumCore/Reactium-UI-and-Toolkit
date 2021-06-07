import React from 'react';
import _ from 'underscore';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Resizable } from 're-resizable';

import Reactium, {
    useEventHandle,
    useEventEffect,
    useHookComponent,
    useRefs,
    useSyncState,
} from 'reactium-core/sdk';

const noop = () => {};
const min = () => 390;
const max = () => (_.isUndefined(window) ? 960 : window.innerWidth - 100);
const width = () => (_.isUndefined(window) ? min() : window.innerWidth * 0.4);

const ComponentDemo = initialProps => {
    const {
        Demo,
        Editor,
        Inspector,
        className,
        value = {},
        onChange = noop,
        id = 'component',
    } = initialProps;

    const refs = useRefs();

    const state = useSyncState({
        attributes: Reactium.Toolkit.parseAttributes(
            Reactium.Prefs.get(`inspector.${id}.attributes`, value),
        ),
        size: Reactium.Prefs.get(`inspector.${id}.size`, { width: width() }),
    });

    const { cx } = Reactium.Toolkit;

    const getAttributes = (exclude = []) =>
        Object.entries(state.get('attributes'))
            .reduce((arr, [key, val]) => {
                if (exclude.includes(key) || val === null || val === false) {
                    return arr;
                }

                if (val === true) {
                    arr.push([key]);
                } else {
                    arr.push([key, String(`'${val}'`)].join('='));
                }

                return arr;
            }, [])
            .join(' ');

    const setAttributes = (newAttr = {}) => {
        const attributes = state.get('attributes');
        setState('attributes', { ...attributes, ...newAttr });
    };

    const setState = (...newState) => {
        if (unMounted()) return;
        state.set(...newState);
        Reactium.Prefs.set(`inspector.${id}`, state.get());
    };

    const setWidth = value => {
        if (unMounted()) return;
        const w = state.get('size.width', width()) + value;
        setState('size.width', w);
    };

    const unMounted = () => !refs.get('container');

    const _handle = () => ({
        attributes: state.get('attributes'),
        getAttributes,
        setAttributes,
        setState,
        state,
    });

    const _onChange = () => {
        handle['attributes'] = state.get('attributes');
        handle.dispatchEvent(new Event('change'));
        onChange(handle);
        setHandle(handle);
    };

    const [handle, setHandle] = useEventHandle(_handle());

    useEventEffect(state, { set: _onChange }, []);

    return !Demo || !Editor || !Inspector ? null : (
        <div
            ref={elm => refs.set('container', elm)}
            className={cn(className, cx('component'))}>
            <ResizeWrap
                handle={handle}
                setWidth={setWidth}
                size={state.get('size')}
                className={cx('component-inspector')}>
                <div className={cx('component-demo-wrap')}>
                    <Demo handle={handle} />
                </div>
                <div className={cx('component-props-wrap')}>
                    <Inspector handle={handle} />
                </div>
            </ResizeWrap>
            <div className={cx('component-code-wrap')}>
                <Editor handle={handle} />
            </div>
        </div>
    );
};

ComponentDemo.propTypes = {
    className: PropTypes.string,
};

const ResizeWrap = ({ children, className, size, setWidth }) => {
    const { Breakpoint } = useHookComponent('ReactiumUI');
    return (
        <Breakpoint
            xs={<div className={className}>{children}</div>}
            lg={
                <Resizable
                    size={size}
                    minWidth={min()}
                    maxWidth={max()}
                    children={children}
                    className={className}
                    handleStyles={{ right: { width: 15 } }}
                    onResizeStop={(e, dir, ref, s) => setWidth(s.width)}
                    handleClasses={{
                        top: 'handle-hidden',
                        topRight: 'handle-hidden',
                        topLeft: 'handle-hidden',
                        bottom: 'handle-hidden',
                        bottomRight: 'handle-hidden',
                        bottomLeft: 'handle-hidden',
                        left: 'handle-hidden',
                        right: 'handle-right',
                    }}
                />
            }
        />
    );
};

export { ComponentDemo, ComponentDemo as default };

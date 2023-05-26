import cn from 'classnames';
import op from 'object-path';
import _ from 'underscore';
import { Scrollbars } from 'react-custom-scrollbars';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import Reactium, {
    ComponentEvent,
    useDerivedState,
    useEventHandle,
    useHookComponent,
    useIsContainer,
    useRefs,
} from 'reactium-core/sdk';

const defaultButtonProps = () => ({ block: true, size: 'sm' });

const noop = () => {};

let ColorSelect = (
    {
        buttonProps,
        className,
        colors: initialColors,
        onChange = noop,
        ...props
    },
    ref,
) => {
    const { cx } = Reactium.Toolkit;

    const refs = useRefs();

    // TODO: Does this belong in toolkit core? RUI might not be in use.
    const { ColorNames, Button } = useHookComponent('RUI');

    const isContainer = useIsContainer();

    const [state, update] = useDerivedState({
        colors:
            initialColors || (ColorNames && Object.keys(ColorNames())) || [],
        collapsed: true,
        buttonProps: buttonProps || defaultButtonProps(),
        expanded: false,
        value: props.value,
    });

    const setState = (newState) => {
        if (unMounted()) return;
        update(newState);
    };

    const collapse = () => {
        dispatch('collapse');
        setState({ collapsed: true, expanded: false });
    };

    const dismiss = (e) => {
        dispatch('dismiss');
        if (!e) return collapse();
        if (state.collapsed === true) return;
        const container = refs.get('container');
        if (isContainer(e.target, container)) return;

        collapse();
    };

    const dispatch = (type, data = {}) => {
        if (unMounted()) return;
        const evt = new ComponentEvent(type, data);
        handle.dispatchEvent(evt);
    };

    const expand = () => {
        dispatch('expand');
        setState({ collapsed: false, expanded: true });
    };

    const toggle = () => {
        if (state.expanded === true) {
            collapse();
        } else {
            expand();
        }
    };

    const select = (value) => {
        collapse();
        setState({ value });
        onChange({ target: { value } });
    };

    const esc = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cont = refs.get('container');
        if (!cont) return;
        collapse();
        cont.focus();
    };

    const unMounted = () => !refs.get('container');

    const _onBlur = (e) => {
        e.event.target.style.opacity = 1;
    };

    const _onFocus = (e) => {
        e.event.target.style.opacity = 0.8;
    };

    const _onChange = (e, value) => {
        e.event.preventDefault();
        e.event.stopPropagation();

        select(value);
    };

    const _onButtonKeyDown = (e, value, i) => {
        const keyCode = e.event.keyCode;
        if (keyCode === 13) {
            e.event.preventDefault();
            e.event.stopPropagation();
            select(value);
            const cont = refs.get('container');
            if (cont) cont.focus();
        }

        if (keyCode === 38 || keyCode === 40) {
            e.event.preventDefault();
            e.event.stopPropagation();

            let inc = keyCode === 38 ? i - 1 : i + 1;
            inc = inc < 0 ? state.colors.length - 1 : inc;
            inc = inc >= state.colors.length ? 0 : inc;

            const btn = refs.get(`colorBtn${inc}`);
            if (!btn) return;
            expand();
            btn.focus();
        }

        if (keyCode === 27) esc(event);
    };

    const _onKeyDown = (e) => {
        if (e.keyCode === 27) esc(e);

        if (e.keyCode === 13 || e.keyCode === 40) {
            e.preventDefault();
            expand();
        }

        if (e.keyCode === 40) {
            const btn = refs.get('colorBtn0');
            if (btn) {
                btn.focus();
            }
        }
    };

    const _handle = () => ({
        ...state,
        collapse,
        dismiss,
        dispatch,
        expand,
        toggle,
        setState,
        state,
    });

    const [handle, setHandle] = useEventHandle(() => _handle());
    const updateHandle = () => {
        if (unMounted()) return;
        const _newHandle = _handle();
        Object.entries(_newHandle).forEach(([k, v]) => op.set(handle, k, v));
        setHandle(handle);
    };

    useEffect(() => {
        setState({ value: props.value });
    }, [props.value]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        window.addEventListener('mousedown', dismiss);
        window.addEventListener('touchstart', dismiss);

        return () => {
            window.removeEventListener('mousedown', dismiss);
            window.removeEventListener('touchstart', dismiss);
        };
    }, []);

    useEffect(() => {
        updateHandle();
    }, [Object.values(state)]);

    useEffect(() => {
        dispatch('change', { value: state.value });
    }, [state.value]);

    useEffect(() => {
        dispatch('collapsed');
    }, [state.collapsed]);

    useEffect(() => {
        dispatch('expanded');
    }, [state.expanded]);

    useImperativeHandle(ref, () => handle);

    return (
        <div
            {...props}
            tabIndex={0}
            onClick={toggle}
            title={state.value}
            onKeyDown={_onKeyDown}
            ref={(elm) => refs.set('container', elm)}
            className={cn(cx('btn-color-select'), className, {
                expanded: state.expanded,
            })}
        >
            <div className={cx('btn-color-select-selected')} tabIndex={-1}>
                <Button readOnly color={state.value} tabIndex={-1} controlled />
                <span className={cx('btn-color-select-label')}>
                    {state.value}
                </span>
            </div>
            <div
                tabIndex={-1}
                className={cx('btn-color-select-picker')}
                style={{ display: state.collapsed ? 'none' : null }}
            >
                <Scrollbars>
                    <div className={cx('btn-color-select-picker-list')}>
                        {state.colors.map((c, i) => (
                            <Button
                                color={c}
                                value={c}
                                title={c}
                                key={`select-${i}`}
                                {...state.buttonProps}
                                onBlur={_onBlur}
                                onFocus={_onFocus}
                                onClick={(e) => _onChange(e, c)}
                                onKeyDown={(e) => _onButtonKeyDown(e, c, i)}
                                ref={(elm) => refs.set(`colorBtn${i}`, elm)}
                            >
                                <span className={cx('btn-color-select-label')}>
                                    {c}
                                </span>
                            </Button>
                        ))}
                    </div>
                </Scrollbars>
                <div className='arrow-up' />
            </div>
        </div>
    );
};

ColorSelect = forwardRef(ColorSelect);

export { ColorSelect, ColorSelect as default };

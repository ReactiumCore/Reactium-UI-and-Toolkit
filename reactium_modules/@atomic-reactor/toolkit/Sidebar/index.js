import cn from 'classnames';
import op from 'object-path';
import { Scrollbars } from 'react-custom-scrollbars';
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import Reactium, {
    ComponentEvent,
    Zone,
    useDerivedState,
    useEventHandle,
    useRefs,
    useRegisterHandle,
} from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Sidebar
 * -----------------------------------------------------------------------------
 */
let Sidebar = (props, ref) => {
    const pref = 'rtk.sidebar.collapsed';

    const { config, cx } = Reactium.Toolkit;

    const pos = op.get(
        config,
        'sidebar.position',
        Reactium.Toolkit.Sidebar.position.left,
    );

    const refs = useRefs();

    const [state, update] = useDerivedState({
        ease: Power2.easeInOut,
        speed: 0.25,
        tween: null,
        width: op.get(config, 'sidebar.width', 320),
        expanded: !op.get(config, 'sidebar.collapsed', false),
        collapsed: op.get(config, 'sidebar.collapsed', false),
    });

    const setState = (newState, silent = false) => {
        if (unMounted()) return;
        update(newState, silent);
    };

    const dispatch = (eventType, event = {}) => {
        if (unMounted()) return;

        eventType = String(eventType).toLowerCase();

        const evt = new ComponentEvent(eventType, event);

        handle.dispatchEvent(evt);

        Reactium.Hook.run(`rtk-${eventType}`, evt, handle);
        Reactium.Hook.runSync(`rtk-${eventType}`, evt, handle);
        Reactium.Toolkit.notify(eventType, { target: handle, ...event });
    };

    const collapse = () =>
        new Promise(resolve => {
            dispatch('collapse');
            const cont = refs.get('container');

            cont.style.minWidth = 0;
            cont.style.display = 'block';
            cont.style.overflow = 'hidden';
            cont.classList.remove('collapsed');

            TweenMax.to(cont, state.speed, {
                width: 0,
                ease: state.ease,
                onComplete: () => {
                    if (unMounted()) resolve(false);

                    cont.removeAttribute('style');
                    setState({ expanded: false, collapsed: true, tween: null });
                    resolve(true);
                },
                onUpdate: () => dispatch('resize', { width: cont.style.width }),
            });
        });

    const expand = () =>
        new Promise(resolve => {
            dispatch('expand');
            document.body.setAttribute('data-expand', true);

            const cont = refs.get('container');
            const w = `${state.width}px`;

            cont.style.maxWidth = w;
            cont.style.minWidth = 0;
            cont.style.display = 'block';
            cont.style.overflow = 'hidden';
            cont.classList.remove('collapsed');

            TweenMax.to(cont, state.speed, {
                width: state.width,
                ease: state.ease,
                onComplete: () => {
                    if (unMounted()) resolve(false);

                    cont.removeAttribute('style');
                    cont.style.maxWidth = w;
                    cont.style.minWidth = w;
                    setState({ expanded: true, collapsed: false, tween: null });
                    resolve();
                },
                onUpdate: () => dispatch('resize', { width: cont.style.width }),
            });
        });

    const toggle = () => {
        const tween = state.tween
            ? state.tween
            : state.collapsed === true
            ? expand()
            : collapse();

        setState({ tween });
        return tween;
    };

    const unMounted = () => !refs.get('container');

    // -------------------------------------------------------------------------
    // Handle
    // -------------------------------------------------------------------------
    const _handle = () => ({
        collapse,
        collapsed: state.collapsed,
        expand,
        expanded: !state.collapsed,
        setWidth: width => setState({ width }),
        toggle,
        width: state.width,
    });

    const [handle, updateHandle] = useEventHandle(_handle());
    const setHandle = newHandle => {
        if (unMounted()) return;
        updateHandle(newHandle);
    };

    useEffect(() => {
        const type = state.collapsed === true ? 'collapsed' : 'expanded';
        Reactium.Prefs.set(pref, state.collapsed);

        const newHandle = {
            ...handle,
            collapsed: state.collapsed,
            expanded: !state.collapsed,
        };

        setHandle(newHandle);

        dispatch(type);
    }, [state.collapsed]);

    useEffect(() => {
        const newHandle = { ...handle, width: state.width };
        setHandle(newHandle);
    }, [state.width]);

    useEffect(
        () =>
            Reactium.Toolkit.subscribe('config', ({ value }) => {
                const { width } = value.sidebar;
                if (width !== state.width) setState({ width });
            }),
        [],
    );

    useEffect(() => {
        if (state.collapsed === true) {
            document.body.removeAttribute('data-expand');
            document.body.removeAttribute('data-expanded');
            document.body.removeAttribute('data-collapse');
            document.body.setAttribute('data-collapsed', true);
        } else {
            document.body.removeAttribute('data-collapsed');
        }
    }, [state.collapsed]);

    useEffect(() => {
        if (state.expanded === true) {
            document.body.removeAttribute('data-collapse');
            document.body.removeAttribute('data-collapsed');
            document.body.removeAttribute('data-expand');
            document.body.setAttribute('data-expanded', true);
        } else {
            document.body.removeAttribute('data-expanded');
        }
    }, [state.expanded]);

    useEffect(() => {
        // Register hotkey
        Reactium.Toolkit.Hotkeys.register('sidebar', {
            hotkey: 'mod+\\',
            keydown: () => toggle(),
        });

        return () => {
            // Unregister hotkey
            Reactium.Toolkit.Hotkeys.unregister('sidebar');
        };
    }, [Sidebar]);

    useImperativeHandle(ref, () => handle, [state.collapsed]);

    useRegisterHandle('RTKSidebar', () => handle);

    return (
        <nav
            ref={elm => refs.set('container', elm)}
            style={{ maxWidth: state.width, minWidth: state.width }}
            className={cn({
                collapsed: state.collapsed,
                [cx('sidebar')]: true,
                [pos]: true,
            })}>
            <div
                className={cx('sidebar-wrapper')}
                style={{ maxWidth: state.width }}>
                <div className={cx('sidebar-brand')}>
                    <Zone zone='sidebar-brand' />
                </div>
                <NavLinks width={state.width} />
            </div>
        </nav>
    );
};

const NavLinks = ({ width }) => {
    const { cx, useLinks } = Reactium.Toolkit;
    const [list] = useLinks();

    return (
        <div style={{ maxWidth: width }} className={cx('sidebar-menu')}>
            <Scrollbars className={cx('sidebar-menu-list')}>
                {list.map(({ component: Component, ...item }) => (
                    <Component key={item.id} {...item} />
                ))}
            </Scrollbars>
        </div>
    );
};

Sidebar = forwardRef(Sidebar);

export default Sidebar;

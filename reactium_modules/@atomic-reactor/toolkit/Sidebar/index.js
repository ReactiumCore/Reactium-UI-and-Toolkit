import gsap from 'gsap';
import cn from 'classnames';
import op from 'object-path';
import { Scrollbars } from 'react-custom-scrollbars';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import Reactium, {
    ComponentEvent,
    Zone,
    useRegisterSyncHandle,
    useRefs,
} from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Sidebar
 * -----------------------------------------------------------------------------
 */
let Sidebar = (props, ref) => {
    const { config, cx } = Reactium.Toolkit;

    const pref = 'rtk.sidebar.collapsed';

    const refs = useRefs();

    const state = useRegisterSyncHandle('RTKSidebar', {
        refs,
        ease: 'power2.inOut',
        speed: 0.25,
        tween: null,
        width: op.get(config, 'sidebar.width', 320),
        position: op.get(config, 'sidebar.position', 'left'),
        expanded: !op.get(config, 'sidebar.collapsed', false),
        collapsed: op.get(config, 'sidebar.collapsed', false),
    });

    const setState = newState => {
        if (unMounted()) return;
        state.set(newState);
    };

    const dispatch = (eventType, event = {}) => {
        if (unMounted()) return;

        eventType = String(eventType).toLowerCase();

        const evt = new ComponentEvent(eventType, event);

        state.dispatchEvent(evt);
        Reactium.Hook.run(`rtk-${eventType}`, evt, state);
        Reactium.Hook.runSync(`rtk-${eventType}`, evt, state);
        Reactium.Toolkit.notify(eventType, { target: state, ...event });
    };

    const collapse = () =>
        new Promise(resolve => {
            dispatch('collapse');
            const cont = refs.get('container');

            cont.style.minWidth = 0;
            cont.style.display = 'block';
            cont.style.overflow = 'hidden';
            cont.classList.remove('collapsed');

            dispatch('before-collapse');

            gsap.to(cont, {
                width: 0,
                ease: state.get('ease'),
                duration: state.get('speed'),
                onComplete: () => {
                    if (unMounted()) resolve(false);

                    cont.removeAttribute('style');
                    Reactium.Prefs.set(pref, true);
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
            const w = `${state.get('width')}px`;

            cont.style.maxWidth = w;
            cont.style.minWidth = 0;
            cont.style.display = 'block';
            cont.style.overflow = 'hidden';
            cont.classList.remove('collapsed');

            dispatch('before-expand');

            gsap.to(cont, {
                width: state.get('width'),
                ease: state.get('ease'),
                duration: state.get('speed'),
                onComplete: () => {
                    if (unMounted()) resolve(false);

                    cont.removeAttribute('style');
                    cont.style.maxWidth = w;
                    cont.style.minWidth = w;
                    Reactium.Prefs.set(pref, false);
                    setState({ expanded: true, collapsed: false, tween: null });

                    resolve();
                },
                onUpdate: () => dispatch('resize', { width: cont.style.width }),
            });
        });

    const toggle = () => {
        const tween = state.get('tween')
            ? state.get('tween')
            : state.get('collapsed') === true
            ? expand()
            : collapse();

        setState({ tween });
        return tween;
    };

    const unMounted = () => !refs.get('container');

    const applyPrefs = () => {
        const collapsed = Reactium.Prefs.get('rtk.sidebar.collapsed', false);
        const position = Reactium.Prefs.get('rtk.sidebar.position', 'left');
        const width = Reactium.Prefs.get('rtk.sidebar.width', 320);

        setState({
            collapsed: collapsed,
            expanded: !collapsed,
            width,
            position,
        });
    };

    useEffect(() => {
        const type = state.get('collapsed') === true ? 'collapsed' : 'expanded';
        dispatch(type);
    }, [state.get('collapsed'), state.get('expanded')]);

    useEffect(
        () =>
            Reactium.Toolkit.subscribe('config', ({ value }) => {
                const { width } = value.sidebar;
                if (width !== state.get('width')) setState({ width });
            }),
        [],
    );

    useEffect(() => {
        if (state.expanded === true) {
            document.body.removeAttribute('data-collapse');
            document.body.removeAttribute('data-collapsed');
            document.body.removeAttribute('data-expand');
            document.body.setAttribute('data-expanded', true);
        } else {
            document.body.removeAttribute('data-expanded');
        }

        if (state.collapsed === true) {
            document.body.removeAttribute('data-expand');
            document.body.removeAttribute('data-expanded');
            document.body.removeAttribute('data-collapse');
            document.body.setAttribute('data-collapsed', true);
        } else {
            document.body.removeAttribute('data-collapsed');
        }
    });

    useEffect(() => {
        state.expanded = state.get('expanded');
        state.collapsed = state.get('collapsed');
        state.width = state.get('width');
    });

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
    }, []);

    useEffect(applyPrefs, [state.get('collapsed'), state.get('expanded')]);

    useImperativeHandle(ref, () => state, []);

    // -------------------------------------------------------------------------
    // External Interface
    // -------------------------------------------------------------------------
    state.extend('collapse', collapse);
    state.extend('expand', expand);
    state.extend('setWidth', width => setState({ width }));
    state.extend('toggle', toggle);
    state.collapsed = state.get('collapsed');
    state.expanded = state.get('expanded');
    state.width = state.get('width');

    return (
        <nav
            ref={elm => refs.set('container', elm)}
            style={{
                maxWidth: state.get('width'),
                minWidth: state.get('width'),
            }}
            className={cn({
                collapsed: state.get('collapsed'),
                [state.get('position')]: true,
                [cx('sidebar')]: true,
            })}>
            <div
                className={cx('sidebar-wrapper')}
                style={{ maxWidth: state.get('width') }}>
                <div className={cx('sidebar-brand')}>
                    <Zone zone='sidebar-brand' />
                </div>
                <NavLinks width={state.get('width')} />
            </div>
        </nav>
    );
};

const NavLinks = ({ width }) => {
    const { cx, useLinks } = Reactium.Toolkit;
    const [list] = useLinks();

    const maxWidth = width;

    return (
        <div style={{ maxWidth }} className={cx('sidebar-menu')}>
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

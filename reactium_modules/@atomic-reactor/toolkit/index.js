import _ from 'underscore';
import op from 'object-path';
import PropTypes from 'prop-types';
import React, { forwardRef, useImperativeHandle, useEffect } from 'react';

import Reactium, {
    ComponentEvent,
    useDerivedState,
    useEventHandle,
    useRefs,
    useStatus,
} from 'reactium-core/sdk';

import Sidebar from './Sidebar';
import Content from './Content';

/**
 * -----------------------------------------------------------------------------
 * Hook Component: Toolkit
 * -----------------------------------------------------------------------------
 */
let Toolkit = ({ state: initialState, ...props }, ref) => {
    const ENUMS = Reactium.Toolkit.ENUMS;

    // -------------------------------------------------------------------------
    // Refs
    // -------------------------------------------------------------------------
    const refs = useRefs();

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    const [state, update] = useDerivedState(initialState);
    const setState = newState => {
        if (unMounted()) return;
        update(newState);
    };

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------
    const [status, setStatus, isStatus] = useStatus(ENUMS.STATUS.PENDING);

    // -------------------------------------------------------------------------
    // Internal Interface
    // -------------------------------------------------------------------------
    const cx = Reactium.Toolkit.cx;

    const dispatch = async (eventType, event = {}) => {
        if (unMounted()) return;

        eventType = String(eventType).toLowerCase();

        const evt = new ComponentEvent(eventType, event);

        handle.dispatchEvent(evt);
        Reactium.Hook.run(`rtk-${eventType}`, evt, handle);
        await Reactium.Hook.runSync(`rtk-${eventType}`, evt, handle);
    };

    const initialize = async () => {
        // SET STATUS TO INITIALIZING
        setStatus(ENUMS.STATUS.INITIALIZING, true);

        // DO YOUR INITIALIZATION HERE

        // SET STATUS TO INITIALIZED WHEN COMPLETE
        _.defer(() => setStatus(ENUMS.STATUS.INITIALIZED, true));
    };

    const unMounted = () => !refs.get('container');

    // -------------------------------------------------------------------------
    // Handle
    // -------------------------------------------------------------------------
    const _handle = () => ({
        cx,
        dispatch,
        isStatus,
        props,
        setState,
        setStatus,
        state,
        status,
        unMounted,
    });
    const [handle, setHandle] = useEventHandle(_handle());
    const updateHandle = () => {
        let newHandle = { ...handle };

        Object.entries(_handle()).forEach(([key, val]) =>
            op.set(newHandle, key, val),
        );

        setHandle(newHandle);
    };

    useImperativeHandle(ref, () => handle, [handle]);

    // -------------------------------------------------------------------------
    // Side effects
    // -------------------------------------------------------------------------
    // Status change
    useEffect(() => {
        dispatch('status', { status });

        if (isStatus(ENUMS.STATUS.PENDING)) {
            initialize();
        }

        updateHandle();
    }, [status]);

    return (
        <main ref={elm => refs.set('container', elm)} className={cx()}>
            <Sidebar />
            <Content />
        </main>
    );
};

Toolkit = forwardRef(Toolkit);

Toolkit.propTypes = {
    state: PropTypes.object,
};

Toolkit.defaultProps = {
    state: {},
};

export { Toolkit, Toolkit as default };

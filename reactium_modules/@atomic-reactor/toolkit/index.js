import _ from 'underscore';
// import op from 'object-path';
import PropTypes from 'prop-types';
import React from 'react';

import Reactium, {
    ComponentEvent,
    useRegisterSyncHandle,
    useEventEffect,
    useRefs,
} from 'reactium-core/sdk';

import Sidebar from './Sidebar';
import Content from './Content';

/**
 * -----------------------------------------------------------------------------
 * Hook Component: Toolkit
 * -----------------------------------------------------------------------------
 */
const Toolkit = ({ state: initialState, ...props }) => {
    const ENUMS = Reactium.Toolkit.ENUMS;

    // -------------------------------------------------------------------------
    // Refs
    // -------------------------------------------------------------------------
    const refs = useRefs();

    // -------------------------------------------------------------------------
    // Handle
    // -------------------------------------------------------------------------

    const handle = useRegisterSyncHandle('Toolkit', {
        ...initialState,
        props,
        status: ENUMS.STATUS.PENDING,
    });

    // -------------------------------------------------------------------------
    // Internal Interface
    // -------------------------------------------------------------------------
    const cx = Reactium.Toolkit.cx;
    handle.extend('cx', cx);

    handle.extend('dispatch', async (eventType, event = {}) => {
        if (unMounted()) return;

        eventType = String(eventType).toLowerCase();

        const evt = new ComponentEvent(eventType, event);

        handle.dispatchEvent(evt);
        Reactium.Hook.run(`rtk-${eventType}`, evt, handle);
        await Reactium.Hook.runSync(`rtk-${eventType}`, evt, handle);
    });

    const dispatch = handle.dispatch;

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------
    handle.extend('setStatus', status => {
        handle.set('status', status);
        dispatch('status', { status: handle.get('status') });
    });
    handle.extend('isStatus', status => handle.get('status') === status);

    const isStatus = handle.setStatus;
    const setStatus = handle.isStatus;

    handle.extend('initialize', async () => {
        // SET STATUS TO INITIALIZING
        setStatus(ENUMS.STATUS.INITIALIZING, true);

        // DO YOUR INITIALIZATION HERE

        // SET STATUS TO INITIALIZED WHEN COMPLETE
        _.defer(() => setStatus(ENUMS.STATUS.INITIALIZED, true));
    });
    const initialize = handle.initialize;

    handle.extend('unMounted', () => !refs.get('container'));
    const unMounted = handle.unMounted;

    // -------------------------------------------------------------------------
    // Side effects
    // -------------------------------------------------------------------------
    // Status change
    useEventEffect(
        handle,
        {
            status: ({ status }) => {
                if (isStatus(ENUMS.STATUS.PENDING)) {
                    initialize();
                }
            },
        },
        [],
    );

    return (
        <main ref={elm => refs.set('container', elm)} className={cx()}>
            <Sidebar />
            <Content />
        </main>
    );
};

Toolkit.propTypes = {
    state: PropTypes.object,
};

Toolkit.defaultProps = {
    state: {},
};

export { Toolkit, Toolkit as default };

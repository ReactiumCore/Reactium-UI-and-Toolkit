import _ from 'underscore';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import Reactium, {
    ComponentEvent,
    useRegisterSyncHandle,
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
        refs,
        status: ENUMS.STATUS.PENDING,
    });

    // -------------------------------------------------------------------------
    // Internal Interface
    // -------------------------------------------------------------------------
    handle.extend('cx', Reactium.Toolkit.cx);

    handle.extend('dispatch', async (eventType, event = {}) => {
        if (handle.unMounted()) return;

        eventType = String(eventType).toLowerCase();

        const evt = new ComponentEvent(eventType, event);

        handle.dispatchEvent(evt);
        Reactium.Hook.run(`rtk-${eventType}`, evt, handle);
        await Reactium.Hook.runSync(`rtk-${eventType}`, evt, handle);
    });

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------
    handle.extend('setStatus', status => {
        handle.set('status', status);
        handle.dispatch('status', { status: handle.get('status') });
    });

    handle.extend('isStatus', status => {
        const current = handle.get('status');
        const statuses = _.flatten([status]);
        return statuses.includes(current);
    });

    handle.extend('initialize', () => {
        if (!handle.isStatus(ENUMS.STATUS.PENDING)) return;
        // SET STATUS TO INITIALIZING
        _.defer(() => handle.setStatus(ENUMS.STATUS.INITIALIZING));
    });

    handle.extend('unMounted', () => !refs.get('container'));

    // -------------------------------------------------------------------------
    // Side effects
    // -------------------------------------------------------------------------
    useEffect(handle.initialize, [handle.get('status')]);

    return (
        <main ref={elm => refs.set('container', elm)} className={handle.cx()}>
            <div className={handle.cx('left-column')}>
                <Sidebar />
            </div>
            <div className={handle.cx('right-column')}>
                <Content />
            </div>
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

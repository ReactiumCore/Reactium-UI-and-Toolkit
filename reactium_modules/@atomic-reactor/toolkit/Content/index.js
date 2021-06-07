import Toolbar from '../Toolbar';
import React, { useEffect, useState } from 'react';
import Reactium, { useHandle, useStatus } from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Content
 * -----------------------------------------------------------------------------
 */
const Content = () => {
    const { config, cx, zone, useElements, ENUMS } = Reactium.Toolkit;

    const Sidebar = useHandle('RTKSidebar');

    const [, setStatus, isStatus] = useStatus(ENUMS.STATUS.READY);

    const [width, setWidth] = useState();

    const [elements] = useElements({ zone });

    const onResize = ({ width }) => setWidth(`calc(100vw - ${width})`);

    const onScroll = e => {
        if (e.target.scrollLeft > 0 && Sidebar.expanded) {
            if (!isStatus(ENUMS.STATUS.READY)) return;
            setStatus(ENUMS.STATUS.BUSY, true);
            Sidebar.collapse().then(() => setStatus(ENUMS.STATUS.READY, true));
        }
    };

    useEffect(() => {
        if (!Sidebar) return;

        if (Sidebar.expanded) {
            setWidth(`calc(100vw - ${config.sidebar.width}px)`);
        } else {
            setWidth('100vw');
        }

        Sidebar.addEventListener('resize', onResize);

        return () => {
            Sidebar.removeEventListener('resize', onResize);
        };
    }, [Sidebar]);

    return !width ? null : (
        <div className={cx('content')}>
            <Toolbar />
            <div
                data-zone={zone}
                style={{ maxWidth: width, minWidth: width }}
                onScroll={onScroll}
                className={cx('content-zone', `content-zone-${zone}`)}>
                <div className={cx('content-zone-scroll')}>
                    {elements.map(({ component: Component, id }) => (
                        <Component key={`${zone}-element-${id}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Content;

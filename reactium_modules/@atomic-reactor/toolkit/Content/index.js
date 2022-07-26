import Toolbar from '../Toolbar';
import React, { useEffect, useState } from 'react';
import Reactium, { useHandle, useStatus } from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Content
 * -----------------------------------------------------------------------------
 */
const Content = () => {
    const { cx, zone, useElements, ENUMS } = Reactium.Toolkit;

    const Sidebar = useHandle('RTKSidebar');

    const [, setStatus, isStatus] = useStatus(ENUMS.STATUS.READY);

    const [width, setWidth] = useState();

    const [route, setRoute] = useState(
        Reactium.Routing.currentRoute.location.pathname,
    );

    const [elements] = useElements({ zone });

    const style = {
        maxWidth: width,
        minWidth: width,
        overflow: isStatus(ENUMS.STATUS.BUSY) ? 'hidden' : null,
    };

    const scrollTop = () => {
        if (!window) return;
        window.scrollTo(0, 0);
    };

    const onResize = ({ width }) => setWidth(`calc(100vw - ${width})`);

    const onRouteChange = () => {
        const newRoute = Reactium.Routing.currentRoute.location.pathname;
        if (newRoute === route) return;

        setRoute(newRoute);
    };

    const onScroll = async e => {
        if (e.target.scrollLeft > 0 && Sidebar.expanded) {
            if (!isStatus(ENUMS.STATUS.READY)) return;
            setStatus(ENUMS.STATUS.BUSY, true);
            await Sidebar.collapse();
            setStatus(ENUMS.STATUS.READY, true);
        }
    };

    const onSidebarChange = () => {
        if (!Sidebar) return;

        if (Sidebar.expanded) {
            setWidth(`calc(100vw - ${Sidebar.width}px)`);
        } else {
            setWidth('100vw');
        }

        Sidebar.addEventListener('resize', onResize);

        return () => {
            Sidebar.removeEventListener('resize', onResize);
        };
    };

    useEffect(onSidebarChange, [Sidebar, Sidebar.expanded, Sidebar.width]);

    useEffect(onRouteChange, [Reactium.Routing.currentRoute.location.pathname]);

    useEffect(scrollTop, [route]);

    return !width ? null : (
        <div className={cx('content')}>
            <Toolbar />
            <div
                style={style}
                data-zone={zone}
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

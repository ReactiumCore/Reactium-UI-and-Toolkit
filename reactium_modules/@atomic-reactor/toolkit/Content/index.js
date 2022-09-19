import _ from 'underscore';
import Toolbar from '../Toolbar';
import React, { useEffect, useState } from 'react';
import Reactium, { useHandle, useRefs } from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Content
 * -----------------------------------------------------------------------------
 */
const Content = () => {
    const refs = useRefs();

    const { cx, zone, useElements } = Reactium.Toolkit;

    const Sidebar = useHandle('RTKSidebar');

    const [route, setRoute] = useState(
        Reactium.Routing.currentRoute.location.pathname,
    );

    const [elements] = useElements({ zone });

    const scrollTop = () => {
        const elm = refs.get('zone');
        if (elm) elm.scroll(0, 0);
    };

    const onRouteChange = () => {
        const newRoute = Reactium.Routing.currentRoute.location.pathname;
        if (newRoute === route) return;

        setRoute(newRoute);
    };

    const expand = () => Sidebar.expand();

    useEffect(onRouteChange, [Reactium.Routing.currentRoute.location.pathname]);

    useEffect(scrollTop, [route]);

    return (
        <div className={cx('content')}>
            <Toolbar />
            <div
                data-zone={zone}
                ref={elm => refs.set('zone', elm)}
                className={cx('content-zone', `content-zone-${zone}`)}>
                {elements.map(({ component: Component, id }) => (
                    <Component key={`${zone}-element-${id}`} />
                ))}
            </div>
            <div
                onMouseEnter={expand}
                className={cx('content-sidebar-toggle')}
            />
        </div>
    );
};

export default Content;

import _ from 'underscore';
import Toolbar from '../Toolbar';
import React, { useEffect } from 'react';
import Reactium, { useHandle, useRefs, useRouting } from 'reactium-core/sdk';
import slugify from 'slugify';

const useLocation = () => {
    const Routing = useRouting();
    const location = Routing.get('active.location');
    const params = Routing.get('active.params');
    return { location, params };
};

const useZone = () => {
    const { location, params } = useLocation();

    const { pathname } = location;
    const { group, slug, sub } = params;

    if (String(pathname).startsWith('/toolbar/search')) return 'search';

    const zone = !group ? ['overview'] : _.compact([group, slug, sub]);

    return slugify(zone.join('-'), { lower: true });
};

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Content
 * -----------------------------------------------------------------------------
 */
const Content = () => {
    const Routing = useRouting();
    const route = Routing.get('active.location.pathname');
    const refs = useRefs();

    const { cx, useElements } = Reactium.Toolkit;
    const zone = useZone();

    const Sidebar = useHandle('RTKSidebar');

    const [elements] = useElements({ zone });

    const scrollTop = () => {
        const elm = refs.get('zone');
        if (elm) elm.scroll(0, 0);
    };

    const expand = () => Sidebar.expand();

    useEffect(scrollTop, [route]);

    return (
        <div className={cx('content')}>
            <Toolbar />
            <div
                data-zone={zone}
                ref={(elm) => refs.set('zone', elm)}
                className={cx('content-zone', `content-zone-${zone}`)}
            >
                {elements.map(({ component: Component, id }) => {
                    return <Component key={`${zone}-element-${id}`} />;
                })}
            </div>
            <div
                onMouseEnter={expand}
                className={cx('content-sidebar-toggle')}
            />
        </div>
    );
};

export default Content;

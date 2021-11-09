import _ from 'underscore';
import cn from 'classnames';
import op from 'object-path';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Reactium, { useHookComponent } from 'reactium-core/sdk';

const propTypes = {
    children: PropTypes.node.isRequired,
    exact: PropTypes.bool,
    expanded: PropTypes.bool,
    group: PropTypes.string,
    id: PropTypes.string.isRequired,
    url: PropTypes.string,
};

const defaultProps = {
    expanded: false,
    group: null,
    url: null,
};

const noop = () => {};

const MenuLink = initialProps => {
    const {
        children,
        exact,
        group,
        id,
        order,
        url,
        expanded: initialExpanded,
        ...props
    } = initialProps;

    const prefkey = `rtk.sidebar.expanded.${id}`;

    const { params, location } = Reactium.Routing.currentRoute;

    const { config, cx, useLinks } = Reactium.Toolkit;

    const { position: align, width } = config.sidebar;

    const { Icon } = useHookComponent('RTK');

    const [expanded, setExpanded] = useState(false);

    const [links] = useLinks({ group: true });

    const related = _.where(links, { group: id });

    const className = cn({
        [cx('sidebar-menu-item')]: true,
        [cx(`sidebar-menu-item-${id}`)]: true,
        [cx(`sidebar-menu-item-${align}`)]: true,
        [cx(`sidebar-menu-item-${order}`)]: true,
        [cx(`sidebar-menu-item-${group}`)]: !!group,
    });

    const isActiveHeading = () => {
        if (params.group === id) return true;

        const url = location.pathname;
        const urls = _.pluck(related, 'url');
        return urls.includes(url);
    };

    const onToggle = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        Reactium.Prefs.set(prefkey, !expanded);
        setExpanded(!expanded);
    };

    const shouldExpand = () => {
        if (!!group) return false;
        if (initialExpanded === true) return true;
        if (op.get(params, 'group') === id) return true;
        return Reactium.Prefs.get(prefkey, false);
    };

    const Toggle = () =>
        !group && related.length > 0 ? (
            <button onClick={onToggle} className='rtk-btn-clear-xs'>
                <Icon value='Feather.Plus' />
            </button>
        ) : null;

    const depth = _.compact(String(id).split('-')).length;

    useEffect(() => {
        if (shouldExpand()) setExpanded(true);
    }, [params]);

    return (
        <div className={className} style={{ minWidth: width }}>
            {url ? (
                String(url).startsWith('/') ? (
                    <NavLink
                        {...props}
                        to={url}
                        exact={exact}
                        className={cn({
                            expanded: expanded && related.length > 0,
                            [cx('sidebar-menu-item-heading')]: !group,
                            [cx('sidebar-menu-item-link')]: !!group,
                        })}>
                        <span>{children}</span>
                        <Toggle />
                    </NavLink>
                ) : (
                    <a
                        {...props}
                        href={url}
                        className={cn({
                            expanded: expanded && related.length > 0,
                            [cx('sidebar-menu-item-heading')]: !group,
                            [cx('sidebar-menu-item-link')]: !!group,
                        })}>
                        <span>{children}</span>
                        <Toggle />
                    </a>
                )
            ) : (
                <div
                    {...props}
                    onClick={() => (related.length > 0 ? onToggle() : noop())}
                    className={cn({
                        expanded: expanded && related.length > 0,
                        active: isActiveHeading(),
                        toggle: related.length > 0,
                        [cx('sidebar-menu-item-heading')]: !group,
                        [cx('sidebar-menu-item-link')]: !!group,
                    })}>
                    <span>{children}</span>
                    <Toggle />
                </div>
            )}
            {related.length > 0 && (
                <div
                    className={cx(
                        'sidebar-menu-sub',
                        `sidebar-menu-sub-${depth}`,
                    )}>
                    {related.map(
                        ({ component: Component = MenuLink, ...item }) => (
                            <Component
                                exact
                                {...item}
                                key={`${id}-${item.id}`}
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

MenuLink.propTypes = propTypes;

MenuLink.defaultProps = defaultProps;

export { MenuLink, MenuLink as default };

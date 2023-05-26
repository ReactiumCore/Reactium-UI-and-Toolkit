import _ from 'underscore';
import cc from 'camelcase';
import React, { useEffect, useState } from 'react';
import Reactium, { __, useHandle, useHookComponent } from 'reactium-core/sdk';

const MenuToggle = ({ align, ...props }) => {
    const cx = Reactium.Toolkit.cx;

    const arrow = `Feather.Arrow${cc(
        String(Reactium.Toolkit.config.sidebar.position).toLowerCase(),
        { pascalCase: true },
    )}`;

    const visible = Reactium.Toolkit.config.sidebar.position === align;

    const { Icon } = useHookComponent('RTK');

    const Sidebar = useHandle('RTKSidebar');

    const [collapsed, setCollapsed] = useState();

    const [label, setLabel] = useState();

    const onCollapse = () => setCollapsed(true);

    const onExpand = () => setCollapsed(false);

    useEffect(() => {
        if (_.isUndefined(collapsed)) return;

        let lbl =
            collapsed === true ? __('expand sidebar') : __('collapse sidebar');

        switch (Reactium.Toolkit.os) {
            case 'windows':
                lbl = `ctrl+| ${lbl}`;
                break;

            case 'mac':
                lbl = `⌘+| ${lbl}`;
                break;
        }

        setLabel(lbl);
    }, [collapsed]);

    useEffect(() => {
        setCollapsed(Sidebar.collapsed);

        Sidebar.addEventListener('expand', onExpand);
        Sidebar.addEventListener('collapse', onCollapse);

        return () => {
            Sidebar.removeEventListener('expand', onExpand);
            Sidebar.removeEventListener('collapse', onCollapse);
        };
    }, [Sidebar]);

    const bprops = { ...props };
    delete bprops.zone;

    return _.isUndefined(collapsed) || !visible ? null : (
        <button
            {...bprops}
            title={label}
            aria-label={label}
            style={{ padding: 10 }}
            className={cx('btn-clear-xs')}
            onClick={() => Sidebar.toggle()}
        >
            <Icon value={collapsed ? 'Feather.Menu' : arrow} />
        </button>
    );
};

export { MenuToggle, MenuToggle as default };

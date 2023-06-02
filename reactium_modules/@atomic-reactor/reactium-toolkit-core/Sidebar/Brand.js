import React, { useState, useEffect } from 'react';
import _ from 'underscore';
import op from 'object-path';
import Reactium, {
    useHandle,
    useHookComponent,
} from '@atomic-reactor/reactium-core/sdk';

const Brand = () => {
    const Sidebar = useHandle('RTKSidebar');

    const Logo = useHookComponent('RTKLOGO');

    const [visible, setVisible] = useState(false);

    const { cx, config } = Reactium.Toolkit;
    const minWidth = op.get(config, 'sidebar.width', 320);

    const hide = () => setVisible(false);
    const show = () => setVisible(true);

    useEffect(() => {
        if (!Sidebar) return;
        setVisible(Sidebar.expanded);

        Sidebar.addEventListener('rtk-before-expanded', show);
        Sidebar.addEventListener('rtk-collapsed', hide);

        return () => {
            Sidebar.removeEventListener('rtk-before-expanded', show);
            Sidebar.removeEventListener('rtk-collapsed', hide);
        };
    }, [Sidebar]);

    return !visible ? null : (
        <div className={cx('brand')} style={{ minWidth }}>
            <Logo />
            {(config.brand || config.info) && (
                <div className={cx('brand-meta')}>
                    {config.brand && _.isString(config.brand) ? (
                        <h1 className={cx('brand-name')}>{config.brand}</h1>
                    ) : (
                        config.brand
                    )}

                    {config.info && _.isString(config.info) ? (
                        <div className={cx('brand-info')}>{config.info}</div>
                    ) : (
                        config.info
                    )}
                </div>
            )}
        </div>
    );
};

export { Brand, Brand as default };

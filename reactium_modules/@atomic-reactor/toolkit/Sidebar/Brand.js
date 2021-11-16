import React from 'react';
import _ from 'underscore';
import op from 'object-path';
import Reactium, { useHookComponent } from 'reactium-core/sdk';

const Brand = () => {
    const Logo = useHookComponent('RTKLOGO');

    const { cx, config } = Reactium.Toolkit;
    let minWidth = op.get(config, 'sidebar.width', 320);
    minWidth = minWidth === 't' ? 320 : minWidth;

    return (
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

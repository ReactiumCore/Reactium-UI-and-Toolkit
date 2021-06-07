import React from 'react';
import _ from 'underscore';
import Reactium, { useHookComponent } from 'reactium-core/sdk';

const Brand = () => {
    const Logo = useHookComponent('RTKLOGO');

    const { cx, config } = Reactium.Toolkit;
    const { width = 320 } = config.sidebar;

    return (
        <div className={cx('brand')} style={{ minidth: width }}>
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

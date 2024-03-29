import React from 'react';
import Reactium, { useHookComponent } from '@atomic-reactor/reactium-core/sdk';

const Demo = ({ handle }) => {
    const { attributes } = handle;
    const { cx } = Reactium.Toolkit;
    const { Button } = useHookComponent('RUI');

    return (
        <div
            className={cx('component-demo')}
            style={{ overflow: 'hidden', height: 220 }}
        >
            <Button {...attributes} debug={true} controlled />
        </div>
    );
};

export { Demo, Demo as default };

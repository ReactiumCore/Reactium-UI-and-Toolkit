import React from 'react';
import Reactium, { useHookComponent } from 'reactium-core/sdk';

const Demo = ({ handle }) => {
    const { attributes } = handle;
    const { cx } = Reactium.Toolkit;
    const { Button } = useHookComponent('ReactiumUI');

    return (
        <div
            className={cx('component-demo')}
            style={{ overflow: 'hidden', height: 220 }}>
            <Button {...attributes} debug={true} controlled />
        </div>
    );
};

export { Demo, Demo as default };

import React, { useState } from 'react';
import Reactium, { useHookComponent } from 'reactium-core/sdk';

const Demo = ({ handle }) => {
    const { attributes } = handle;
    const { cx } = Reactium.Toolkit;

    const [visible, setVisible] = useState(true);

    const { Alert, Button } = useHookComponent('ReactiumUI');

    const showAlert = () => setVisible(true);

    return (
        <div
            className={cx('component-demo')}
            style={{ overflow: 'hidden', height: 220 }}>
            <Alert
                {...attributes}
                visible={visible}
                controlled={true}
                style={{ width: '100%' }}
                onDismiss={() => setVisible(false)}
            />

            {!visible ? (
                <Button
                    block
                    outline
                    size='md'
                    onClick={showAlert}
                    children='Show Alert'
                    style={{ height: 62 }}
                    color={attributes.color}
                />
            ) : null}
        </div>
    );
};

export { Demo, Demo as default };

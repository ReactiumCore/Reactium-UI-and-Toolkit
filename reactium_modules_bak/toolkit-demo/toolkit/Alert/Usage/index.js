import React from 'react';
import Demo from './Demo';
import Editor from './Editor';
import Inspector from './Inspector';
import { __, useHookComponent } from 'reactium-core/sdk';

const defaultValue = {
    color: 'primary',
    controlled: true,
    dismissible: true,
    icon: 'Feather.AlertCircle',
    children: 'A wild contextual alert',
};

export default () => {
    const { Element, ComponentDemo } = useHookComponent('RTK');

    return (
        <Element title={__('Alert Usage')}>
            <ComponentDemo
                id='alert'
                Demo={Demo}
                Editor={Editor}
                value={defaultValue}
                Inspector={Inspector}
                className='alert-demo'
            />
        </Element>
    );
};

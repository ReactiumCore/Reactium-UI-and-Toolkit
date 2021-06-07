import React from 'react';
import Demo from './Demo';
import Editor from './Editor';
import Inspector from './Inspector';
import { __, useHookComponent } from 'reactium-core/sdk';

const defaultValue = {
    children: 'Button',
    color: 'primary',
    block: false,
    debug: true,
    size: 'md',
};

export default () => {
    const { Element, ComponentDemo } = useHookComponent('RTK');

    return (
        <Element title={__('Button Usage')}>
            <ComponentDemo
                id='button'
                Demo={Demo}
                Editor={Editor}
                value={defaultValue}
                Inspector={Inspector}
                className='button-demo'
            />
        </Element>
    );
};

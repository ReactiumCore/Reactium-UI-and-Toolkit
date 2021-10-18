import React from 'react';
import { __, useHookComponent } from 'reactium-core/sdk';

export default () => {
    const { Element } = useHookComponent('RTK');

    return <Element title={__('Testing')}>Testing Element</Element>;
};

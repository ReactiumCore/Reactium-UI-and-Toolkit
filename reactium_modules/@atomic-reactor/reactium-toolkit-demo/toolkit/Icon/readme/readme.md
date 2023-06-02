## Usage

```
import React from 'react';
import { useHookComponent } from '@atomic-reactor/reactium-core/sdk';

const MyComponent = () => {
    const { Icon } = useHookComponent('RUI');

    return (
        <h3>
            <Icon
                size={20}
                color='primary'
                value='Linear.FingersVictory' />
                Peace out!
        </h3>
    );
};
```

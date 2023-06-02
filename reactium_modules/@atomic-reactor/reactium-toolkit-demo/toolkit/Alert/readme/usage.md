## Usage

```
import React from 'react';
import { useHookComponent } from '@atomic-reactor/reactium-core/sdk';

const MyComponent = () => {

    const { Alert } = useHookComponent('RUI');

    return (
        <Alert dismissible icon='Feather.Activity' color={Alert.COLOR.PRIMARY}>
            A wild contextual message!
        </Alert>
    );
}
```

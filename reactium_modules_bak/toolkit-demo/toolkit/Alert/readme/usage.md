## Usage

```
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const MyComponent = () => {

    const { Alert } = useHookComponent('ReactiumUI');

    return (
        <Alert dismissible icon='Feather.Activity' color={Alert.COLOR.PRIMARY}>
            A wild contextual message!
        </Alert>
    );
}
```

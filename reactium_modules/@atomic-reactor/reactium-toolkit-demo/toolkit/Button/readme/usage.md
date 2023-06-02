## Usage

```
import React from 'react';
import { useHookComponent } from '@atomic-reactor/reactium-core/sdk';

const MyComponent = () => {
  const { Button } = useHookComponent('RUI');

  return (
    <Button size={Button.SIZE.SM} color={Button.COLOR.PRIMARY}>
      Button
    </Button>
  );
};
```

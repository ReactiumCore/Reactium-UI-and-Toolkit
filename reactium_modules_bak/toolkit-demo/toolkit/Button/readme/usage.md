## Usage

```
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const MyComponent = () => {
  const { Button } = useHookComponent('ReactiumUI');

  return (
    <Button size={Button.SIZE.SM} color={Button.COLOR.PRIMARY}>
      Button
    </Button>
  );
};
```

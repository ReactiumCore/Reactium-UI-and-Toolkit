## Usage

```
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const MyComponent = () => {
    const { Breakpoint } = useHookComponent('RUI');

    return <Breakpoint xs={<Xs />} sm={<Sm />} lg={<Lg />} />;
};

const Xs = () => <div>Extra Small</div>;

const Sm = () => <div>Small</div>

const Lg = () => <div>Large</div>;

```

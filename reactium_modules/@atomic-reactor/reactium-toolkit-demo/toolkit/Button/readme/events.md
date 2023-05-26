## Events

> The React [Keyboard](https://reactjs.org/docs/events.html#keyboard-events), [Focus](https://reactjs.org/docs/events.html#focus-events), [Mouse](https://reactjs.org/docs/events.html#mouse-events), [Pointer](https://reactjs.org/docs/events.html#pointer-events), and [Touch](https://reactjs.org/docs/events.html#touch-events) SyntheticEvents are supported by this component

#### Basic Event Example:

```
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const BasicEventExample = () => {
    const { Button } = useHookComponent('RUI');

    const onClick = (e) => e.target.set('active', !Boolean(e.target.get('active')));

    return (
        <Button
            onClick={onClick}
            children='Click Me'
        />
    );
};
```

#### Listener Event Example

```
import React, { useRef } from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const ListenerEventExample = () => {
    const btnRef = useRef();
    const { Button } = useHookComponent('RUI');

    const onClick = e => e.target.set('active', !Boolean(e.target.get('active')));

    useEffect(() => {
        if (!btnRef.current) return;

        btnRef.current.addEventListener('click', onClick);
        return () => {
            btnRef.current.removeEventListener('click', onClick);
        };
    }, [btnRef.current]);

    return (
        <Button
            ref={btnRef}
            children='Click Me'
        />
    );
};
```

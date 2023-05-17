## Events

| Event      | Description                           |
| ---------- | ------------------------------------- |
| **change** | Triggered when the breakpoint changes |

#### Event Example:

```
import React, { useEffect, useRef, useState } from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const MyComponent = () => {
    const bpRef = useRef();

    const [value, update] = useState();

    const { Breakpoint } = useHookComponent('ReactiumUI');

    const onChange = ({ active, breakpoint }) => {
        update(JSON.stringify({ active, breakpoint }));
    };

    useEffect(() => {
        if (!bpRef.current) return;

        bpRef.current.addEventListener('change', onChange);

        return () => {
            bpRef.current.removeEventListener('change', onChange);
        };
    }, [bpRef.current]);

    return (
        <>
            <Breakpoint
                ref={bpRef}
                xs={<span>XS</span>}
                xl={<span>XL</span>}
            />
            <div>
                <textarea value={value} />
            </div>
        </>
    )
}
```

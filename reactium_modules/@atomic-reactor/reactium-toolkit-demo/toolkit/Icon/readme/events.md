## Events

| Event      | Description                                 |
| ---------- | ------------------------------------------- |
| **change** | Triggered when the Icon `value` has changed |

#### Event Example

```
import { useHookComponent } from 'reactium-core/sdk';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const EventExample = () => {
    const { Button, Icon } = useHookComponent('RUI');

    // Reference to the Icon component
    const iconRef = useRef();

    // EventExample internal state
    const [icon, setIcon] = useState('Feather.ChevronUp');

    // Toggle the Icon value
    const toggle = useCallback(() => {
        if (!iconRef.current) return;

        const newValue =
            iconRef.current.value === 'Feather.ChevronDown'
                ? 'Feather.ChevronUp'
                : 'Feather.ChevronDown';

        iconRef.current.set('value', newValue);
    }, []);

    // Icon value change handler
    const onChange = useCallback(e => setIcon(e.target.value), []);

    // Icon value change listener
    useEffect(() => {
        if (!iconRef.current) return;

        iconRef.current.addEventListener('change', onChange);
        return () => {
            iconRef.current.removeEventListener('change', onChange);
        };
    }, [iconRef.current]);

    // Renderer
    return (
        <>
            <Button onClick={toggle}>
                <Icon value={icon} ref={iconRef} />
            </Button>
            <kbd>{icon}</kbd>
        </>
    );
};
```

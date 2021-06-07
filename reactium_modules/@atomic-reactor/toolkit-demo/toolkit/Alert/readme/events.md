## Events

| Event       | Description                                                                                |
| ----------- | ------------------------------------------------------------------------------------------ |
| **dismiss** | Triggered when the Alert is hidden via the `dismiss()` method or after `autoDismiss` timer |
| **hide**    | Triggered when the Alert is hidden                                                         |
| **show**    | Triggered when the Alert is shown                                                          |
| **toggle**  | Triggered when the Alert is hidden or shown                                                |

> The React [Keyboard](https://reactjs.org/docs/events.html#keyboard-events), [Mouse](https://reactjs.org/docs/events.html#mouse-events), [Pointer](https://reactjs.org/docs/events.html#pointer-events), and [Touch](https://reactjs.org/docs/events.html#touch-events) SyntheticEvents are supported by this component

#### Event Example:

```
import React, { useEffect, useRef } from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const EventExample = () => {
    const alertRef = useRef();
    const { Alert, Button } = useHookComponent('ReactiumUI');

    const [visible, setVisible] = useState(false);

    const onToggle = e => setVisible(e.visible);

    useEffect(() => {
        if (!alertRef.current) return;

        alertRef.current.addEventListener('toggle', onToggle);

        return () => {
            alertRef.current.removeEventListener('toggle', onToggle);
        };
    }, [alertRef.current]);

    return (
        <div>
            <div>
                <Button onClick={() => alertRef.current.toggle()}>
                    Toggle Alert
                </Button>
                <span>
                    Alert visible: {String(visible)}
                </span>
            </div>
            <Alert visible={false} ref={alertRef}>
                A wild alert event example!
            </Alert>
        </div>
    );
};
```

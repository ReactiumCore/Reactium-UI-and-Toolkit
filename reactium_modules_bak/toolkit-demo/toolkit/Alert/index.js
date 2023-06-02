import React, { useEffect, useRef, useState } from 'react';
import { __, useHookComponent } from 'reactium-core/sdk';
import { events, methods, props, readme, usage } from './readme';

const EventExample = () => {
    const alertRef = useRef();
    const { Alert, Button, Icon } = useHookComponent('ReactiumUI');

    const [visible, setVisible] = useState(false);

    const onToggle = (e) => setVisible(e.visible);

    useEffect(() => {
        if (!alertRef.current) return;

        alertRef.current.addEventListener('toggle', onToggle);

        return () => {
            alertRef.current.removeEventListener('toggle', onToggle);
        };
    }, [alertRef.current]);

    return (
        <div>
            <div className='my-xs-24'>
                <Button onClick={() => alertRef.current.toggle()}>
                    Toggle Alert
                </Button>
                <span className='ml-xs-12'>
                    Alert visible: <kbd>{String(visible)}</kbd>
                </span>
            </div>
            <div style={{ minHeight: 62 }}>
                <Alert visible={false} ref={alertRef}>
                    Try clicking the dismiss button{' '}
                    <Icon value='Feather.ArrowRight' size={18} />
                </Alert>
            </div>
        </div>
    );
};

export default () => {
    const { Alert } = useHookComponent('ReactiumUI');
    const { Element, Markdown } = useHookComponent('RTK');

    return (
        <Element className='p-xs-40' title={__('Alert')}>
            <Markdown value={readme} />
            <Alert
                dismissible
                icon='Feather.ThumbsUp'
                className='mt-xs-24 mb-xs-40'
                color={Alert.COLOR.PRIMARY}
            >
                A wild contextual message!
            </Alert>
            <Markdown value={usage} />
            <Markdown value={props} />
            <Markdown value={methods} />
            <Markdown value={events} />
            <EventExample />
        </Element>
    );
};

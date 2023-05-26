import { __, useHookComponent } from 'reactium-core/sdk';
import { events, methods, props, readme } from './readme';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export { List } from './List';

export const Element = () => {
    const Icon = useHookComponent('ReactiumUI/Icon');
    const { Element, Markdown } = useHookComponent('RTK');

    return (
        <Element className='p-xs-40' title={__('Icon')}>
            <Markdown value={readme} />
            <h3
                className='bg-white border-grey-1 p-12 flex-middle'
                style={{ lineHeight: 1 }}
            >
                <Icon
                    size={20}
                    color='primary'
                    className='mr-8'
                    value='Linear.FingersVictory'
                />
                {' Peace out!'}
            </h3>
            <Markdown value={props} />
            <Markdown value={methods} />
            <Markdown value={events} />
            <EventExample />
        </Element>
    );
};

const EventExample = () => {
    const { Button, Icon } = useHookComponent('ReactiumUI');

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
    const onChange = useCallback((e) => setIcon(e.target.value), []);

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
            <Button size='xs' onClick={toggle} style={{ width: 200 }}>
                <Icon value={icon} className='mr-xs-8' ref={iconRef} />
            </Button>
            <div style={{ width: 200 }} className='text-center small mt-xs-8'>
                <kbd>{icon}</kbd>
            </div>
        </>
    );
};

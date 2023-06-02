import React, { useEffect, useState } from 'react';
import { events, methods, props, readme, usage } from './readme';
import { __, useHookComponent } from '@atomic-reactor/reactium-core/sdk';

export default () => {
    const { Element, Markdown } = useHookComponent('RTK');

    return (
        <Element className='p-xs-40' title={__('Breakpoint')}>
            <Markdown value={readme} />
            <Example />
            <Markdown value={usage} />
            <Markdown value={props} />
            <Markdown value={methods} />
            <Markdown value={events} />
        </Element>
    );
};

const Example = () => {
    const { Breakpoint } = useHookComponent('RUI');

    const [ref, setRef] = useState();
    const [info, updateInfo] = useState();

    const setInfo = (value) => updateInfo(JSON.stringify(value));

    const onChange = ({ active, breakpoint }) =>
        setInfo({ active, breakpoint });

    useEffect(() => {
        if (!ref) return;

        setInfo(ref.value);

        ref.addEventListener('change', onChange);

        return () => {
            ref.removeEventListener('change', onChange);
        };
    }, [ref]);

    return (
        <div className='my-32'>
            <Breakpoint
                ref={(elm) => setRef(elm)}
                xs={<Xs color='error' />}
                sm={<Sm color='warning' />}
                lg={<Lg color='success' />}
            />
            <kbd className='mt-12 flex-center'>{info}</kbd>
        </div>
    );
};

const Xs = (props) => {
    const { Button } = useHookComponent('RUI');

    return (
        <Button block readOnly size='md' {...props}>
            resize the window
        </Button>
    );
};

const Sm = (props) => {
    const { Button } = useHookComponent('RUI');

    return (
        <div className='flex flex-center'>
            <Button block readOnly size='md' {...props}>
                resize the window
            </Button>
        </div>
    );
};

const Lg = (props) => {
    const { Button } = useHookComponent('RUI');

    return (
        <div className='flex flex-center'>
            <Button block readOnly size='md' {...props}>
                resize the window
            </Button>
        </div>
    );
};

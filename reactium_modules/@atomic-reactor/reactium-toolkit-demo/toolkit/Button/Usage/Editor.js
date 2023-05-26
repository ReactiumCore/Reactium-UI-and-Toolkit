import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const jsx = (attr, children) => `
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

export const Component = () => {
    const { Button } = useHookComponent('RUI');

    return <Button ${attr}>${children}</Button>;
};
`;

const Editor = ({ handle }) => {
    const { attributes, getAttributes, setAttributes } = handle;

    const { CodeEditor } = useHookComponent('RTK');

    return (
        <CodeEditor
            tagName='Button'
            setState={setAttributes}
            value={jsx(getAttributes(['children']), attributes.children)}
        />
    );
};

export { Editor, Editor as default };

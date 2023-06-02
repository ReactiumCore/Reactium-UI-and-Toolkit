import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const jsx = (attr, children) => `
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

export const Component = () => {
    const { Alert } = useHookComponent('ReactiumUI');

    return (
        <Alert ${attr}>
            ${children}
        </Alert>
    );
}
`;

const Editor = ({ handle }) => {
    const { attributes, getAttributes, setAttributes } = handle;

    const { CodeEditor } = useHookComponent('RTK');

    return (
        <CodeEditor
            tagName='Alert'
            setState={setAttributes}
            value={jsx(getAttributes(['children']), attributes.children)}
        />
    );
};

export { Editor, Editor as default };

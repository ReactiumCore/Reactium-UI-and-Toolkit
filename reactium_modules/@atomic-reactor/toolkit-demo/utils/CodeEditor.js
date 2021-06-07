import _ from 'underscore';
import React, { useEffect } from 'react';
import Reactium, { useHookComponent, useRefs } from 'reactium-core/sdk';

const CodeEditor = ({ setState, tagName, value }) => {
    const refs = useRefs();
    const { Code } = useHookComponent('RTK');
    const { Button, Icon } = useHookComponent('ReactiumUI');

    const apply = e => {
        const { value } = e;

        let attributes;

        const str = String(value);
        const reg = new RegExp(`<${tagName}\\s+(.*?)\>`, 'gm');
        const tag = _.first(_.first(Array.from(str.matchAll(reg))));

        const creg = new RegExp(
            `<${tagName}\\s+(.*?)>(.*?)<\/${tagName}>`,
            'gims',
        );
        const cmatch = _.first(Array.from(str.matchAll(creg)));
        const children = String(cmatch[2]).trim();
        try {
            attributes = Reactium.Toolkit.parseAttributes(
                Array.from(
                    tag.matchAll(
                        /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/gm,
                    ),
                ).reduce((obj, item) => {
                    obj[item[1]] = item[2];
                    return obj;
                }, {}),
            );
        } catch (err) {}

        if (attributes) {
            attributes.children = children;
            setState(attributes);
        }
    };

    useEffect(() => {
        if (!Reactium.Zone.hasZoneComponent('code-editor-actions', 'refresh')) {
            Reactium.Zone.addComponent({
                id: 'refresh',
                zone: ['code-editor-actions'],
                order: Reactium.Enums.priority.highest,
                component: props => (
                    <Button
                        color='clear'
                        onClick={() => apply(props)}
                        style={{ padding: 0, width: 40, height: 32 }}>
                        <Icon
                            value='Feather.RefreshCw'
                            size={14}
                            style={{ fill: '#666666' }}
                        />
                    </Button>
                ),
            });

            return () => {
                Reactium.Zone.removeComponent('refresh');
            };
        }
    }, []);

    return <Code value={value} ref={elm => refs.set('code', elm)} />;
};

export { CodeEditor, CodeEditor as default };

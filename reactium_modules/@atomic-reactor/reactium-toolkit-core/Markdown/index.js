import React from 'react';
import marked from 'marked';
import op from 'object-path';
import PropTypes from 'prop-types';
import JsxParser from 'react-jsx-parser';
import Reactium from '@atomic-reactor/reactium-core/sdk';

const components = () =>
    Reactium.Component.list.reduce((obj, item) => {
        const { component, id } = item;
        op.set(obj, String(id).replace(/RTK\//gi, ''), component);
        return obj;
    }, {});

const parser = (value) => {
    let str = String(value);
    const originalStr = String(value);

    // 0.0 - Internal replacers
    const replacers = [{ match: /={4,}/g, replace: '<hr />' }];

    replacers.forEach(({ match, replace }) => {
        str = String(str).replace(match, replace);
    });

    // 1.0 - Run string hook
    Reactium.Hook.runSync('markdown-string-parser', str, originalStr);

    // 2.0 - String to HTML
    let html = String(marked(str));
    const originalHTML = marked(str);

    // 2.1 - Internal HTML replacers
    html = String(html)
        .replace(
            /<pre><code>(.*?)<\/code><\/pre>/gms,
            "<Code className='block' readOnly value={`$1`} />",
        )
        .replace(/&#39;/g, "'")
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/\<h(\d) /g, '<h$1 className="rtk-markdown-heading"')
        .replace(/<(table+|thead+|th+|tr+|td+|tfoot+)>\n/g, '<$1>')
        .replace(/<\/(table+|thead+|th+|tr+|td+|tfoot+)>\n/g, '</$1>')
        .replace(/<(table+|thead+|th+|tr+|td+|tfoot+)>\r/g, '<$1>')
        .replace(/<\/(table+|thead+|th+|tr+|td+|tfoot+)>\r/g, '</$1>')
        .replace(/<table>/g, '<table className="rtk-markdown-table">')
        .replace(/(<a+)/g, '$1 className="rtk-markdown-link"')
        .replace(/<code>(.*?)<\/code>/g, '<kbd>$1</kbd>');

    // 3.0 - Run html hook
    Reactium.Hook.runSync('markdown-html-parser', html, originalHTML);

    // 4.0 - output html markup
    return html;
};

let Markdown = ({ blacklistedAttrs, blacklistedTags, value, ...props }) => {
    let comps = components();

    if (op.get(comps, 'ReactiumUI')) {
        Object.entries(comps.ReactiumUI).forEach(([key, val]) => {
            comps[key] = val;
        });
    }

    Reactium.Hook.runSync('markdown-components', comps);

    return (
        <JsxParser
            bindings={props}
            components={comps}
            jsx={parser(value)}
            renderInWrapper={false}
            blacklistedTags={blacklistedTags}
            blacklistedAttrs={blacklistedAttrs}
        />
    );
};

Markdown.propTypes = {
    blacklistedAttrs: PropTypes.array,
    blacklistedTags: PropTypes.array,
    value: PropTypes.string,
};

Markdown.defaultProps = {
    blacklistedAttrs: [],
    blacklistedTags: [],
};

Markdown.toHTML = parser;

export { Markdown, Markdown as default };

import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/javascript/javascript';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import _ from 'underscore';
import cn from 'classnames';
import op from 'object-path';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import CodeEditor from './CodeEditor';
import ReactDOMServer from 'react-dom/server';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import Reactium, {
    ComponentEvent,
    useDerivedState,
    useEventHandle,
    useHookComponent,
    useRefs,
    Zone,
} from '@atomic-reactor/reactium-core/sdk';

let Code = (
    {
        className,
        id,
        namespace,
        children,
        value: initialValue,
        ...initialProps
    },
    ref,
) => {
    let props = { ...initialProps };

    const events = Object.entries(initialProps).reduce((obj, [key, val]) => {
        if (String(key).startsWith('on') || String(key).startsWith('editor')) {
            obj[key] = val;
            delete props[key];
        }

        return obj;
    }, {});

    const refs = useRefs();

    const [value, update] = useDerivedState({
        current: initialValue
            ? Reactium.Toolkit.codeFormat(initialValue)
            : Reactium.Toolkit.codeFormat(
                  ReactDOMServer.renderToStaticMarkup(children),
              ),
    });

    const setValue = (newValue, silent) => {
        if (unMounted()) return;
        update({ current: newValue }, silent);
    };

    const unMounted = () => !refs.get('container');

    const _onChange = (...args) => {
        const cm = args[0];
        const newValue = cm.doc.getValue();
        if (newValue === value.current) return;

        handle.value = newValue;
        handle.editor = cm;

        setValue(newValue, true);
        setHandle(handle);

        handle.dispatchEvent(new ComponentEvent('change', { value: newValue }));

        if (_.isFunction(op.get(events, 'onChange'))) {
            _.defer(() => events.onChange(...args, handle));
        }
    };

    const _onBlur = (...args) => {
        setValue(value.current);
        if (_.isFunction(op.get(events, 'onBlur'))) {
            _.defer(() => events.onBlur(...args, handle));
        }
    };

    const _onMount = (...args) => {
        refs.set('code', args[0]);
        handle.editor = args[0];
        setHandle(handle);

        handle.dispatchEvent(new ComponentEvent('mount', { editor: args[0] }));

        if (_.isFunction(op.get(events, 'editorDidMount'))) {
            events.editorDidMount(...args, handle);
        }
    };

    const _handle = () => ({
        ...props,
        editor: refs.get('code'),
        id,
        refs,
        setValue,
        value: value.current,
    });

    let [handle, setHandle] = useEventHandle(_handle());

    useImperativeHandle(ref, () => handle);

    useEffect(() => {
        if (initialValue) {
            const newValue = Reactium.Toolkit.codeFormat(initialValue);
            if (value.current !== newValue) {
                setValue(Reactium.Toolkit.codeFormat(initialValue));
            }
        }
    }, [initialValue]);

    return (
        <div
            className={cn(namespace, className)}
            ref={(elm) => refs.set('container', elm)}
        >
            <CodeMirror
                {...events}
                options={props}
                onBlur={_onBlur}
                onChange={_onChange}
                value={value.current}
                editorDidMount={_onMount}
            />
            <div className={`${namespace}-actions`}>
                {id && <Zone zone={`${id}-actions`} {..._handle()} />}
                <Zone zone={`${namespace}-actions`} {..._handle()} />
            </div>
        </div>
    );
};

Code = forwardRef(Code);

Code.propTypes = {
    className: PropTypes.string,
    gutters: PropTypes.array,
    lineNumbers: PropTypes.bool,
    lineWrapping: PropTypes.bool,
    foldGutter: PropTypes.bool,
    foldOptions: PropTypes.object,
    id: PropTypes.string,
    indentUnit: PropTypes.number,
    mode: PropTypes.string,
    readOnly: PropTypes.bool,
    editorDidAttach: PropTypes.func,
    editorDidConfigure: PropTypes.func,
    editorDidDetach: PropTypes.func,
    editorDidMount: PropTypes.func,
    editorWillUnmount: PropTypes.func,
    onBeforeChange: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onContextMenu: PropTypes.func,
    onCopy: PropTypes.func,
    onCursorActivity: PropTypes.func,
    onCut: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    onFocus: PropTypes.func,
    onGutterClick: PropTypes.func,
    onInputRead: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyHandled: PropTypes.func,
    onKeyPress: PropTypes.func,
    onKeyUp: PropTypes.func,
    onMouseDown: PropTypes.func,
    onPaste: PropTypes.func,
    onSelection: PropTypes.func,
    onTouchStart: PropTypes.func,
    onUpdate: PropTypes.func,
    onViewportChange: PropTypes.func,
};

Code.defaultProps = {
    namespace: 'rtk-code',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    lineNumbers: true,
    lineWrapping: false,
    foldGutter: true,
    foldOptions: { widget: () => '...' },
    id: 'code-editor',
    indentUnit: 4,
    mode: 'jsx',
    readOnly: false,
};

const CodeCopy = ({ value }) => {
    const { Icon } = useHookComponent('RTK');

    const copyParse = (str) =>
        String(str)
            .replace(/\=\'true\'/gi, '')
            .replace(/\'false\'/gi, '{ false }');

    return (
        <button
            className='rtk-btn-clear-xs'
            onClick={() => copy(copyParse(value))}
            style={{ padding: 0, width: 40, height: 32 }}
        >
            <Icon value='Feather.Copy' size={14} />
        </button>
    );
};

export { Code, Code as default, CodeCopy, CodeEditor };

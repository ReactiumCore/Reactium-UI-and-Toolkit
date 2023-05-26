import { Link } from 'react-router-dom';
import React, { forwardRef } from 'react';

const LINK = forwardRef(({ href, ...props }, ref) =>
    String(href).startsWith('http') || String(href).startsWith('#') ? (
        <a href={href} {...props} ref={ref} />
    ) : (
        <Link to={href} {...props} ref={ref} />
    ),
);

export default {
    APPEARANCE: {
        CIRCLE: 'circle',
        PILL: 'pill',
    },
    COLOR: {
        CLEAR: 'clear',
        DANGER: 'danger',
        DEFAULT: 'default',
        ERROR: 'error',
        INFO: 'info',
        PRIMARY: 'primary',
        SECONDARY: 'secondary',
        SUCCESS: 'success',
        TERTIARY: 'tertiary',
        WARNING: 'warning',
    },
    ELEMENT: {
        BUTTON: forwardRef((props, ref) => (
            <button {...props} type='button' ref={ref} />
        )),
        LABEL: forwardRef((props, ref) => <label {...props} ref={ref} />),
        LINK,
        RESET: forwardRef((props, ref) => (
            <submit {...props} type='reset' ref={ref} />
        )),
        SUBMIT: forwardRef((props, ref) => (
            <button {...props} type='submit' ref={ref} />
        )),
    },
    EVENTS: ['keyboard', 'focus', 'mouse', 'pointer', 'touch'],
    SIZE: {
        XS: 'xs',
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
    },
    TYPE: {
        BUTTON: 'button',
        LABEL: 'label',
        LINK: 'link',
        SUBMIT: 'submit',
        RESET: 'reset',
    },
};

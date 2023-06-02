import _ from 'underscore';
import op from 'object-path';
import { useEffect, useState } from 'react';
import { ComponentEvent } from '@atomic-reactor/reactium-core/sdk';

const eventList = {
    clipboard: ['onCopy', 'onCut', 'onPaste'],
    composition: [
        'onCompositionEnd',
        'onCompositionStart',
        'onCompositionUpdate',
    ],
    keyboard: ['onKeyDown', 'onKeyPress', 'onKeyUp'],
    focus: ['onFocus', 'onBlur'],
    form: ['onChange', 'onInput', 'onInvalid', 'onReset', 'onSubmit'],
    generic: ['onError', 'onLoad'],
    mouse: [
        'onClick',
        'onContextMenu',
        'onDoubleClick',
        'onDrag',
        'onDragEnd',
        'onDragEnter',
        'onDragExit',
        'onDragLeave',
        'onDragOver',
        'onDragStart',
        'onDrop',
        'onMouseDown',
        'onMouseEnter',
        'onMouseLeave',
        'onMouseMove',
        'onMouseOut',
        'onMouseOver',
        'onMouseUp',
    ],
    pointer: [
        'onPointerDown',
        'onPointerMove',
        'onPointerUp',
        'onPointerCancel',
        'onGotPointerCapture',
        'onLostPointerCapture',
        'onPointerEnter',
        'onPointerLeave',
        'onPointerOver',
        'onPointerOut',
    ],
    select: ['onSelect'],
    touch: ['onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart'],
    ui: ['onScroll'],
    wheel: ['onWheel'],
    media: [
        'onAbort',
        'onCanPlay',
        'onCanPlayThrough',
        'onDurationChange',
        'onEmptied',
        'onEncrypted',
        'onEnded',
        'onError',
        'onLoadedData',
        'onLoadedMetadata',
        'onLoadStart',
        'onPause',
        'onPlay',
        'onPlaying',
        'onProgress',
        'onRateChange',
        'onSeeked',
        'onSeeking',
        'onStalled',
        'onSuspend',
        'onTimeUpdate',
        'onVolumeChange',
        'onWaiting',
    ],
    image: ['onLoad', 'onError'],
    animation: ['onAnimationStart', 'onAnimationEnd', 'onAnimationIteration'],
    transition: ['onTransitionEnd'],
    other: ['onToggle'],
};

const useSyntheticEvents = ({ selected = [], state }, deps) => {
    const [init, setInit] = useState();

    const events = (
        selected.length < 1
            ? _.flatten(Object.values(eventList))
            : selected.reduce((arr, key) => {
                  arr = _.flatten([arr, op.get(eventList, key, [])]);
                  return arr;
              }, [])
    ).map((event) => String(event).substr(2).toLowerCase());

    const dispatch = (e, obj, callback) => {
        obj = obj || state.get();
        let evt;

        if (!_.isFunction(callback)) {
            evt = new ComponentEvent(e.type, {
                ...obj,
                event: e,
            });
            state.dispatchEvent(evt);
        } else {
            try {
                const inst = e.type + '-' + Date.now();
                evt = new ComponentEvent(inst, {
                    ...obj,
                    event: e,
                });

                state.addEventListener(inst, callback);
                state.dispatchEvent(evt);
                state.removeEventListener(inst, callback);
            } catch (err) {}
        }
    };

    const prune = (element) => {
        if (!element) return;
        events.forEach((type) => element.removeEventListener(type, dispatch));
    };

    useEffect(() => {
        if (init) return;
        if (!state) return;
        if (!state.get('element')) return;

        const element = state.get('element');
        events.forEach((type) => element.addEventListener(type, dispatch));

        setInit(true);
    }, deps);

    return {
        events,
        dispatch,
        prune,
    };
};

export { useSyntheticEvents, useSyntheticEvents as default };

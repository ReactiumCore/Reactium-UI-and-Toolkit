import _ from 'underscore';
import op from 'object-path';
import copy from 'copy-to-clipboard';
import React, { useCallback, useEffect, useState } from 'react';

import {
    __,
    useHookComponent,
    useRefs,
    useStatus,
    useSyncState,
} from 'reactium-core/sdk';

export const List = () => {
    const chunkSize = 50;
    const pref = 'rtk.icon';

    const refs = useRefs();

    const Icon = useHookComponent('ReactiumUI/Icon');
    const { ColorSelect, Element, Markdown } = useHookComponent('RTK');

    const [page, setPage] = useState(Reactium.Prefs.get(`${pref}.page`, 2));

    const state = useSyncState({
        page: 2,
        color: Reactium.Prefs.get(`${pref}.color`, 'default'),
        iconSet: Reactium.Prefs.get(
            `${pref}.set`,
            _.first(Object.keys(Icon.Library.listById).sort()),
        ),
        search: '',
        size: Reactium.Prefs.get(`${pref}.size`, 24),
    });

    const icons = useCallback(() => {
        let { iconSet, search } = state.get();
        search = String(search)
            .replace(`${iconSet}.`, '')
            .toLowerCase();
        const list = Object.keys(
            op.get(Icon.Library.listById, [iconSet, 'icons'], {}),
        ).sort();

        return list.filter(icon =>
            Boolean(
                String(icon)
                    .toLowerCase()
                    .indexOf(search) > -1,
            ),
        );
    }, []);

    const onScroll = useCallback(() => {
        const elm = refs.get('load');
        if (!elm) return;
        const icos = icons();
        const pages = Math.ceil(icos.length / chunkSize);

        const { top } = elm.getBoundingClientRect();
        const trigger = top <= window.innerHeight;

        if (trigger === true) {
            const next = page + 1;
            if (next > pages) return;
            setPage(next);
        }
    }, [page]);

    const search = useCallback(e => {
        state.set('search', e.target.value);
        setPage(1);
    }, []);

    const setColor = useCallback(color => {
        Reactium.Prefs.set(`${pref}.color`, color);
        state.set('color', color);
    }, []);

    const setIcons = useCallback(iconSet => {
        Reactium.Prefs.set(`${pref}.set`, iconSet);
        state.set('iconSet', iconSet);
        setPage(2);
    }, []);

    const setSize = useCallback(size => {
        Reactium.Prefs.set(`${pref}.size`, size);
        state.set('size', size);
    }, []);

    useEffect(() => {
        Reactium.Prefs.set(`${pref}.page`, page);
        if (!window) return;
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [page]);

    return (
        <Element className='p-xs-40' title={__('Icon')}>
            <Markdown value='## Icons' />
            <div className='rtk-search-form'>
                <div className='form-group search flex-grow'>
                    <input
                        type='text'
                        name='search'
                        title={__('icon search')}
                        placeholder={__('Search')}
                        value={state.get('search', '')}
                        onChange={search}
                    />
                    <Icon value='Feather.Search' />
                </div>
                <div className='form-group flex-grow'>
                    <select
                        title={__('icon set')}
                        value={state.get('iconSet')}
                        onChange={e => setIcons(e.target.value)}>
                        {_.sortBy(Icon.Library.list, 'id').map(({ id }) => (
                            <option key={`iconset-${id}`}>{id}</option>
                        ))}
                    </select>
                </div>
                <div className='form-group'>
                    <select
                        title={__('icon size')}
                        value={Number(state.get('size'))}
                        onChange={e => setSize(Number(e.target.value))}>
                        {[12, 16, 24, 32, 40, 48, 56].map(num => (
                            <option key={`size-${num}`}>{num}</option>
                        ))}
                    </select>
                </div>
                <ColorSelect
                    value={state.get('color')}
                    onChange={e => setColor(e.target.value)}
                />
            </div>
            <div className='rtk-icons'>
                {_.chunk(icons(), chunkSize).map((chunk, p) => {
                    p += 1;
                    return p <= page
                        ? chunk.map((icon, i) => (
                              <IconButton
                                  color={state.get('color')}
                                  size={Number(state.get('size'))}
                                  key={`icon-${Object.values(state.get()).join(
                                      '-',
                                  )}-${i}`}
                                  value={`${state.get('iconSet')}.${icon}`}
                              />
                          ))
                        : null;
                })}
                <span
                    className='rtk-icons-load'
                    ref={elm => refs.set('load', elm)}
                />
            </div>
        </Element>
    );
};

export const IconButton = ({ color, size, value }) => {
    const { Check, Icon } = useHookComponent('ReactiumUI');
    const [, setStatus, isStatus] = useStatus('ready');

    const onClick = e => {
        copy(value);
        e.currentTarget.blur();
        setStatus('copied', true);
    };

    return (
        <button
            className='rtk-icon-btn'
            title={__('Copy to clipboard')}
            onClick={onClick}
            onMouseLeave={() => setStatus('ready', true)}>
            {isStatus('ready') ? (
                <Icon color={color} size={size} value={value} />
            ) : (
                <Check size={size} color='success' />
            )}
            <div className='rtk-icon-btn-label'>
                {isStatus('ready')
                    ? _.last(String(value).split('.'))
                    : __('Copied!')}
            </div>
        </button>
    );
};

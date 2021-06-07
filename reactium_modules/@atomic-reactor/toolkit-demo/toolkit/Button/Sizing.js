import _ from 'underscore';
import { buttonProps } from './utils';
import React, { useEffect, useState } from 'react';
import Reactium, { __, useHookComponent } from 'reactium-core/sdk';

export default () => {
    const pref = 'rtk.button.color';
    const { copy } = Reactium.Toolkit;

    const [color, updateColor] = useState();
    const { Button } = useHookComponent('ReactiumUI');
    const { ColorSelect, Element } = useHookComponent('RTK');

    const setColor = newColor => {
        Reactium.Prefs.set(pref, newColor);
        updateColor(newColor);
    };

    const title = __('copy selector to clipboard');

    const sizes = Object.values(Button.SIZE);

    const css = ({ color, size, appearance, outline }) => {
        const arr = ['btn', color];

        if (size) arr.push(size);
        if (outline) arr.push('outline');
        if (appearance) arr.push(appearance);

        return _.compact(arr).join('-');
    };

    const Toolbar = props => (
        <ColorSelect
            {...props}
            value={color}
            onChange={e => setColor(e.target.value)}
        />
    );

    const ButtonRender = ({ color, size, ...props }) => {
        const cname = css({ ...props, color, size });

        return (
            <div className='px-xs-12 px-sm-4 pb-xs-24 text-center'>
                <Button
                    {...props}
                    size={size}
                    color={color}
                    onClick={() => copy(cname)}>
                    {color}
                </Button>
                <div className='rtk-meta-info pt-xs-8'>.{cname}</div>
            </div>
        );
    };

    useEffect(() => {
        const colorPref = Reactium.Prefs.get(pref, Button.COLOR.PRIMARY);
        if (colorPref !== color) setColor(colorPref);
    }, []);

    return !color ? null : (
        <Element
            toolbar={Toolbar}
            title={__('Button Sizing')}
            className='pt-xs-40 px-xs-40'>
            <div
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    display: 'flex flex-center',
                }}>
                <div className='row'>
                    {buttonProps({ title }).map((btn, i) => {
                        return (
                            <div
                                key={`button-style-${i}`}
                                className='col-xs-12 col-md-6 mb-xs-40'>
                                {sizes.reverse().map((size, s) => (
                                    <ButtonRender
                                        {...btn}
                                        size={size}
                                        color={color}
                                        key={`button-style-${i}-${s}`}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Element>
    );
};

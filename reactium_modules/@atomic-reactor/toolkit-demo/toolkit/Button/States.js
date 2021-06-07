import { buttonProps, buttonStates } from './utils';
import React, { useEffect, useState } from 'react';
import Reactium, { __, useHookComponent } from 'reactium-core/sdk';

export default () => {
    const pref = 'rtk.button.color';
    const [color, updateColor] = useState();
    const { Button } = useHookComponent('ReactiumUI');
    const { ColorSelect, Element } = useHookComponent('RTK');

    const setColor = newColor => {
        Reactium.Prefs.set(pref, newColor);
        updateColor(newColor);
    };

    const style = { width: 128 };

    const title = __('copy selector to clipboard');

    const Toolbar = props => (
        <ColorSelect
            {...props}
            value={color}
            onChange={e => setColor(e.target.value)}
        />
    );

    const ButtonRender = ({ className, color, ...props }) => {
        console.log(props, color);
        return (
            <div className='col-xs-6 col-sm-3'>
                <div className='px-xs-12 px-sm-4 pb-xs-24 text-center'>
                    <Button
                        readOnly
                        {...props}
                        color={color}
                        className={className}
                    />
                    <div className='rtk-meta-info pt-xs-8'>
                        <span>&nbsp;</span>
                    </div>
                </div>
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
            title={__('Button States')}
            className='pt-xs-40 px-xs-40'>
            <div
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    display: 'flex flex-center',
                }}>
                {buttonStates.map(({ label, className }) => (
                    <div className='row' key={className}>
                        <div className='col-xs-12 col-md-2 text-xs-center text-md-left pb-xs-40 pb-md-0 pt-md-8'>
                            {label}
                        </div>
                        <div className='col-xs-12 col-md-10'>
                            <div className='row'>
                                {buttonProps({ style, title }).map((btn, i) => (
                                    <ButtonRender
                                        {...btn}
                                        color={color}
                                        className={className}
                                        key={`btn-state-${label}-${i}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Element>
    );
};

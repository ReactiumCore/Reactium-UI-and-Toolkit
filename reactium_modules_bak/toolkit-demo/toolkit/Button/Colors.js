import React from 'react';
import camelcase from 'camelcase';
import { buttonColors, buttonProps } from './utils';
import Reactium, { __, useHookComponent } from 'reactium-core/sdk';

const cc = (str) => camelcase(str, { pascalCase: true });

export default () => {
    const { copy } = Reactium.Toolkit;
    const { Element } = useHookComponent('RTK');
    const { Button } = useHookComponent('ReactiumUI');

    const colors = buttonColors();

    const style = { width: 128 };

    const title = __('copy selector to clipboard');

    const ButtonRender = ({ color, css, ...props }, i) => {
        const cname = `.${String(css).replace('%color', color)}`;
        return (
            <div key={`col-${i}`} className='col-xs-6 col-sm-3'>
                <div
                    key={`col-${i}-${color}`}
                    className='px-xs-12 px-sm-4 pb-xs-24 text-center'
                >
                    <Button
                        {...props}
                        color={color}
                        onClick={() => copy(cname)}
                    >
                        {color}
                    </Button>
                    <div className='rtk-meta-info pt-xs-8'>{cname}</div>
                </div>
            </div>
        );
    };

    return (
        <Element className='pt-xs-40 px-xs-40' title={__('Button Colors')}>
            <div
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    display: 'flex flex-center',
                }}
            >
                {colors.map((color) => (
                    <div className='row' key={`button-color-${color}`}>
                        <div className='col-xs-12 col-md-2 text-xs-center text-md-left pb-xs-32 pb-md-0 pt-xs-8 pt-md-8'>
                            {cc(color)}
                        </div>
                        <div className='col-xs-12 col-md-10'>
                            <div className='row'>
                                {buttonProps({ style, title }).map((btn, i) => (
                                    <ButtonRender
                                        {...btn}
                                        color={color}
                                        key={`button-color-${color}-${i}`}
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

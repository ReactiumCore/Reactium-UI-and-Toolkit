import cn from 'classnames';
import React, { useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Reactium, { __, useHookComponent } from 'reactium-core/sdk';

const Inspector = ({ handle }) => {
    const { attributes, setAttributes } = handle;

    const { cx } = Reactium.Toolkit;

    const { ColorSelect } = useHookComponent('RTK');
    const { Breakpoint, Toggle } = useHookComponent('RUI');

    const ScrollWrap = useCallback(
        ({ children }) => (
            <Breakpoint
                xs={children}
                lg={<Scrollbars>{children}</Scrollbars>}
            />
        ),
        [],
    );

    return (
        <ScrollWrap>
            <div className={cn(cx('component-props'), 'p-xs-40')}>
                <div className='form-group'>
                    <div className='flex middle'>
                        <div className='col-xs-12 col-sm-6'>{__('Color')}</div>
                        <div className='col-xs-12 col-sm-6 text-right'>
                            <ColorSelect
                                value={attributes.color}
                                style={{ width: 150, marginLeft: 'auto' }}
                                onChange={(e) =>
                                    setAttributes({ color: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <div className='flex middle'>
                        <div className='col-xs-12 col-sm-6'>
                            {__('Message')}
                        </div>
                        <div className='col-xs-12 col-sm-6 text-right'>
                            <input
                                type='text'
                                value={attributes.children}
                                style={{ width: 150, marginLeft: 'auto' }}
                                onChange={(e) => {
                                    setAttributes({ children: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <div className='flex middle'>
                        <div className='col-xs-12 col-sm-6'>{__('Icon')}</div>
                        <div className='col-xs-12 col-sm-6 text-right'>
                            <input
                                type='text'
                                value={attributes.icon}
                                style={{ width: 150, marginLeft: 'auto' }}
                                onChange={(e) => {
                                    setAttributes({ icon: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <Toggle
                        controlled
                        value={true}
                        label={__('Dismissible')}
                        checked={attributes.dismissible || false}
                        onChange={(e) =>
                            setAttributes({ dismissible: e.target.checked })
                        }
                    />
                </div>
            </div>
        </ScrollWrap>
    );
};

export { Inspector, Inspector as default };

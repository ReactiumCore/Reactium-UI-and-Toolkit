import cn from 'classnames';
import React, { useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Reactium, { __, useHookComponent } from 'reactium-core/sdk';

const Inspector = ({ handle }) => {
    const { attributes, setAttributes } = handle;

    const { cx } = Reactium.Toolkit;

    const { ColorSelect } = useHookComponent('RTK');
    const { Breakpoint, Button, Toggle } = useHookComponent('ReactiumUI');

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
                                onChange={e =>
                                    setAttributes({ color: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <div className='flex middle'>
                        <div className='col-xs-12 col-sm-6'>{__('Label')}</div>
                        <div className='col-xs-12 col-sm-6 text-right'>
                            <input
                                type='text'
                                value={attributes.children}
                                style={{ width: 150, marginLeft: 'auto' }}
                                onChange={e => {
                                    setAttributes({ children: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <div className='flex middle'>
                        <div className='col-xs-12 col-sm-6'>{__('Size')}</div>
                        <div className='col-xs-12 col-sm-6 text-right'>
                            <select
                                value={attributes.size}
                                style={{ width: 150, marginLeft: 'auto' }}
                                onChange={e =>
                                    setAttributes({ size: e.target.value })
                                }>
                                {Object.values(Button.SIZE).map(size => (
                                    <option key={`button-size-${size}`}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <Toggle
                        controlled
                        value={true}
                        label={__('Outline')}
                        checked={attributes.outline === true}
                        onChange={e =>
                            setAttributes({
                                outline: e.target.checked,
                            })
                        }
                    />
                </div>
                <div className='form-group'>
                    <Toggle
                        controlled
                        value={true}
                        label={__('Block')}
                        onChange={e =>
                            setAttributes({
                                block: e.target.checked,
                            })
                        }
                        checked={attributes.block === true}
                    />
                </div>
                <div className='form-group'>
                    <Toggle
                        controlled
                        label={__('Pill')}
                        value={Button.APPEARANCE.PILL}
                        onChange={e =>
                            setAttributes({
                                appearance: e.target.checked
                                    ? e.target.value
                                    : null,
                            })
                        }
                        checked={
                            attributes.appearance ===
                            Button.APPEARANCE.PILL
                        }
                    />
                </div>
            </div>
        </ScrollWrap>
    );
};

export { Inspector, Inspector as default };

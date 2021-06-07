export * from './Title';
export * from './MenuToggle';

import _ from 'underscore';
import React, { useEffect } from 'react';
import Reactium, { useDerivedState } from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Toolbar
 * -----------------------------------------------------------------------------
 */

const alignment = ['left', 'center', 'right'];
const Toolbar = props => {
    const { useToolbarElements, fullscreen } = Reactium.Toolkit;

    const [state, setState] = useDerivedState({
        fullscreen,
    });

    const [list] = useToolbarElements();

    useEffect(() => {
        setState({ fullscreen });
    }, [fullscreen]);

    return state.fullscreen === true || _.isUndefined(fullscreen) ? null : (
        <header className={Reactium.Toolkit.cx('toolbar')} {...props}>
            {alignment.map(align => (
                <div
                    key={`toolbar-${align}`}
                    className={Reactium.Toolkit.cx(`toolbar-${align}`)}>
                    {_.where(list, { align }).map(
                        ({
                            align,
                            component: Component,
                            id,
                            order,
                            ...props
                        }) => (
                            <Component
                                {...props}
                                align={align}
                                data-order={order}
                                data-align={align}
                                key={`${align}-${id}`}
                                zone={`toolbar-${align}`}
                            />
                        ),
                    )}
                </div>
            ))}
        </header>
    );
};

export { Toolbar, Toolbar as default };

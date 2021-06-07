import React from 'react';
import cn from 'classnames';
import Reactium from 'reactium-core/sdk';

const ToolbarTitle = ({ className, ...props }) => {
    const { cx } = Reactium.Toolkit;
    return <div {...props} className={cn(cx('toolbar-title'), className)} />;
};

export { ToolbarTitle, ToolbarTitle as default };

import _ from 'underscore';
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect } from 'react';
import Reactium, { useHookComponent } from 'reactium-core/sdk';

const propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    fullscreen: PropTypes.bool,
    title: PropTypes.node,
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
};

const defaultProps = {
    fullscreen: false,
};

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Element
 * -----------------------------------------------------------------------------
 */

let Element = (
    {
        children,
        className,
        fullscreen,
        title,
        toolbar,
        xs = 12,
        sm,
        md,
        lg,
        ...props
    },
    ref,
) => {
    const { cx } = Reactium.Toolkit;

    const { ToolbarTitle } = useHookComponent('RTK');

    const cname = cn(className, cx('element'), {
        [`rtk-col-xs-${xs}`]: !!xs,
        [`rtk-col-sm-${sm}`]: !!sm,
        [`rtk-col-md-${md}`]: !!md,
        [`rtk-col-lg-${lg}`]: !!lg,
    });

    useEffect(() => {
        const unreg = [];
        if (title) {
            unreg.push({
                id: 'element-title',
                reg: Reactium.Toolkit.Toolbar.register('element-title', {
                    align: Reactium.Toolkit.Toolbar.align.left,
                    component: ToolbarTitle,
                    children: title,
                }),
            });
        }

        if (toolbar) {
            unreg.push({
                id: 'element-toolbar',
                reg: Reactium.Toolkit.Toolbar.register('element-toolbar', {
                    align: Reactium.Toolkit.Toolbar.align.right,
                    component: toolbar,
                    className: 'mr-xs-12',
                }),
            });
        }

        return () => {
            unreg.forEach(({ id, reg }) => reg.unregister(id));
        };
    }, []);

    useEffect(() => {
        Reactium.Toolkit.setFullscreen(fullscreen);
    }, [fullscreen]);

    return _.isUndefined(Reactium.Toolkit.fullscreen) ? null : (
        <div {...props} className={cname} ref={ref}>
            <div className={cx('element-content')}>{children}</div>
        </div>
    );
};

Element = forwardRef(Element);

Element.propTypes = propTypes;

Element.defaultProps = defaultProps;

export { Element, Element as default };

import React from 'react';
import cn from 'classnames';

const defaultProps = {
    style: {},
    size: 24,
};

const X = ({ size, style: STYLE = {} }) => {
    const style = { fontSize: size, color: 'inherit', lineHeight: 1, ...STYLE };
    return <span className='ar-icon ar-icon-x' children='✕' style={style} />;
};

const Check = ({
    className,
    color,
    size = 24,
    style: STYLE = {},
    ...props
}) => {
    const defaultProps = {
        className: 'icon',
        viewBox: '0 0 1024 1024',
        xmlns: 'http://www.w3.org/2000/svg',
    };
    const style = { width: size, height: size, ...STYLE };
    const cname = cn('ar-icon', 'ar-checkmark', className, {
        [color]: !!color,
    });

    return (
        <span className={cname} {...props}>
            <svg {...defaultProps} style={style}>
                <g>
                    <path d='M883.2 226.133c-17.067-17.067-42.667-17.067-59.733 0l-439.467 439.467-183.467-183.467c-17.067-17.067-42.667-17.067-59.733 0s-17.067 42.667 0 59.733l213.333 213.333c8.533 8.533 17.067 12.8 29.867 12.8s21.333-4.267 29.867-12.8l469.333-469.333c17.067-17.067 17.067-42.667 0-59.733z' />
                </g>
            </svg>
        </span>
    );
};

X.defaultProps = defaultProps;

export { Check, X };

import React from 'react';
import _ from 'underscore';
import route from '../route';
import { Link } from 'react-router-dom';
import Reactium from 'reactium-core/sdk';

const defaultProps = {
    viewBox: '0 0 70 70',
    className: 'rtk-logo',
    xmlns: 'http://www.w3.org/2000/svg',
};

export const Logo = ({ size = 32, ...initialProps }) => {
    const cx = Reactium.Toolkit.cx;
    const url = _.last(route.path);

    let props = { ...defaultProps, ...initialProps };

    if (size) {
        props.width = size;
        props.height = size;
    }

    return (
        <Link to={url} className={cx('logo-link')}>
            <svg {...props}>
                <mask id='a'>
                    <path fill='#fff' d='M0 0h70v70H0z' />
                    <g stroke='#000' strokeWidth='8'>
                        <path
                            id='b'
                            fill='#4F82BA'
                            d='M0 70l30-50 10 13L70 0 40 50 30 37 0 70z'
                        />
                    </g>
                </mask>
                <circle
                    mask='url(#a)'
                    fill='none'
                    stroke='#000'
                    strokeWidth='8'
                    cx='35'
                    cy='35'
                    r='30'
                />
                <use xlinkHref='#b' fill='#4F82BA' />
            </svg>
        </Link>
    );
};

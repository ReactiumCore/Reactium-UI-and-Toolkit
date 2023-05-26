import React from 'react';
import { Link } from 'react-router-dom';

export default ({ links = [] }) => (
    <nav className='rtk-toolbar-crumbs'>
        {links.map(({ url, ...obj }, i) => (
            <div key={`bc-${i}`}>
                {i !== 0 && <span className='mx-8'>/</span>}
                {url ? <Link {...obj} to={url} /> : <span {...obj} />}
            </div>
        ))}
    </nav>
);

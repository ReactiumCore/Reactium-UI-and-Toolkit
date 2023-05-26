import { Toolkit } from './index';

export default {
    exact: true,
    component: Toolkit,
    path: [
        '/toolkit/search/:search',
        '/toolkit/:group/:slug/:sub',
        '/toolkit/:group/:slug',
        '/toolkit/:group',
        '/toolkit',
    ],
};

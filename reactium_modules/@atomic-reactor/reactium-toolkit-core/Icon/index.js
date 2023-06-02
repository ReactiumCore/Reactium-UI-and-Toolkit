import cn from 'classnames';
import op from 'object-path';
import Feather from './Feather';
import PropTypes from 'prop-types';

let defaultProps = {
    size: 24,
    className: 'rtk-icon',
    viewBox: '0 0 1024 1024',
    xmlns: 'http://www.w3.org/2000/svg',
};

const Icon = ({ size, value, ...initialProps }) => {
    const Ico = op.get(Icon.icons, value);

    if (!Ico) {
        return null;
    }

    let props = { ...initialProps };

    const { className, namespace } = props;

    if (size) {
        props.width = size;
        props.height = size;
    }

    const cx = cn({
        [className]: !!className,
        [namespace]: !!namespace,
    });

    return Ico({ ...props, width: size, height: size, className: cx });
};

Icon.icons = {
    Feather,
};

Object.entries(Icon.icons).forEach(([key, value]) => {
    Icon[key] = value;
});

Icon.propTypes = {
    className: PropTypes.string,
    namespace: PropTypes.string,
    size: PropTypes.number,
};

Icon.defaultProps = defaultProps;

export { Icon, Icon as default, Feather };

import ReactDOM from 'react-dom';

const Portal = ({ children, target }) => {
    target = target || typeof document !== 'undefined' ? document.body : null;
    return target ? ReactDOM.createPortal(children, target) : children;
};

export { Portal, Portal as default };

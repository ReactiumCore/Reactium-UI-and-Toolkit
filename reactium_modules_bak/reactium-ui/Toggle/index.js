/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import cn from "classnames";
import ENUMS from "./enums";
import PropTypes from "prop-types";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useHookComponent, useRefs, useSyncState } from "reactium-core/sdk";

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Toggle
 * -----------------------------------------------------------------------------
 */
const noop = () => {};
const cname = ({
  className,
  color = ENUMS.COLOR.PRIMARY,
  label,
  labelAlign
}) => {
  const lbl = `ar-toggle-label-${labelAlign}`;
  const clr = `ar-toggle-${color}`;

  return cn({
    [className]: !!className,
    [lbl]: !!label,
    [clr]: true,
    "ar-toggle": true
  });
};

const excludeProps = [
  "className",
  "controlled",
  "element",
  "label",
  "labelAlign",
  "labelStyle",
  "previous",
  "style",
  "title"
];

let Toggle = (props, ref) => {
  const refs = useRefs();

  const state = useSyncState({
    ...props,
    element: null
  });

  const { useStateFromProps, useSyntheticEvents } = useHookComponent(
    "ReactiumUI"
  );

  const { dispatch, prune } = useSyntheticEvents({
    selected: state.get("events", Toggle.EVENTS),
    state
  });

  useStateFromProps({ props, state });

  const propsFromState = () => {
    let output = Object.keys(state.get()).reduce((obj, key) => {
      if (!excludeProps.includes(key)) obj[key] = state.get(key);
      return obj;
    }, {});

    Object.keys(output).forEach(key => {
      if (/^on[A-Z]/.test(key)) {
        const callback = state.get(key);
        output[key] = e => dispatch(e, null, callback);
      }
    });

    return output;
  };

  const blur = () => {
    const element = refs.get("element");
    if (element) element.blur();
  };

  const check = () => {
    const element = refs.get("element");
    if (element) element.check();
  };

  const focus = () => {
    const element = refs.get("element");
    if (element) element.focus();
  };

  const toggle = () => {
    const element = refs.get("element");
    if (element) element.toggle();
  };

  const uncheck = () => {
    const element = refs.get("element");
    if (element) element.uncheck();
  };

  const _onChange = e => {
    state.checked = e.target.checked;
    const onChange = state.get("onChange", noop);
    dispatch(
      e,
      { checked: e.target.checked, value: Boolean(e.target.value) },
      onChange
    );
  };

  state.extend("blur", blur);
  state.extend("check", check);
  state.extend("focus", focus);
  state.extend("toggle", toggle);
  state.extend("uncheck", uncheck);
  state.value = state.get("value");

  useImperativeHandle(ref, () => state);

  useEffect(() => {
    const element = refs.get("element");
    if (!element) return;
    state.input = element;
    state.set("element", element);
  }, [refs.get("element")]);

  useEffect(() => {
    return () => {
      const element = refs.get("element");
      state.set("element", null);
      prune(element);
    };
  }, []);

  useEffect(() => {
    state.value = state.get("value");
  }, [state.get("value")]);

  const render = () => {
    const {
      className,
      label,
      labelAlign,
      labelStyle,
      name,
      style,
      title
    } = state.get();

    const inputProps = propsFromState();

    return (
      <label
        style={style}
        title={title}
        aria-label={label}
        aria-labelledby={!label && name}
        ref={elm => refs.set("label", elm)}
        className={cname({
          label,
          className,
          labelAlign
        })}
      >
        {label && <span children={label} style={labelStyle} />}
        <input
          {...inputProps}
          ref={elm => refs.set("element", elm)}
          onChange={_onChange}
        />
        <span />
      </label>
    );
  };

  return render();
};

Toggle = forwardRef(Toggle);

Toggle.ENUMS = ENUMS;

Toggle.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  controlled: PropTypes.bool,
  id: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  label: PropTypes.any,
  labelAlign: PropTypes.oneOf(Object.values(ENUMS.ALIGN)),
  labelStyle: PropTypes.object,
  style: PropTypes.object,
  title: PropTypes.string,
  type: PropTypes.oneOf(Object.values(ENUMS.TYPE))
};

Toggle.defaultProps = {
  checked: false,
  controlled: false,
  labelAlign: ENUMS.ALIGN.LEFT,
  type: ENUMS.TYPE.CHECKBOX,
  value: null
};

export { Toggle, Toggle as default };
